import { useMemo } from 'react';

export interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
}

/**
 * Custom hook to calculate password strength
 * Returns validation checks and strength level
 */
export function usePasswordStrength(
  password: string,
  minLength = 6,
): PasswordStrength {
  return useMemo(() => {
    const checks = {
      hasMinLength: password.length >= minLength,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    let level: 'weak' | 'fair' | 'good' | 'strong';
    if (score <= 1) level = 'weak';
    else if (score <= 2) level = 'fair';
    else if (score <= 3) level = 'good';
    else level = 'strong';

    return {
      ...checks,
      score,
      level,
    };
  }, [password, minLength]);
}
