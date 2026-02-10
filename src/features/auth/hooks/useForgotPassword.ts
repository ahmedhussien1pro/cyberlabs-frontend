import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import type { ForgotPasswordData } from '../types/auth.types';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success('Password reset email sent! Check your inbox.');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
    },
  });
};
