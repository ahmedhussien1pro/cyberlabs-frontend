import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import type { LoginCredentials } from '../types/auth.types';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });
};
