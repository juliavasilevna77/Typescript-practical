// Головний файл, який підключає всі модулі і запускає демо

import {
  Professor,
  Classroom,
  Course,
  Lesson
} from "./types/scheduleTypes";

import {
  addProfessor,
  addClassroom,
  addCourse,
  addLesson,
  findAvailableClassrooms,
  getProfessorSchedule,
  getClassroomUtilization,
  getMostPopularCourseType,
  reassignClassroom,
  cancelLesson
} from "./modules/scheduleOperations";

import {
  professors,
  classrooms,
  courses,
  schedule
} from "./modules/dataStore";

// заповнюємо тестові дані
function seedData(): void {
  const prof1: Professor = {
    id: 1,
    name: "Dr. Smith",
    department: "Mathematics"
  };

  const prof2: Professor = {
    id: 2,
    name: "Prof. Ivanenko",
    department: "Physics"
  };

  addProfessor(prof1);
  addProfessor(prof2);

  const room101: Classroom = {
    number: "101",
    capacity: 40,
    hasProjector: true
  };

  const room202: Classroom = {
    number: "202",
    capacity: 30,
    hasProjector: false
  };

  addClassroom(room101);
  addClassroom(room202);

  const algebra: Course = {
    id: 1,
    name: "Algebra",
    type: "Lecture"
  };

  const physicsLab: Course = {
    id: 2,
    name: "Physics Lab",
    type: "Lab"
  };

  addCourse(algebra);
  addCourse(physicsLab);

  const lesson1: Lesson = {
    id: 1,
    courseId: 1,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
  };

  const lesson2: Lesson = {
    id: 2,
    courseId: 2,
    professorId: 2,
    classroomNumber: "202",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
  };

  addLesson(lesson1);
  addLesson(lesson2);
}

// демонстрація роботи системи
function runDemo(): void {
  seedData();

  console.log("Список викладачів:", professors);
  console.log("Список аудиторій:", classrooms);
  console.log("Список курсів:", courses);
  console.log("Поточний розклад:", schedule);

  const available: string[] = findAvailableClassrooms(
    "10:15-11:45",
    "Monday"
  );
  console.log("Вільні аудиторії в понеділок 10:15-11:45:", available);

  const profSchedule: Lesson[] = getProfessorSchedule(1);
  console.log("Розклад викладача 1:", profSchedule);

  const utilization101: number = getClassroomUtilization("101");
  console.log("Завантаженість аудиторії 101:", utilization101, "%");

  const popularType: string = getMostPopularCourseType();
  console.log("Найпопулярніший тип занять:", popularType);

  const reassignResult: boolean = reassignClassroom(1, "202");
  console.log(
    "Результат перенесення заняття 1 в 202:",
    reassignResult
  );

  cancelLesson(2);
  console.log("Розклад після скасування заняття 2:", schedule);
}

runDemo();
