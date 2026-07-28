export interface AttendanceSubject {
  id: string;
  code: string;
  name: string;
  type: 'Theory' | 'Lab';
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  lastUpdated: Date;
}

export interface AttendanceHistory {
  id: string;
  date: Date;
  status: 'Present' | 'Absent';
  type: 'Theory' | 'Lab';
  subjectName: string;
}

export interface TimetableClass {
  id: string;
  dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  room: string;
  type: 'Theory' | 'Lab';
}

export interface ResultSubject {
  code: string;
  name: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

export interface SemesterResult {
  id: string;
  semester: number;
  cgpa: number;
  sgpa: number;
  totalCredits: number;
  earnedCredits: number;
  status: 'Pass' | 'Fail';
  subjects: ResultSubject[];
}

export interface AcademicEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  type: 'Exam' | 'Holiday' | 'Registration' | 'Other';
  description: string;
}

export interface AcademicsData {
  attendance: AttendanceSubject[];
  attendanceHistory: AttendanceHistory[];
  timetable: TimetableClass[];
  results: SemesterResult[];
  calendar: AcademicEvent[];
}
