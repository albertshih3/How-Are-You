import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const AuthCredentialsValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'}),
    name: z.string().min(1, {message: 'Name cannot be empty!'})
  });

export type TAuthCredentialsValudator = z.infer<typeof AuthCredentialsValidator>;