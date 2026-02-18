import { useState, useEffect } from 'react';

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

  // ✅ startTimer is a function — resets countdown and disables resend
  const startTimer = (seconds = initialSeconds) => {
    setCountdown(seconds);
    setCanResend(false);
  };

  // resetTimer kept as alias for backward compatibility
  const resetTimer = startTimer;

  const timeLeft = countdown;
  return { countdown, canResend, resetTimer, startTimer, timeLeft };
}
