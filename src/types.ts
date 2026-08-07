export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt?: string;
}

export interface LunchReservationRequest {
  nombre: string;
  codigoCarne: string;
  email: string;
  menu: string;
  sede: string;
  horaRecogida: string;
  titular: string;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
}

export interface LunchReservationResponse extends LunchReservationRequest {
  id: string;
  status: 'confirmed';
  confirmationCode: string;
  message: string;
}
