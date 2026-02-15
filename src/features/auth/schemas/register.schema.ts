// src/features/auth/schemas/register.schema.ts
import { z } from 'zod';

/**
 * Register Form Schema
 * Note: Password matching is handled in the form component for better UX
 * This allows real-time feedback as user types
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
});

export type RegisterForm = z.infer<typeof registerSchema>;
