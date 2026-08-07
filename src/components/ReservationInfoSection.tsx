import React from 'react';
import { View, Text } from 'react-native';
import { LabeledInput } from './LabeledInput';

export interface ReservationInfo {
  menu: string;
  sede: string;
  horaRecogida: string;
}

interface Props {
  values: ReservationInfo;
  onChange: (field: keyof ReservationInfo, value: string) => void;
}

export function ReservationInfoSection({ values, onChange }: Props) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-gray-900">Informacion de la reserva</Text>
      <LabeledInput
        label="Menu seleccionado"
        testID="input-menu"
        placeholder="Menu del dia"
        value={values.menu}
        onChangeText={(t) => onChange('menu', t)}
      />
      <LabeledInput
        label="Sede/Cafeteria"
        testID="input-sede"
        placeholder="Cafeteria central"
        value={values.sede}
        onChangeText={(t) => onChange('sede', t)}
      />
      <LabeledInput
        label="Hora de recogida"
        testID="input-hora-recogida"
        placeholder="12:30"
        value={values.horaRecogida}
        onChangeText={(t) => onChange('horaRecogida', t)}
      />
    </View>
  );
}
