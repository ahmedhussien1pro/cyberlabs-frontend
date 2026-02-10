import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  // Fetch current user on mount if authenticated
  const { isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: isAuthenticated && !user,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      logout();
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout,
  };
};
