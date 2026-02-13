// src/core/router/routes.tsx
import { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import * as Pages from './lazy-routes';
import { ROUTES } from '@/shared/constants';
import { LoadingSpinner } from '@/components/common/loading-spinner';

const LazyPage = ({
  Component,
}: {
  Component: React.LazyExoticComponent<() => JSX.Element>;
}) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  // Website Routes
  {
    path: ROUTES.HOME,
    element: <LazyPage Component={Pages.HomePage} />,
  },
  {
    path: ROUTES.ABOUT,
    element: <LazyPage Component={Pages.AboutPage} />,
  },
  {
    path: ROUTES.CONTACT,
    element: <LazyPage Component={Pages.ContactPage} />,
  },
  {
    path: ROUTES.PRICING,
    element: <LazyPage Component={Pages.PricingPage} />,
  },

  // Auth Routes
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LazyPage Component={Pages.AuthPage} />,
  },
  {
    path: ROUTES.AUTH.REGISTER,
    element: <LazyPage Component={Pages.AuthPage} />,
  },
  {
    path: ROUTES.AUTH.FORGOT_PASSWORD,
    element: <LazyPage Component={Pages.ForgotPasswordPage} />,
  },
  {
    path: ROUTES.AUTH.RESET_PASSWORD,
    element: <LazyPage Component={Pages.ResetPasswordPage} />,
  },
  {
    path: ROUTES.AUTH.VERIFY_EMAIL,
    element: <LazyPage Component={Pages.VerifyEmailPage} />,
  },
  {
    path: ROUTES.AUTH.OTP_VERIFICATION,
    element: <LazyPage Component={Pages.OtpVerificationPage} />,
  },
  {
    path: ROUTES.AUTH.LOGOUT,
    element: <LazyPage Component={Pages.LogoutPage} />,
  },
  {
    // Aouth callback route for handling OAuth responses
    path: ROUTES.AUTH.OAUTH_CALLBACK,
    element: <LazyPage Component={Pages.OAuthCallbackPage} />,
  },
  {
    path: ROUTES.AUTH.GOOGLE_CALLBACK,
    element: <LazyPage Component={Pages.OAuthCallbackPage} />,
  },
  {
    path: ROUTES.AUTH.GITHUB_CALLBACK,
    element: <LazyPage Component={Pages.OAuthCallbackPage} />,
  },

  // Error Routes
  {
    path: ROUTES.UNAUTHORIZED,
    element: <LazyPage Component={Pages.UnauthorizedPage} />,
  },
  {
    path: '*',
    element: <LazyPage Component={Pages.NotFoundPage} />,
  },
];

export default routes;
