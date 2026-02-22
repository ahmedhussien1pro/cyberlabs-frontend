import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/core/api/client';

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const { t } = useTranslation('settings');

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      apiClient.put('/users/me/password', payload),
    onSuccess: () => toast.success(t('security.passwordSuccess')),
    onError: () => toast.error(t('security.passwordError')),
  });
}
