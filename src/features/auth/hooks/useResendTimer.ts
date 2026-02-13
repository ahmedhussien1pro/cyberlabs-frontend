import { useState, useEffect } from 'react';

/**
 * Custom hook for managing resend cooldown timer
 * @param initialSeconds - Initial countdown duration in seconds (default: 30)
 * @returns Object containing countdown state and reset function
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
