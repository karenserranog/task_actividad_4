import { z } from 'zod';

const onlyLetters = /^[\p{L}\s'.-]+$/u;
const onlyDigits = /^\d+$/;
const expirationDate = /^(0[1-9]|1[0-2])\/\d{2}$/;
const pickupTime = /^([01]\d|2[0-3]):[0-5]\d$/;
const confirmationCode = /^ALM-\d+$/;

const LunchReservationRequestContractSchema = z.object({
  nombre: z.string().min(1).regex(onlyLetters),
  codigoCarne: z.string().min(1).regex(onlyDigits),
  email: z.string().email(),
  menu: z.string().min(1),
  sede: z.string().min(1),
  horaRecogida: z.string().regex(pickupTime),
  titular: z.string().min(1).regex(onlyLetters),
  numeroTarjeta: z.string().min(13).max(19).regex(onlyDigits),
  vencimiento: z.string().regex(expirationDate),
  cvv: z.string().min(3).max(4).regex(onlyDigits),
});

const LunchReservationResponseContractSchema = LunchReservationRequestContractSchema.extend({
  id: z.string().min(1),
  status: z.enum(['confirmed']),
  confirmationCode: z.string().regex(confirmationCode),
  message: z.string().min(1),
});

const LunchReservationListContractSchema = z.array(LunchReservationResponseContractSchema);

describe('API Contract - Lunch Reservations', () => {
  it('valida una respuesta correcta de POST /lunch-reservations', () => {
    const apiResponse = {
      id: '1',
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
      status: 'confirmed',
      confirmationCode: 'ALM-1',
      message: 'Reserva de almuerzo confirmada exitosamente',
    };

    const result = LunchReservationResponseContractSchema.safeParse(apiResponse);

    expect(result.success).toBe(true);
  });

  it('detecta una respuesta invalida de POST /lunch-reservations', () => {
    const invalidApiResponse = {
      id: 1,
      nombre: 'Juan123',
      codigoCarne: 'ABC-2024',
      email: 'correo-invalido',
      menu: '',
      sede: 'Cafeteria central',
      horaRecogida: '25:99',
      titular: 'Juan Perez',
      numeroTarjeta: '4111-1111-1111-1111',
      vencimiento: '13/28',
      cvv: '12',
      status: 'pending',
      confirmationCode: 'RES-1',
      message: '',
    };

    const result = LunchReservationResponseContractSchema.safeParse(invalidApiResponse);

    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldsWithErrors = Object.keys(result.error.flatten().fieldErrors);
      expect(fieldsWithErrors).toEqual(
        expect.arrayContaining([
          'id',
          'nombre',
          'codigoCarne',
          'email',
          'menu',
          'horaRecogida',
          'numeroTarjeta',
          'vencimiento',
          'cvv',
          'status',
          'confirmationCode',
          'message',
        ])
      );
    }
  });

  it('valida una lista correcta de GET /lunch-reservations', () => {
    const apiResponse = [
      {
        id: '1',
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
        status: 'confirmed',
        confirmationCode: 'ALM-1',
        message: 'Reserva de almuerzo confirmada exitosamente',
      },
    ];

    const result = LunchReservationListContractSchema.safeParse(apiResponse);

    expect(result.success).toBe(true);
  });
});
