import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ResendButtonProps {
  canResend: boolean;
  countdown: number;
  onResend: () => void;
  loading?: boolean;
  text?: string;
  countdownText?: (seconds: number) => string;
}

export function ResendButton({
  canResend,
  countdown,
  onResend,
  loading = false,
  text,
  countdownText,
}: ResendButtonProps) {
  const { t } = useTranslation('auth');

  const displayText = text ?? t('resend.buttonText');
  const displayCountdown = countdownText
    ? countdownText(countdown)
    : t('resend.countdown', { seconds: countdown });

  return (
    <div className='auth-page__resend'>
      <p>{t('resend.question')}</p>
      <button type='button' onClick={onResend} disabled={!canResend || loading}>
        {loading && <RefreshCw className='inline w-4 h-4 mr-2 animate-spin' />}
        {canResend ? displayText : displayCountdown}
      </button>
    </div>
  );
}
