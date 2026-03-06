import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { requestEmailChange, verifyEmailChange } from '../api/settings.api';

export const useRequestEmailChange = () => {
  const { t } = useTranslation('settings');
  return useMutation({
    mutationFn: (newEmail: string) => requestEmailChange(newEmail),
    onError: () => toast.error(t('account.emailChangeFailed')),
  });
};

export const useVerifyEmailChange = () => {
  const { t } = useTranslation('settings');
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ otp, token }: { otp: string; token: string }) =>
      verifyEmailChange(otp, token),
    onSuccess: () => {
      toast.success(t('account.emailChangeSuccess'));
      // invalidate auth/me & profile queries
      qc.invalidateQueries({
        predicate: (q) => ['auth', 'profile'].includes(String(q.queryKey[0])),
      });
    },
    onError: () => toast.error(t('account.emailChangeOtpFailed')),
  });
};
