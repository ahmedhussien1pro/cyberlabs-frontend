import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  getSessions,
  revokeSession,
  revokeAllSessions,
} from '../api/settings.api';

export const SESSIONS_KEY = ['user', 'sessions'] as const;

export const useGetSessions = () =>
  useQuery({ queryKey: SESSIONS_KEY, queryFn: getSessions, retry: false });

export function useRevokeSession() {
  const qc = useQueryClient();
  const { t } = useTranslation('settings');
  return useMutation({
    mutationFn: (id: string) => revokeSession(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SESSIONS_KEY });
      toast.success(t('sessions.revokeSuccess'));
    },
    onError: () => toast.error(t('sessions.revokeError')),
  });
}

export function useRevokeAllSessions() {
  const qc = useQueryClient();
  const { t } = useTranslation('settings');
  return useMutation({
    mutationFn: revokeAllSessions,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SESSIONS_KEY });
      toast.success(t('sessions.revokeAllSuccess'));
    },
    onError: () => toast.error(t('sessions.revokeError')),
  });
}
