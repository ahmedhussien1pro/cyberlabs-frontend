import { useState, useEffect, useCallback } from 'react';

export function useResendTimer(initialSeconds = 30) {
  const [countdown, setCountdown] = useState(initialSeconds);

  const canResend = countdown === 0;

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const startTimer = useCallback(
    (seconds = initialSeconds) => {
      setCountdown(seconds);
    },
    [initialSeconds],
  );

  const resetTimer = startTimer;

  const timeLeft = countdown;
  return { countdown, canResend, resetTimer, startTimer, timeLeft };
}
