import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LunchReservationRequest, LunchReservationResponse } from '../types';

const STORAGE_KEY = 'lunchReservations';

export function useLunchReservation() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reservation, setReservation] = useState<LunchReservationResponse | null>(null);
  const [reservations, setReservations] = useState<LunchReservationResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStatus('idle');
    setReservation(null);
    setError(null);
  };

  const submit = async (values: LunchReservationRequest) => {
    setStatus('loading');
    setError(null);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const stored = raw ? (JSON.parse(raw) as LunchReservationResponse[]) : [];
      const created: LunchReservationResponse = {
        id: String(stored.length + 1),
        ...values,
        status: 'confirmed',
        confirmationCode: `ALM-${stored.length + 1}`,
        message: 'Reserva de almuerzo confirmada exitosamente',
      };
      const nextReservations = [...stored, created];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextReservations));
      setReservations(nextReservations);
      setReservation(created);
      setStatus('success');
      return created;
    } catch (err) {
      setReservation(null);
      setError('Error al guardar la reserva');
      setStatus('error');
      return null;
    }
  };

  return { status, reservation, reservations, error, submit, reset };
}
