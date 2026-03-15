import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  otpVerificationSchema,
  emailVerificationSchema,
} from '../schemas';

// ─── loginSchema ──────────────────────────────────────────────────────────────
describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'pass' }).success).toBe(true);
  });
  it('rejects empty email', () => {
    expect(loginSchema.safeParse({ email: '', password: 'pass' }).success).toBe(false);
  });
  it('rejects invalid email format', () => {
    expect(loginSchema.safeParse({ email: 'not-email', password: 'pass' }).success).toBe(false);
  });
  it('rejects empty password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
  });
});

// ─── registerSchema ───────────────────────────────────────────────────────────
describe('registerSchema', () => {
  const valid = {
    username: 'ahmed_99',
    email: 'ahmed@test.com',
    password: 'secret123',
    confirmPassword: 'secret123',
    acceptTerms: true,
  };

  it('accepts valid data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects username shorter than 3 chars', () => {
    expect(registerSchema.safeParse({ ...valid, username: 'ab' }).success).toBe(false);
  });
  it('rejects username longer than 20 chars', () => {
    expect(registerSchema.safeParse({ ...valid, username: 'a'.repeat(21) }).success).toBe(false);
  });
  it('rejects username with special chars', () => {
    expect(registerSchema.safeParse({ ...valid, username: 'ahmed!' }).success).toBe(false);
  });
  it('rejects invalid email', () => {
    expect(registerSchema.safeParse({ ...valid, email: 'bad' }).success).toBe(false);
  });
  it('rejects password shorter than 6 chars', () => {
    expect(registerSchema.safeParse({ ...valid, password: '12345', confirmPassword: '12345' }).success).toBe(false);
  });
  it('rejects acceptTerms = false', () => {
    expect(registerSchema.safeParse({ ...valid, acceptTerms: false }).success).toBe(false);
  });
});

// ─── forgotPasswordSchema ─────────────────────────────────────────────────────
describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'user@test.com' }).success).toBe(true);
  });
  it('rejects invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'bad' }).success).toBe(false);
  });
  it('rejects empty email', () => {
    expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
  });
});

// ─── resetPasswordSchema ──────────────────────────────────────────────────────
describe('resetPasswordSchema', () => {
  const valid = { password: 'Secure1pass', confirmPassword: 'Secure1pass' };

  it('accepts matching passwords with all requirements', () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects password shorter than 6 chars', () => {
    expect(resetPasswordSchema.safeParse({ password: 'Ab1', confirmPassword: 'Ab1' }).success).toBe(false);
  });
  it('rejects password without uppercase letter', () => {
    expect(resetPasswordSchema.safeParse({ password: 'secure1pass', confirmPassword: 'secure1pass' }).success).toBe(false);
  });
  it('rejects password without lowercase letter', () => {
    expect(resetPasswordSchema.safeParse({ password: 'SECURE1PASS', confirmPassword: 'SECURE1PASS' }).success).toBe(false);
  });
  it('rejects password without number', () => {
    expect(resetPasswordSchema.safeParse({ password: 'SecurePass', confirmPassword: 'SecurePass' }).success).toBe(false);
  });
  it('rejects mismatched confirmPassword', () => {
    expect(resetPasswordSchema.safeParse({ password: 'Secure1pass', confirmPassword: 'Different1' }).success).toBe(false);
  });
});

// ─── otpVerificationSchema ────────────────────────────────────────────────────
describe('otpVerificationSchema', () => {
  const valid = { email: 'user@test.com', otp: '123456' };

  it('accepts valid email and 6-digit OTP', () => {
    expect(otpVerificationSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects OTP shorter than 6 digits', () => {
    expect(otpVerificationSchema.safeParse({ ...valid, otp: '12345' }).success).toBe(false);
  });
  it('rejects OTP longer than 6 digits', () => {
    expect(otpVerificationSchema.safeParse({ ...valid, otp: '1234567' }).success).toBe(false);
  });
  it('rejects OTP with non-numeric chars', () => {
    expect(otpVerificationSchema.safeParse({ ...valid, otp: '12345a' }).success).toBe(false);
  });
  it('rejects invalid email', () => {
    expect(otpVerificationSchema.safeParse({ email: 'bad', otp: '123456' }).success).toBe(false);
  });
});

// ─── emailVerificationSchema ──────────────────────────────────────────────────
describe('emailVerificationSchema', () => {
  it('accepts valid email', () => {
    expect(emailVerificationSchema.safeParse({ email: 'user@test.com' }).success).toBe(true);
  });
  it('rejects invalid email', () => {
    expect(emailVerificationSchema.safeParse({ email: 'not-email' }).success).toBe(false);
  });
});
