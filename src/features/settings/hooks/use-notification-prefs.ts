import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  getNotificationPrefs,
  updateNotificationPrefs,
} from '../api/settings.api';
import type { NotificationPrefs } from '../types/settings.types';

const PREFS_KEY = ['user', 'notification-prefs'] as const;

export const useNotificationPrefs = () =>
  useQuery({
    queryKey: PREFS_KEY,
    queryFn: getNotificationPrefs,
    retry: false,
  });

export function useUpdateNotificationPrefs() {
  const qc = useQueryClient();
  const { t } = useTranslation('settings');
  return useMutation({
    mutationFn: (prefs: Partial<NotificationPrefs>) =>
      updateNotificationPrefs(prefs),
    onSuccess: (data) => {
      qc.setQueryData(PREFS_KEY, data);
      toast.success(t('notifications.saveSuccess'));
    },
    onError: () => toast.error(t('notifications.saveError')),
  });
}
