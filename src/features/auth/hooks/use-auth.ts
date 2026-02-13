import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/core/store';
import { QUERY_KEYS } from '@/core/config';
import { ROUTES } from '@/shared/constants';
import type { LoginCredentials, RegisterData } from '@/core/types';

export function useLogin() {
  const navigate = useNavigate();
  const { login: setAuthState } = useAuthStore();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      setAuthState(response.data.user, response.data.tokens);
      toast.success(t('auth:login.success'));
      navigate(ROUTES.DASHBOARD.HOME);
    },
    onError: (error: any) => {
      toast.error(error.message || t('auth:login.error'));
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      toast.success(t('auth:register.success'));
      navigate(ROUTES.AUTH.VERIFY_EMAIL);
    },
    onError: (error: any) => {
      toast.error(error.message || t('auth:register.error'));
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout: clearAuthState } = useAuthStore();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuthState();
      queryClient.clear();
      toast.success(t('auth:logout.success'));
      navigate(ROUTES.HOME);
    },
  });
}

export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated,
  });
}
