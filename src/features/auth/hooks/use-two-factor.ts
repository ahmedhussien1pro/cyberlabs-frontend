import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { USER_QUERY_KEYS } from '@/shared/constants/query-keys';
import useAuthStore from '../store/auth.store';

const cast = <T>(res: unknown) => res as T;

export interface Generate2FAResponse {
  qrCode: string;
  secret: string;
}
export interface Enable2FAResponse {
  success: boolean;
  backupCodes?: string[];
}
export interface Disable2FAResponse {
  success: boolean;
}

export function useGenerate2FA() {
  return useMutation({
    mutationFn: () =>
      apiClient
        .post(API_ENDPOINTS.AUTH.TWO_FACTOR_GENERATE)
        .then(cast<Generate2FAResponse>),
  });
}

export function useEnable2FA() {
  const qc = useQueryClient();
  const { t } = useTranslation('settings');
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (token: string) =>
      apiClient
        .post(API_ENDPOINTS.AUTH.TWO_FACTOR_ENABLE, { token })
        .then(cast<Enable2FAResponse>),
    onSuccess: () => {
      updateUser({ twoFactorEnabled: true });
      qc.invalidateQueries({ queryKey: USER_QUERY_KEYS.me });
      toast.success(t('security.twoFactorEnabled'));
    },
    onError: () => toast.error(t('security.twoFactorCodeInvalid')),
  });
}

export function useDisable2FA() {
  const qc = useQueryClient();
  const { t } = useTranslation('settings');
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (token: string) =>
      apiClient
        .post(API_ENDPOINTS.AUTH.TWO_FACTOR_DISABLE, { token })
        .then(cast<Disable2FAResponse>),
    onSuccess: () => {
      updateUser({ twoFactorEnabled: false });
      qc.invalidateQueries({ queryKey: USER_QUERY_KEYS.me });
      toast.success(t('security.twoFactorDisabled'));
    },
    onError: () => toast.error(t('security.twoFactorCodeInvalid')),
  });
}
