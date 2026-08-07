import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, InputAccessoryView, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StudentInfoSection, StudentInfo } from '../components/StudentInfoSection';
import { ReservationInfoSection, ReservationInfo } from '../components/ReservationInfoSection';
import { PaymentInfoSection, PaymentInfo } from '../components/PaymentInfoSection';
import { KEYBOARD_ACCESSORY_ID } from '../components/LabeledInput';
import { validateLunchReservation } from '../schemas/lunchReservationSchema';
import { useLunchReservation } from '../hooks/useLunchReservation';

const emptyStudent: StudentInfo = { nombre: '', codigoCarne: '', email: '' };
const emptyReservation: ReservationInfo = { menu: '', sede: '', horaRecogida: '' };
const emptyPayment: PaymentInfo = { titular: '', numeroTarjeta: '', vencimiento: '', cvv: '' };

const allFilled = (...groups: object[]) =>
  groups.every((g) => Object.values(g).every((v) => String(v).trim().length > 0));

export function LunchReservationScreen() {
  const insets = useSafeAreaInsets();
  const [student, setStudent] = useState(emptyStudent);
  const [reservationInfo, setReservationInfo] = useState(emptyReservation);
  const [payment, setPayment] = useState(emptyPayment);
  const [requiredError, setRequiredError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const {
    status,
    reservation,
    error,
    submit: submitReservation,
    reset: resetReservation,
  } = useLunchReservation();

  const submit = async () => {
    if (!allFilled(student, reservationInfo, payment)) {
      setErrors({});
      setRequiredError(true);
      resetReservation();
      return;
    }

    const found = validateLunchReservation({ ...student, ...reservationInfo, ...payment });
    setErrors(found);
    setRequiredError(false);
    if (Object.keys(found).length > 0) {
      resetReservation();
      return;
    }

    const created = await submitReservation({ ...student, ...reservationInfo, ...payment });
    if (!created) return;

    setStudent(emptyStudent);
    setReservationInfo(emptyReservation);
    setPayment(emptyPayment);
    setErrors({});
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerClassName="gap-5 p-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <StudentInfoSection
          values={student}
          errors={errors}
          onChange={(f, v) => setStudent((s) => ({ ...s, [f]: v }))}
        />
        <ReservationInfoSection
          values={reservationInfo}
          onChange={(f, v) => setReservationInfo((s) => ({ ...s, [f]: v }))}
        />
        <PaymentInfoSection
          values={payment}
          errors={errors}
          onChange={(f, v) => setPayment((s) => ({ ...s, [f]: v }))}
        />

        {requiredError && (
          <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
            Completa todos los campos antes de continuar
          </Text>
        )}
        {status === 'error' && (
          <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </Text>
        )}
        {status === 'success' && (
          <Text className="rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-800">
            {reservation?.message ?? 'Reserva confirmada exitosamente'}
          </Text>
        )}

        <Pressable
          onPress={submit}
          accessibilityRole="button"
          accessibilityLabel="Confirmar y Pagar Reserva"
          disabled={status === 'loading'}
          className="rounded-lg bg-purple-600 py-3 active:bg-purple-700"
        >
          <Text className="text-center text-base font-semibold text-white">
            {status === 'loading' ? 'Confirmando reserva...' : 'Confirmar y Pagar Reserva'}
          </Text>
        </Pressable>

        <View className="h-2" />
      </ScrollView>
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={KEYBOARD_ACCESSORY_ID}>
          <View className="flex-row justify-end border-t border-gray-200 bg-gray-100 px-4 py-2">
            <Pressable onPress={() => Keyboard.dismiss()} accessibilityRole="button">
              <Text className="text-base font-semibold text-blue-600">Listo</Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </>
  );
}
