// Усі основні операції з розкладом

import {
  Professor,
  Classroom,
  Course,
  Lesson,
  TimeSlot,
  DayOfWeek,
  CourseType,
  ScheduleConflict
} from "../types/scheduleTypes";

import {
  professors,
  classrooms,
  courses,
  schedule
} from "./dataStore";

import { validateLesson } from "./scheduleValidation";

// додавання базових сутностей
export function addProfessor(professor: Professor): void {
  professors.push(professor);
}

export function addClassroom(classroom: Classroom): void {
  classrooms.push(classroom);
}

export function addCourse(course: Course): void {
  courses.push(course);
}

// додавання заняття з перевіркою конфлікту
export function addLesson(lesson: Lesson): boolean {
  const conflict: ScheduleConflict | null = validateLesson(lesson);

  if (conflict !== null) {
    console.log("Неможливо додати заняття — конфлікт:", conflict);
    return false;
  }

  schedule.push(lesson);
  return true;
}

// пошук вільних аудиторій
export function findAvailableClassrooms(
  timeSlot: TimeSlot,
  dayOfWeek: DayOfWeek
): string[] {
  const busyClassrooms: string[] = schedule
    .filter(
      (lesson: Lesson): boolean =>
        lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek
    )
    .map((lesson: Lesson): string => lesson.classroomNumber);

  const available: string[] = classrooms
    .filter(
      (room: Classroom): boolean => !busyClassrooms.includes(room.number)
    )
    .map((room: Classroom): string => room.number);

  return available;
}

// розклад конкретного викладача
export function getProfessorSchedule(
  professorId: number
): Lesson[] {
  return schedule.filter(
    (lesson: Lesson): boolean => lesson.professorId === professorId
  );
}

// завантаженість аудиторії у %
export function getClassroomUtilization(
  classroomNumber: string
): number {
  const totalLessons: number = schedule.length;

  if (totalLessons === 0) {
    return 0;
  }

  const usedLessons: number = schedule.filter(
    (lesson: Lesson): boolean =>
      lesson.classroomNumber === classroomNumber
  ).length;

  const utilization: number = (usedLessons / totalLessons) * 100;

  return Math.round(utilization);
}

// найпопулярніший тип занять
export function getMostPopularCourseType(): CourseType {
  const counts: { [key in CourseType]?: number } = {};

  for (const lesson of schedule) {
    const course: Course | undefined = courses.find(
      (c: Course): boolean => c.id === lesson.courseId
    );

    if (course) {
      const key: CourseType = course.type;
      const current: number = counts[key] ?? 0;
      counts[key] = current + 1;
    }
  }

  let resultType: CourseType = "Lecture";
  let maxCount: number = -1;

  const allTypes: CourseType[] = ["Lecture", "Seminar", "Lab", "Practice"];
  for (const type of allTypes) {
    const value: number = counts[type] ?? 0;
    if (value > maxCount) {
      maxCount = value;
      resultType = type;
    }
  }

  return resultType;
}

// переназначення аудиторії
export function reassignClassroom(
  lessonId: number,
  newClassroomNumber: string
): boolean {
  const lesson: Lesson | undefined = schedule.find(
    (item: Lesson): boolean => item.id === lessonId
  );

  if (!lesson) {
    return false;
  }

  const testLesson: Lesson = {
    ...lesson,
    classroomNumber: newClassroomNumber
  };

  const conflict: ScheduleConflict | null = validateLesson(testLesson);

  if (conflict !== null) {
    console.log("Неможливо перенести заняття — конфлікт:", conflict);
    return false;
  }

  lesson.classroomNumber = newClassroomNumber;
  return true;
}

// скасування заняття
export function cancelLesson(lessonId: number): void {
  const index: number = schedule.findIndex(
    (lesson: Lesson): boolean => lesson.id === lessonId
  );

  if (index !== -1) {
    schedule.splice(index, 1);
  }
}
