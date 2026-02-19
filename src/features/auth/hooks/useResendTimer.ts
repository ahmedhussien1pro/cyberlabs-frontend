import { useState, useEffect, useCallback } from 'react';

export function useResendTimer(initialSeconds = 30) {
  const [countdown, setCountdown] = useState(initialSeconds);

  // ✅ Derived state — no separate useState or setCanResend inside effects
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

  // resetTimer kept as alias for backward compatibility
  const resetTimer = startTimer;

  const timeLeft = countdown;
  return { countdown, canResend, resetTimer, startTimer, timeLeft };
}
