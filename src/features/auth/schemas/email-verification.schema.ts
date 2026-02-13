import { z } from 'zod';

export const emailVerificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  token: z.string().optional(),
});

export type EmailVerificationForm = z.infer<typeof emailVerificationSchema>;
