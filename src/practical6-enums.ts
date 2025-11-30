// Практична робота №6
// Тема: TypeScript & Enum

// ----------------------
// ENUM-и
// ----------------------

enum StudentStatus {
  Active = "Active",
  Academic_Leave = "Academic_Leave",
  Graduated = "Graduated",
  Expelled = "Expelled",
}

enum CourseType {
  Mandatory = "Mandatory",
  Optional = "Optional",
  Special = "Special",
}

enum Semester {
  First = "First",
  Second = "Second",
}

enum Grade {
  Excellent = 5,
  Good = 4,
  Satisfactory = 3,
  Unsatisfactory = 2,
}

enum Faculty {
  Computer_Science = "Computer_Science",
  Economics = "Economics",
  Law = "Law",
  Engineering = "Engineering",
}

// ----------------------
// ІНТЕРФЕЙСИ
// ----------------------

interface Student {
  id: number;
  fullName: string;
  faculty: Faculty;
  year: number;
  status: StudentStatus;
  enrollmentDate: Date;
  groupNumber: string;
}

interface Course {
  id: number;
  name: string;
  type: CourseType;
  credits: number;
  semester: Semester;
  faculty: Faculty;
  maxStudents: number;
}

// Окремий тип для виставлених оцінок
interface GradeRecord {
  studentId: number;
  courseId: number;
  grade: Grade;
  date: Date;
  semester: Semester;
}

type CourseRegistration = {
  studentId: number;
  courseId: number;
};

// ----------------------
// КЛАС СИСТЕМИ
// ----------------------

class UniversityManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [];
  private registrations: CourseRegistration[] = [];
  private grades: GradeRecord[] = [];

  private nextStudentId = 1;
  private nextCourseId = 1;

  public addCourse(course: Omit<Course, "id">): Course {
    const newCourse: Course = { ...course, id: this.nextCourseId++ };
    this.courses.push(newCourse);
    return newCourse;
  }

  public enrollStudent(data: Omit<Student, "id">): Student {
    const student: Student = { ...data, id: this.nextStudentId++ };
    this.students.push(student);
    return student;
  }

  public registerForCourse(studentId: number, courseId: number): void {
    const student = this.students.find(s => s.id === studentId);
    const course = this.courses.find(c => c.id === courseId);

    if (!student) throw new Error("Студента не знайдено");
    if (!course) throw new Error("Курс не знайдено");
    if (student.status !== StudentStatus.Active) {
      throw new Error("Студент не активний");
    }
    if (student.faculty !== course.faculty) {
      throw new Error("Факультет не співпадає з факультетом курсу");
    }

    const count = this.registrations.filter(r => r.courseId === courseId).length;
    if (count >= course.maxStudents) {
      throw new Error("Курс вже заповнений");
    }

    const already = this.registrations.some(
      r => r.studentId === studentId && r.courseId === courseId
    );
    if (already) {
      throw new Error("Студент вже зареєстрований на цей курс");
    }

    this.registrations.push({ studentId, courseId });
  }

  public setGrade(studentId: number, courseId: number, grade: Grade): void {
    const student = this.students.find(s => s.id === studentId);
    const course = this.courses.find(c => c.id === courseId);

    if (!student || !course) {
      throw new Error("Студента або курс не знайдено");
    }

    const registered = this.registrations.some(
      r => r.studentId === studentId && r.courseId === courseId
    );
    if (!registered) {
      throw new Error("Студент не зареєстрований на курс");
    }

    const record: GradeRecord = {
      studentId,
      courseId,
      grade,
      date: new Date(),
      semester: course.semester,
    };

    this.grades.push(record);
  }

  public updateStudentStatus(id: number, status: StudentStatus): void {
    const student = this.students.find(s => s.id === id);
    if (!student) throw new Error("Студента не знайдено");

    if (
      (student.status === StudentStatus.Graduated ||
        student.status === StudentStatus.Expelled) &&
      status === StudentStatus.Active
    ) {
      throw new Error("Не можна повернути статус у Active");
    }

    student.status = status;
  }

  public getStudentsByFaculty(faculty: Faculty): Student[] {
    return this.students.filter(s => s.faculty === faculty);
  }

  public getStudentGrades(studentId: number): GradeRecord[] {
    return this.grades.filter(g => g.studentId === studentId);
  }

  public getAvailableCourses(
    faculty: Faculty,
    semester: Semester
  ): Course[] {
    return this.courses.filter(
      c => c.faculty === faculty && c.semester === semester
    );
  }

  public calculateAverageGrade(studentId: number): number {
    const records = this.getStudentGrades(studentId);
    if (records.length === 0) return 0;

    const sum = records.reduce((acc, r) => acc + r.grade, 0);
    return sum / records.length;
  }

  public getExcellentStudentsByFaculty(faculty: Faculty): Student[] {
    return this.getStudentsByFaculty(faculty).filter(
      s => this.calculateAverageGrade(s.id) >= 4.5
    );
  }
}

// ----------------------
// Демонстрація роботи
// ----------------------

const ums = new UniversityManagementSystem();

const course1 = ums.addCourse({
  name: "Програмування",
  type: CourseType.Mandatory,
  credits: 5,
  semester: Semester.First,
  faculty: Faculty.Computer_Science,
  maxStudents: 2,
});

const student1 = ums.enrollStudent({
  fullName: "Іван Іваненко",
  faculty: Faculty.Computer_Science,
  year: 1,
  status: StudentStatus.Active,
  enrollmentDate: new Date(),
  groupNumber: "CS-101",
});

const student2 = ums.enrollStudent({
  fullName: "Петро Петренко",
  faculty: Faculty.Computer_Science,
  year: 1,
  status: StudentStatus.Active,
  enrollmentDate: new Date(),
  groupNumber: "CS-101",
});

ums.registerForCourse(student1.id, course1.id);
ums.registerForCourse(student2.id, course1.id);

ums.setGrade(student1.id, course1.id, Grade.Excellent);
ums.setGrade(student2.id, course1.id, Grade.Good);

console.log("Відмінники:", ums.getExcellentStudentsByFaculty(Faculty.Computer_Science));
