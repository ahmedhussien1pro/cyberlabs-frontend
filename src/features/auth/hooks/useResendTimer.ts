import { useState, useEffect } from 'react';

/**
 * Custom hook to manage resend countdown timer
 * Used in OTP verification, email verification, etc.
 */
export function useResendTimer(initialSeconds = 30) {
  const [countdown, setCountdown] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const resetTimer = (seconds = initialSeconds) => {
    setCountdown(seconds);
    setCanResend(false);
  };

  return { countdown, canResend, resetTimer };
}
