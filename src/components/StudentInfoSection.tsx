import React from 'react';
import { View, Text } from 'react-native';
import { LabeledInput } from './LabeledInput';

export interface StudentInfo {
  nombre: string;
  codigoCarne: string;
  email: string;
}

interface Props {
  values: StudentInfo;
  onChange: (field: keyof StudentInfo, value: string) => void;
  errors?: Partial<Record<keyof StudentInfo, string>>;
}

export function StudentInfoSection({ values, onChange, errors = {} }: Props) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-gray-900">Datos del estudiante</Text>
      <LabeledInput
        label="Nombre completo"
        testID="input-reserva-nombre"
        placeholder="Karen Lorena Serrano"
        value={values.nombre}
        error={errors.nombre}
        onChangeText={(t) => onChange('nombre', t)}
      />
      <LabeledInput
        label="Codigo/Carne universitario"
        testID="input-codigo-carne"
        placeholder="190000"
        keyboardType="phone-pad"
        value={values.codigoCarne}
        error={errors.codigoCarne}
        onChangeText={(t) => onChange('codigoCarne', t)}
      />
      <LabeledInput
        label="Correo institucional"
        testID="input-correo-institucional"
        placeholder="karen@universidad.edu.co"
        keyboardType="email-address"
        autoCapitalize="none"
        value={values.email}
        error={errors.email}
        onChangeText={(t) => onChange('email', t)}
      />
    </View>
  );
}
