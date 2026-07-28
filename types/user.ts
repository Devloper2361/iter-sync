export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  avatar?: string;
  department?: string;
  semester?: number;
  registrationNumber?: string;
  joinedAt: Date;
}
