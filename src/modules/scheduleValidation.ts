// Перевірка конфліктів у розкладі

import { Lesson, ScheduleConflict } from "../types/scheduleTypes";
import { schedule } from "./dataStore";

export function validateLesson(lesson: Lesson): ScheduleConflict | null {
  for (const existing of schedule) {
    const sameDay: boolean = existing.dayOfWeek === lesson.dayOfWeek;
    const sameSlot: boolean = existing.timeSlot === lesson.timeSlot;

    if (sameDay && sameSlot) {
      const sameProfessor: boolean =
        existing.professorId === lesson.professorId;
      const sameClassroom: boolean =
        existing.classroomNumber === lesson.classroomNumber;

      if (sameProfessor) {
        return {
          type: "ProfessorConflict",
          lessonDetails: existing
        };
      }

      if (sameClassroom) {
        return {
          type: "ClassroomConflict",
          lessonDetails: existing
        };
      }
    }
  }

  return null;
}
