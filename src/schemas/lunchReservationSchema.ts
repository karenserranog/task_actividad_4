import { z } from 'zod';

const SOLO_LETRAS = /^[\p{L}\s'.-]+$/u;
const SOLO_DIGITOS = /^\d+$/;
const MM_AA = /^(0[1-9]|1[0-2])\/\d{2}$/;

export const lunchReservationSchema = z.object({
  nombre: z.string().regex(SOLO_LETRAS, 'El nombre solo permite letras'),
  codigoCarne: z.string().regex(SOLO_DIGITOS, 'El codigo/carne solo permite numeros'),
  email: z.string().email('Correo institucional invalido'),
  numeroTarjeta: z.string().regex(SOLO_DIGITOS, 'El numero de tarjeta solo permite numeros'),
  vencimiento: z.string().regex(MM_AA, 'El vencimiento debe tener formato MM/AA'),
});

export type LunchReservationFields = keyof z.infer<typeof lunchReservationSchema>;

export function validateLunchReservation(
  values: Record<string, string>
): Partial<Record<LunchReservationFields, string>> {
  const result = lunchReservationSchema.safeParse(values);
  if (result.success) return {};
  return Object.fromEntries(
    Object.entries(result.error.flatten().fieldErrors).map(([field, msgs]) => [field, msgs?.[0]])
  );
}
