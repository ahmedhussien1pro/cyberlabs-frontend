import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      // Even if API call fails, logout locally
      logout();
      navigate('/login');
    },
  });
};
