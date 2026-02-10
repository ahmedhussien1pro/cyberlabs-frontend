import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import type { RegisterData } from '../types/auth.types';

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      toast.success('Registration successful!');
      navigate('/verify-email');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });
};
