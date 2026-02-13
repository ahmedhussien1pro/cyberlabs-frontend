import { useMemo } from 'react';

interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  score: number;
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: 'weak' | 'fair' | 'good' | 'strong';
}

/**
 * Custom hook for calculating password strength
 * @param password - The password string to evaluate
 * @param minLength - Minimum required length (default: 6)
 * @returns Object containing password strength indicators and score
 */
export function usePasswordStrength(
  password: string,
  minLength = 6,
): PasswordStrength {
  return useMemo(() => {
    const hasMinLength = password.length >= minLength;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber].filter(
      Boolean,
    ).length;

    let label: PasswordStrength['label'];
    let color: PasswordStrength['color'];

    if (score <= 1) {
      label = 'Weak';
      color = 'weak';
    } else if (score === 2) {
      label = 'Fair';
      color = 'fair';
    } else if (score === 3) {
      label = 'Good';
      color = 'good';
    } else {
      label = 'Strong';
      color = 'strong';
    }

    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      score,
      label,
      color,
    };
  }, [password, minLength]);
}
