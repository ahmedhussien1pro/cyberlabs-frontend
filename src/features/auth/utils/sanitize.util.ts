import { ENV } from '@/shared/constants';
const SENSITIVE_FIELDS = [
  'password',
  'newPassword',
  'currentPassword',
  'oldPassword',
  'token',
  'accessToken',
  'refreshToken',
  'access_token',
  'refresh_token',
  'authorization',
  'auth',
  'secret',
  'apiKey',
  'api_key',
  'privateKey',
  'private_key',
  'otp',
  'code',
  'verificationCode',
  'resetToken',
  'sessionId',
  'csrf',
  'csrfToken',
];

const REDACTED = '[REDACTED]';

function isSensitiveField(fieldName: string): boolean {
  const lowerName = fieldName.toLowerCase();
  return SENSITIVE_FIELDS.some((sensitive) =>
    lowerName.includes(sensitive.toLowerCase()),
  );
}

function sanitizeObject(obj: any, maxDepth: number = 5): any {
  if (maxDepth <= 0) return '[MAX_DEPTH]';
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, maxDepth - 1));
  }

  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveField(key)) {
      sanitized[key] = REDACTED;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, maxDepth - 1);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    for (const key of Array.from(params.keys())) {
      if (isSensitiveField(key)) {
        params.set(key, REDACTED);
      }
    }

    urlObj.search = params.toString();
    return urlObj.toString();
  } catch {
    return url;
  }
}

function sanitizeError(error: any): any {
  if (!error) return error;

  const sanitized: any = {
    message: error.message || 'Unknown error',
    name: error.name || 'Error',
  };

  if (error.response?.data) {
    sanitized.response = {
      ...error.response,
      data: sanitizeObject(error.response.data),
    };
  }

  if (error.config?.data) {
    try {
      const data =
        typeof error.config.data === 'string'
          ? JSON.parse(error.config.data)
          : error.config.data;

      sanitized.request = {
        url: sanitizeUrl(error.config.url || ''),
        method: error.config.method,
        data: sanitizeObject(data),
      };
    } catch {
      sanitized.request = {
        url: sanitizeUrl(error.config?.url || ''),
        method: error.config?.method,
      };
    }
  }

  return sanitized;
}

function sanitizeString(str: string): string {
  if (!str || typeof str !== 'string') return str;

  return str.replace(
    /\b[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g,
    REDACTED,
  );
}

function safeLog(label: string, data: any): void {
  if (ENV.NODE_ENV === 'production') {
    return;
  }

  const sanitized = sanitizeObject(data);
  console.log(`[${label}]`, sanitized);
}

function safeError(label: string, error: any): void {
  const sanitized = sanitizeError(error);
  console.error(`[ERROR: ${label}]`, sanitized);
}

export const sanitize = {
  object: sanitizeObject,

  url: sanitizeUrl,

  error: sanitizeError,

  string: sanitizeString,

  log: safeLog,

  error: safeError,

  isSensitive: isSensitiveField,

  REDACTED,
};

export type Sanitized<T> = T;

export function markSanitized<T>(data: T): Sanitized<T> {
  return data;
}
