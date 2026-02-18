import { z } from 'zod';

export const otpVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export type OTPVerificationForm = z.infer<typeof otpVerificationSchema>;
