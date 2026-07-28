import { User } from '@/types/user';
import { mockUsers } from '@/data/mock-user-db';

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
}

export class MockUserRepository implements IUserRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  }

  async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.id === id);
    return user || null;
  }
}

export const userRepository = new MockUserRepository();
