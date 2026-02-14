export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  feedback: string[];
  isValid: boolean;
}

export const authValidation = {
  isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  checkPasswordStrength(password: string): PasswordStrength {
    if (!password) {
      return {
        score: 0,
        feedback: ['Password is required'],
        isValid: false,
      };
    }

    const feedback: string[] = [];
    let score = 0;

    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters');
    } else {
      score++;
      if (password.length >= 12) score++;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Add lowercase letters');
    } else {
      score++;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Add uppercase letters');
    } else {
      score++;
    }

    if (!/\d/.test(password)) {
      feedback.push('Add numbers');
    } else {
      score++;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Add special characters (!@#$%^&*)');
    } else {
      score++;
    }

    score = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;

    const isValid = password.length >= 8 && score >= 2;

    return {
      score,
      feedback: feedback.length > 0 ? feedback : ['Password is strong'],
      isValid,
    };
  },

  isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    return parts.every((part) => {
      return /^[A-Za-z0-9_-]+$/.test(part);
    });
  },

  isValidOTP(otp: string): boolean {
    if (!otp || typeof otp !== 'string') return false;

    return /^\d{6}$/.test(otp.trim());
  },

  isValidName(name: string): boolean {
    if (!name || typeof name !== 'string') return false;

    const trimmed = name.trim();

    return (
      trimmed.length >= 2 &&
      trimmed.length <= 50 &&
      /^[a-zA-Z\s]+$/.test(trimmed)
    );
  },

  sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input.trim().replace(/[<>]/g, '').slice(0, 500);
  },
};
