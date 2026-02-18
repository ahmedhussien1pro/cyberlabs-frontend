import { useState, useEffect } from 'react';

export function useResendTimer(initialSeconds = 30) {
  const [countdown, setCountdown] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);
  const startTimer = initialSeconds;
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

  const resetTimer = (seconds = startTimer) => {
    setCountdown(seconds);
    setCanResend(false);
  };
  const timeLeft = countdown;
  return { countdown, canResend, resetTimer, startTimer, timeLeft };
}
