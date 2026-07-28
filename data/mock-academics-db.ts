import { AcademicsData } from '@/types/academics';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const mockAcademicsData: AcademicsData = {
  attendance: [
    { id: '1', code: 'CS301', name: 'Data Structures', type: 'Theory', totalClasses: 40, attendedClasses: 35, percentage: 87.5, lastUpdated: new Date() },
    { id: '2', code: 'CS301L', name: 'Data Structures Lab', type: 'Lab', totalClasses: 12, attendedClasses: 12, percentage: 100, lastUpdated: new Date() },
    { id: '3', code: 'CS302', name: 'Operating Systems', type: 'Theory', totalClasses: 38, attendedClasses: 25, percentage: 65.7, lastUpdated: new Date() },
    { id: '4', code: 'CS303', name: 'DBMS', type: 'Theory', totalClasses: 42, attendedClasses: 38, percentage: 90.4, lastUpdated: new Date() },
    { id: '5', code: 'CS303L', name: 'DBMS Lab', type: 'Lab', totalClasses: 14, attendedClasses: 13, percentage: 92.8, lastUpdated: new Date() },
    { id: '6', code: 'MA301', name: 'Discrete Math', type: 'Theory', totalClasses: 45, attendedClasses: 32, percentage: 71.1, lastUpdated: new Date() },
  ],
  attendanceHistory: [
    { id: 'h1', date: today, status: 'Present', type: 'Theory', subjectName: 'Data Structures' },
    { id: 'h2', date: today, status: 'Present', type: 'Theory', subjectName: 'DBMS' },
    { id: 'h3', date: yesterday, status: 'Absent', type: 'Theory', subjectName: 'Operating Systems' },
    { id: 'h4', date: yesterday, status: 'Present', type: 'Lab', subjectName: 'DBMS Lab' },
    { id: 'h5', date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), status: 'Present', type: 'Theory', subjectName: 'Discrete Math' },
  ],
  timetable: [
    { id: 't1', dayOfWeek: 1, startTime: '09:00', endTime: '10:00', courseCode: 'CS301', courseName: 'Data Structures', faculty: 'Dr. Smith', room: 'LT-1', type: 'Theory' },
    { id: 't2', dayOfWeek: 1, startTime: '10:00', endTime: '11:00', courseCode: 'CS302', courseName: 'Operating Systems', faculty: 'Prof. Johnson', room: 'LT-1', type: 'Theory' },
    { id: 't3', dayOfWeek: 1, startTime: '11:00', endTime: '13:00', courseCode: 'CS301L', courseName: 'Data Structures Lab', faculty: 'Dr. Smith', room: 'Lab-A', type: 'Lab' },
    
    { id: 't4', dayOfWeek: 2, startTime: '09:00', endTime: '10:00', courseCode: 'CS303', courseName: 'DBMS', faculty: 'Dr. Brown', room: 'LT-2', type: 'Theory' },
    { id: 't5', dayOfWeek: 2, startTime: '10:00', endTime: '11:00', courseCode: 'MA301', courseName: 'Discrete Math', faculty: 'Prof. Davis', room: 'LT-2', type: 'Theory' },
    
    { id: 't6', dayOfWeek: 3, startTime: '09:00', endTime: '10:00', courseCode: 'CS301', courseName: 'Data Structures', faculty: 'Dr. Smith', room: 'LT-1', type: 'Theory' },
    { id: 't7', dayOfWeek: 3, startTime: '10:00', endTime: '12:00', courseCode: 'CS303L', courseName: 'DBMS Lab', faculty: 'Dr. Brown', room: 'Lab-B', type: 'Lab' },
    
    { id: 't8', dayOfWeek: 4, startTime: '09:00', endTime: '10:00', courseCode: 'CS302', courseName: 'Operating Systems', faculty: 'Prof. Johnson', room: 'LT-1', type: 'Theory' },
    { id: 't9', dayOfWeek: 4, startTime: '11:00', endTime: '12:00', courseCode: 'MA301', courseName: 'Discrete Math', faculty: 'Prof. Davis', room: 'LT-2', type: 'Theory' },
    
    { id: 't10', dayOfWeek: 5, startTime: '09:00', endTime: '10:00', courseCode: 'CS303', courseName: 'DBMS', faculty: 'Dr. Brown', room: 'LT-2', type: 'Theory' },
    { id: 't11', dayOfWeek: 5, startTime: '14:00', endTime: '16:00', courseCode: 'CS301L', courseName: 'Data Structures Lab', faculty: 'Dr. Smith', room: 'Lab-A', type: 'Lab' },
  ],
  results: [
    {
      id: 'sem5',
      semester: 5,
      cgpa: 8.4,
      sgpa: 8.6,
      totalCredits: 24,
      earnedCredits: 24,
      status: 'Pass',
      subjects: [
        { code: 'CS301', name: 'Data Structures', credits: 4, grade: 'A', gradePoints: 9 },
        { code: 'CS301L', name: 'Data Structures Lab', credits: 2, grade: 'O', gradePoints: 10 },
        { code: 'CS302', name: 'Operating Systems', credits: 4, grade: 'B+', gradePoints: 8 },
        { code: 'CS303', name: 'DBMS', credits: 4, grade: 'A', gradePoints: 9 },
        { code: 'CS303L', name: 'DBMS Lab', credits: 2, grade: 'O', gradePoints: 10 },
        { code: 'MA301', name: 'Discrete Math', credits: 4, grade: 'B', gradePoints: 7 },
      ]
    },
    {
      id: 'sem4',
      semester: 4,
      cgpa: 8.35,
      sgpa: 8.1,
      totalCredits: 24,
      earnedCredits: 24,
      status: 'Pass',
      subjects: [
        { code: 'CS201', name: 'Object Oriented Prog', credits: 4, grade: 'A', gradePoints: 9 },
        { code: 'CS201L', name: 'OOP Lab', credits: 2, grade: 'A+', gradePoints: 9 },
        { code: 'CS202', name: 'Computer Architecture', credits: 4, grade: 'B', gradePoints: 7 },
        { code: 'EE201', name: 'Basic Electronics', credits: 4, grade: 'B+', gradePoints: 8 },
        { code: 'MA201', name: 'Engineering Math IV', credits: 4, grade: 'B', gradePoints: 7 },
      ]
    }
  ],
  calendar: [
    { id: 'c1', title: 'Mid Semester Examination', date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), endDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000), type: 'Exam', description: 'Mid term exams for all semesters' },
    { id: 'c2', title: 'Course Registration Starts', date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), type: 'Registration', description: 'Registration for current semester' },
    { id: 'c3', title: 'Diwali Holiday', date: new Date(today.getFullYear(), 10, 1), type: 'Holiday', description: 'Campus closed for Diwali' },
    { id: 'c4', title: 'End Semester Examination', date: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000), endDate: new Date(today.getTime() + 75 * 24 * 60 * 60 * 1000), type: 'Exam', description: 'Final exams' },
  ]
};
