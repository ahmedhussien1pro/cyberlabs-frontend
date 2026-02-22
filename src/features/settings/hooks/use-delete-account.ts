import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { deleteAccount } from '../api/settings.api';
import useAuthStore from '@/features/auth/store/auth.store';

export function useDeleteAccount() {
  const { t } = useTranslation('settings');
  const { logout } = useAuthStore();
  return useMutation({
    mutationFn: (password: string) => deleteAccount(password),
    onSuccess: () => {
      toast.success(t('dangerZone.deleteSuccess'));
      logout();
    },
    onError: () => toast.error(t('dangerZone.deleteError')),
  });
}
