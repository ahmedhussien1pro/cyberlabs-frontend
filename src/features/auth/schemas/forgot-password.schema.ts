// src/features/auth/schemas/forgot-password.schema.ts
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
