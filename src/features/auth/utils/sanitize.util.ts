// src/features/auth/utils/sanitize.util.ts - ENHANCED

import { ENV } from '@/shared/constants';

export const sanitize = {
  REDACTED: '***REDACTED***',

  /**
   * Safe logging - only in development
   */
  log: (context: string, data: any) => {
    if (import.meta.env.DEV && ENV.NODE_ENV) {
      console.log(`[${context}]`, data);
    }
  },

  /**
   * Safe error logging
   */
  error: (context: string, error: any) => {
    if (import.meta.env.DEV) {
      console.error(`[${context}]`, {
        message: error?.message || 'Unknown error',
        // Don't log full error object in production
      });
    } else {
      // In production, send to error tracking service
      // e.g., Sentry, LogRocket, etc.
    }
  },

  /**
   * Sanitize sensitive data before logging
   */
  sanitizeData: (data: Record<string, any>): Record<string, any> => {
    const sensitiveKeys = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'apiKey',
    ];

    const sanitized = { ...data };

    for (const key in sanitized) {
      if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
        sanitized[key] = sanitize.REDACTED;
      }
    }

    return sanitized;
  },

  /**
   * Remove sensitive headers from logs
   */
  sanitizeHeaders: (headers: Record<string, any>): Record<string, any> => {
    const sanitized = { ...headers };

    if (sanitized.Authorization) {
      sanitized.Authorization = 'Bearer ***';
    }

    return sanitized;
  },
};
