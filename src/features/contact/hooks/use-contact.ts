import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { sendContactMessage, type ContactPayload } from '../api/contact.api';

export function useContact() {
  const { t } = useTranslation('contact');

  return useMutation({
    mutationFn: (payload: ContactPayload) => sendContactMessage(payload),
    onSuccess: () => toast.success(t('form.success')),
    onError: () => toast.error(t('form.error')),
  });
}
