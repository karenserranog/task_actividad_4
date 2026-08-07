import { LunchReservationRequest, LunchReservationResponse } from '../types';

const API_URL = 'https://api.taskmanager.com';

export async function fetchLunchReservations(): Promise<LunchReservationResponse[]> {
  const res = await fetch(`${API_URL}/lunch-reservations`);
  if (!res.ok) throw new Error('Error al obtener las reservas de almuerzo');
  return res.json();
}

export async function createLunchReservation(
  reservation: LunchReservationRequest
): Promise<LunchReservationResponse> {
  const res = await fetch(`${API_URL}/lunch-reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservation),
  });
  if (!res.ok) throw new Error('Error al confirmar la reserva');
  return res.json();
}
