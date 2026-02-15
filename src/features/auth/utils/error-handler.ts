// src/features/auth/utils/error-handler.ts
export interface AuthError {
  title: string;
  message: string;
}

export function parseAuthError(error: any): AuthError {
  const defaultError: AuthError = {
    title: 'Registration Failed',
    message: 'An unexpected error occurred. Please try again.',
  };

  if (!error) return defaultError;

  const errorMessage = error.message?.toLowerCase() || '';
  const statusCode = error.statusCode || error.status;

  // Username errors
  if (
    errorMessage.includes('username') &&
    (errorMessage.includes('exists') ||
      errorMessage.includes('taken') ||
      errorMessage.includes('already') ||
      errorMessage.includes('in use'))
  ) {
    return {
      title: 'Username Not Available',
      message: 'This username is already taken. Please choose a different one.',
    };
  }

  // Email errors
  if (
    errorMessage.includes('email') &&
    (errorMessage.includes('exists') ||
      errorMessage.includes('registered') ||
      errorMessage.includes('already') ||
      errorMessage.includes('in use'))
  ) {
    return {
      title: 'Email Already Registered',
      message:
        'An account with this email already exists. Please login or use a different email.',
    };
  }

  // Network errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('connection')
  ) {
    return {
      title: 'Connection Error',
      message:
        'Unable to connect to the server. Please check your internet connection.',
    };
  }

  // Server errors
  if (statusCode === 500 || errorMessage.includes('internal server')) {
    return {
      title: 'Server Error',
      message:
        'Our servers are experiencing issues. Please try again in a few minutes.',
    };
  }

  // Rate limiting
  if (statusCode === 429 || errorMessage.includes('too many')) {
    return {
      title: 'Too Many Attempts',
      message:
        'You have made too many requests. Please wait a moment and try again.',
    };
  }

  // Validation errors
  if (statusCode === 400 || errorMessage.includes('validation')) {
    return {
      title: 'Invalid Input',
      message: error.message || 'Please check your information and try again.',
    };
  }

  // Generic error with actual message if available
  if (error.message && error.message.length < 200) {
    return {
      title: defaultError.title,
      message: error.message,
    };
  }

  return defaultError;
}
