export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  avatarUrl?: string;
  joinedAt: Date;
}
