import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

interface Payload {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const { t } = useTranslation('settings');
  return useMutation({
    mutationFn: (payload: Payload) =>
      apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload),
    onSuccess: () => toast.success(t('security.passwordSuccess')),
    onError: () => toast.error(t('security.passwordError')),
  });
}
