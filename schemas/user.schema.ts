import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['student', 'faculty', 'admin']),
  avatar: z.string().optional(),
  department: z.string().optional(),
  semester: z.number().optional(),
  registrationNumber: z.string().optional(),
  joinedAt: z.date(),
});

export type UserDTO = z.infer<typeof UserSchema>;
