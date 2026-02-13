import { RefreshCw } from 'lucide-react';

interface ResendButtonProps {
  canResend: boolean;
  countdown: number;
  onResend: () => void;
  loading?: boolean;
  text?: string;
  countdownText?: (seconds: number) => string;
}

/**
 * Reusable resend button component with countdown timer
 * Used in OTP, Email Verification, and other auth flows
 */
export function ResendButton({
  canResend,
  countdown,
  onResend,
  loading = false,
  text = 'Click to resend',
  countdownText = (seconds) => `Resend in ${seconds}s`,
}: ResendButtonProps) {
  return (
    <div className='auth-page__resend'>
      <p>Didn't receive the code?</p>
      <button
        type='button'
        onClick={onResend}
        disabled={!canResend || loading}>
        {loading && <RefreshCw className='inline w-4 h-4 mr-2 animate-spin' />}
        {canResend ? text : countdownText(countdown)}
      </button>
    </div>
  );
}
