import React from 'react';
import { render, screen } from '@testing-library/react-native';
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

describe('LunchReservationScreen - Accesibilidad', () => {
  it('el boton de confirmar y pagar tiene label y rol accesibles', async () => {
    await renderScreen();

    const button = screen.getByLabelText('Confirmar y Pagar Reserva');

    expect(button).toBeTruthy();
    expect(button).toHaveProp('accessibilityRole', 'button');
  });

  it('los campos principales exponen etiquetas accesibles', async () => {
    await renderScreen();

    expect(screen.getByLabelText('Nombre completo')).toBeTruthy();
    expect(screen.getByLabelText('Correo institucional')).toBeTruthy();
    expect(screen.getByLabelText('Menu seleccionado')).toBeTruthy();
    expect(screen.getByLabelText('Titular de la tarjeta')).toBeTruthy();
  });
});
