// src/features/auth/utils/validation.schemas.ts
import { z } from 'zod';

// Email validation pattern
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password validation
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Register Schema - WITHOUT .refine() for better UX
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
    .regex(emailRegex, 'Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
});

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Password Strength Calculator
export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  suggestions: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: '', color: '', suggestions: [] };
  }

  let score = 0;
  const suggestions: string[] = [];

  // Length check
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  else if (password.length < 6) suggestions.push('Use at least 6 characters');

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else suggestions.push('Mix uppercase and lowercase letters');

  if (/[0-9]/.test(password)) score++;
  else suggestions.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else suggestions.push('Add special characters (!@#$%^&*)');

  // Score mapping
  const strengthMap: Record<number, { label: string; color: string }> = {
    0: { label: 'Too weak', color: 'bg-red-500' },
    1: { label: 'Weak', color: 'bg-orange-500' },
    2: { label: 'Fair', color: 'bg-yellow-500' },
    3: { label: 'Good', color: 'bg-blue-500' },
    4: { label: 'Strong', color: 'bg-green-500' },
    5: { label: 'Very Strong', color: 'bg-green-600' },
  };

  const strength = strengthMap[Math.min(score, 5)];

  return {
    score: Math.min(score, 5),
    label: strength.label,
    color: strength.color,
    suggestions,
  };
}
