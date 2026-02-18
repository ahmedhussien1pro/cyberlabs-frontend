import type { ApiError } from '@/core/types';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  customMessage?: string;
  onError?: (error: ApiError) => void;
}

export const handleError = (
  error: unknown,
  options: ErrorHandlerOptions = {},
): ApiError => {
  const { showToast = true, customMessage, onError } = options;

  let apiError: ApiError = {
    message: 'An unexpected error occurred',
    statusCode: 500,
  };

  if (typeof error === 'object' && error !== null) {
    if ('message' in error && 'statusCode' in error) {
      apiError = error as ApiError;
    } else if (error instanceof Error) {
      apiError.message = error.message;
    }
  }

  if (customMessage) {
    apiError.message = customMessage;
  }

  if (showToast) {
    toast.error(apiError.message);
  }

  if (onError) {
    onError(apiError);
  }

  if (import.meta.env.DEV) {
    console.error('Error:', apiError);
  }

  return apiError;
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }
  return 'An unexpected error occurred';
};

export default handleError;
