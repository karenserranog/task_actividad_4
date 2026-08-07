import { http, HttpResponse } from 'msw';
import { LunchReservationRequest, LunchReservationResponse, Task } from '../types';

const API_URL = 'https://api.taskmanager.com';

// ponytail: la "API falsa" es un array en memoria; resetTasks lo limpia entre tests
let tasks: Task[] = [];
let lunchReservations: LunchReservationResponse[] = [];

export const resetTasks = () => {
  tasks = [];
};

export const resetLunchReservations = () => {
  lunchReservations = [];
};

export const handlers = [
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const { title } = (await request.json()) as { title: string };
    const task: Task = { id: String(tasks.length + 1), title, status: 'pending' };
    tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.get(`${API_URL}/tasks`, () => HttpResponse.json(tasks)),

  http.post(`${API_URL}/lunch-reservations`, async ({ request }) => {
    const payload = (await request.json()) as LunchReservationRequest;
    const reservation: LunchReservationResponse = {
      id: String(lunchReservations.length + 1),
      ...payload,
      status: 'confirmed',
      confirmationCode: `ALM-${lunchReservations.length + 1}`,
      message: 'Reserva de almuerzo confirmada exitosamente',
    };
    lunchReservations.push(reservation);
    return HttpResponse.json(reservation, { status: 201 });
  }),

  http.get(`${API_URL}/lunch-reservations`, () => HttpResponse.json(lunchReservations)),
];

// https://api.taskmanager.com/tasks - POST
/**
{
  {
    id: "234234",
    title: "Tarea 1",
    status: 'pending'
  },
  { status: 201 }
}
*/

// https://api.taskmanager.com/tasks - GET
/**
[
  {
    id: "234234",
    title: "Tarea 1",
    status: 'pending'
  }
]
*/
