import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import {
  createLunchReservation,
  fetchLunchReservations,
} from '../../src/services/lunchReservationService';
import { LunchReservationRequest } from '../../src/types';

const API_URL = 'https://api.taskmanager.com';

const validReservation: LunchReservationRequest = {
  nombre: 'Juan Perez',
  codigoCarne: '20240001',
  email: 'juan@universidad.edu.co',
  menu: 'Menu vegetariano',
  sede: 'Cafeteria central',
  horaRecogida: '12:30',
  titular: 'Juan Perez',
  numeroTarjeta: '4111111111111111',
  vencimiento: '12/28',
  cvv: '123',
};

describe('lunchReservationService contra la API falsa', () => {
  it('crea la reserva con lo que responde la API', async () => {
    const reservation = await createLunchReservation(validReservation);

    expect(reservation).toMatchObject({
      ...validReservation,
      status: 'confirmed',
      confirmationCode: 'ALM-1',
      message: 'Reserva de almuerzo confirmada exitosamente',
    });
  });

  it('la reserva creada aparece en el GET', async () => {
    await createLunchReservation(validReservation);

    await expect(fetchLunchReservations()).resolves.toHaveLength(1);
    await expect(fetchLunchReservations()).resolves.toEqual([
      expect.objectContaining({
        nombre: 'Juan Perez',
        codigoCarne: '20240001',
        menu: 'Menu vegetariano',
        status: 'confirmed',
      }),
    ]);
  });

  it('lanza error cuando POST /lunch-reservations falla', async () => {
    server.use(
      http.post(`${API_URL}/lunch-reservations`, () => new HttpResponse(null, { status: 500 }))
    );

    await expect(createLunchReservation(validReservation)).rejects.toThrow(
      'Error al confirmar la reserva'
    );
  });

  it('lanza error cuando GET /lunch-reservations falla', async () => {
    server.use(
      http.get(`${API_URL}/lunch-reservations`, () => new HttpResponse(null, { status: 500 }))
    );

    await expect(fetchLunchReservations()).rejects.toThrow(
      'Error al obtener las reservas de almuerzo'
    );
  });
});
