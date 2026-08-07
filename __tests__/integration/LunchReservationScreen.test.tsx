import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LunchReservationScreen } from '../../src/screens/LunchReservationScreen';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <LunchReservationScreen />
    </SafeAreaProvider>
  );

const fill = (testID: string, value: string) =>
  fireEvent.changeText(screen.getByTestId(testID), value);

const fillAll = async (entries: [string, string][]) => {
  for (const [testID, value] of entries) {
    await fill(testID, value);
  }
};

const validReservation: [string, string][] = [
  ['input-reserva-nombre', 'Juan Perez'],
  ['input-codigo-carne', '20240001'],
  ['input-correo-institucional', 'juan@universidad.edu.co'],
  ['input-menu', 'Menu vegetariano'],
  ['input-sede', 'Cafeteria central'],
  ['input-hora-recogida', '12:30'],
  ['input-titular', 'Juan Perez'],
  ['input-numero-tarjeta', '4111111111111111'],
  ['input-vencimiento', '12/28'],
  ['input-cvv', '123'],
];

describe('LunchReservationScreen - Integracion', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('muestra error de validacion si faltan campos', async () => {
    await renderScreen();

    await fireEvent.press(screen.getByText('Confirmar y Pagar Reserva'));

    expect(screen.getByText('Completa todos los campos antes de continuar')).toBeTruthy();
  });

  it('muestra errores de formato y no envia la reserva', async () => {
    await renderScreen();

    await fillAll([
      ['input-reserva-nombre', 'Juan123'],
      ['input-codigo-carne', 'ABC123'],
      ['input-correo-institucional', 'juan-universidad.edu.co'],
      ['input-menu', 'Menu del dia'],
      ['input-sede', 'Cafeteria central'],
      ['input-hora-recogida', '12:30'],
      ['input-titular', 'Juan Perez'],
      ['input-numero-tarjeta', '4111-1111-1111-1111'],
      ['input-vencimiento', '13/2028'],
      ['input-cvv', '123'],
    ]);
    await fireEvent.press(screen.getByText('Confirmar y Pagar Reserva'));

    expect(screen.getByText('El nombre solo permite letras')).toBeTruthy();
    expect(screen.getByText('El codigo/carne solo permite numeros')).toBeTruthy();
    expect(screen.getByText('Correo institucional invalido')).toBeTruthy();
    expect(screen.getByText('El numero de tarjeta solo permite numeros')).toBeTruthy();
    expect(screen.getByText('El vencimiento debe tener formato MM/AA')).toBeTruthy();
    expect(screen.queryByText('Reserva de almuerzo confirmada exitosamente')).toBeNull();
  });

  it('confirma, paga y guarda la reserva en AsyncStorage', async () => {
    await renderScreen();

    await fillAll(validReservation);
    await fireEvent.press(screen.getByText('Confirmar y Pagar Reserva'));

    await waitFor(() => {
      expect(screen.getByText('Reserva de almuerzo confirmada exitosamente')).toBeTruthy();
    });
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'lunchReservations',
        expect.stringContaining('Juan Perez')
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('input-reserva-nombre')).toHaveProp('value', '');
      expect(screen.getByTestId('input-codigo-carne')).toHaveProp('value', '');
      expect(screen.getByTestId('input-correo-institucional')).toHaveProp('value', '');
      expect(screen.getByTestId('input-menu')).toHaveProp('value', '');
      expect(screen.getByTestId('input-sede')).toHaveProp('value', '');
      expect(screen.getByTestId('input-hora-recogida')).toHaveProp('value', '');
      expect(screen.getByTestId('input-titular')).toHaveProp('value', '');
      expect(screen.getByTestId('input-numero-tarjeta')).toHaveProp('value', '');
      expect(screen.getByTestId('input-vencimiento')).toHaveProp('value', '');
      expect(screen.getByTestId('input-cvv')).toHaveProp('value', '');
    });
  });

  it('limpia la confirmacion anterior cuando una correccion deja campos invalidos', async () => {
    await renderScreen();

    await fillAll(validReservation);
    await fireEvent.press(screen.getByText('Confirmar y Pagar Reserva'));
    await waitFor(() => {
      expect(screen.getByText('Reserva de almuerzo confirmada exitosamente')).toBeTruthy();
    });

    await fillAll([
      ['input-reserva-nombre', 'Juan123'],
      ...validReservation.slice(1),
    ]);
    await fireEvent.press(screen.getByText('Confirmar y Pagar Reserva'));

    expect(screen.getByText('El nombre solo permite letras')).toBeTruthy();
    expect(screen.queryByText('Reserva de almuerzo confirmada exitosamente')).toBeNull();
  });

  it('muestra error cuando no puede guardar la reserva', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('storage failed'));
    await renderScreen();

    await fillAll(validReservation);
    await fireEvent.press(screen.getByText('Confirmar y Pagar Reserva'));

    await waitFor(() => {
      expect(screen.getByText('Error al guardar la reserva')).toBeTruthy();
    });
  });
});
