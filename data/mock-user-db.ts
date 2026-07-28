import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ashish Singh',
    email: 'student@iter.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ashish',
    department: 'Computer Science & Engineering',
    semester: 6,
    registrationNumber: '2141001234',
    joinedAt: new Date('2021-08-01'),
  },
  {
    id: '2',
    name: 'Dr. Jane Smith',
    email: 'faculty@iter.edu',
    role: 'faculty',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    department: 'Computer Science & Engineering',
    joinedAt: new Date('2018-05-15'),
  },
  {
    id: '3',
    name: 'Admin Admin',
    email: 'admin@iter.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    department: 'Administration',
    joinedAt: new Date('2015-01-10'),
  },
];
