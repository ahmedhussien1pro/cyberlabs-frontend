import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import type { ResetPasswordData } from '../types/auth.types';

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully!');
      navigate('/login');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    },
  });
};
