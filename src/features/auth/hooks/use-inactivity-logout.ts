import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/auth.store';
import { tokenManager } from '../utils';

const INACTIVITY_LIMIT = 15 * 60 * 1000;

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'visibilitychange',
];

export function useInactivityLogout() {
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        const isExpiring = await tokenManager.isExpiringSoon(1); // 1 min
        if (isExpiring) {
          tokenManager.clearTokens();
          logout();
        }
      }, INACTIVITY_LIMIT);
    };

    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, reset, { passive: true }),
    );
    reset();

    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, logout]);
}
