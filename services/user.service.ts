import { userRepository } from '@/repositories/user.repository';
import { User } from '@/types/user';

export class UserService {
  async authenticateUser(email: string): Promise<User> {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserDetails(id: string): Promise<User> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export const userService = new UserService();
