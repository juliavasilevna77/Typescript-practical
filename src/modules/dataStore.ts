// Центральне сховище масивів даних

import {
  Professor,
  Classroom,
  Course,
  Lesson
} from "../types/scheduleTypes";

export const professors: Professor[] = [];
export const classrooms: Classroom[] = [];
export const courses: Course[] = [];
export let schedule: Lesson[] = [];

// допоміжна функція, якщо треба очищати розклад
export function resetSchedule(): void {
  schedule = [];
}
