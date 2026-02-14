import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/constants';

interface UseAuthRedirectOptions {
  redirectIfAuthenticated?: boolean;
  redirectIfUnauthenticated?: boolean;
  authenticatedRedirect?: string;
  unauthenticatedRedirect?: string;
  preserveReturnUrl?: boolean;
}

export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const {
    redirectIfAuthenticated = true,
    redirectIfUnauthenticated = false,
    authenticatedRedirect = ROUTES.HOME,
    unauthenticatedRedirect = ROUTES.AUTH.LOGIN,
    preserveReturnUrl = true,
  } = options;

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (redirectIfAuthenticated && isAuthenticated) {
      const returnUrl = (location.state as any)?.returnUrl;

      if (preserveReturnUrl && returnUrl) {
        navigate(returnUrl, { replace: true });
      } else {
        navigate(authenticatedRedirect, { replace: true });
      }
    }

    if (redirectIfUnauthenticated && !isAuthenticated) {
      const returnUrl = preserveReturnUrl
        ? location.pathname + location.search
        : undefined;

      navigate(unauthenticatedRedirect, {
        replace: true,
        state: { returnUrl },
      });
    }
  }, [
    isAuthenticated,
    isLoading,
    redirectIfAuthenticated,
    redirectIfUnauthenticated,
    authenticatedRedirect,
    unauthenticatedRedirect,
    preserveReturnUrl,
    navigate,
    location,
  ]);

  return {
    isAuthenticated,
    isLoading,
  };
};
