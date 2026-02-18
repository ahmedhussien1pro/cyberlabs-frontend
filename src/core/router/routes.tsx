import { Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import * as Pages from './lazy-routes';
import { ROUTES } from '@/shared/constants';
import { LoadingSpinner } from '@/shared/components/common/loading-spinner';

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
  {
    path: ROUTES.TERMS,
    element: <LazyPage Component={Pages.TermsPage} />,
  },
  {
    path: ROUTES.PRIVACY,
    element: <LazyPage Component={Pages.PrivacyPage} />,
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
  // {
  //   path: ROUTES.DASHBOARD.DashboardPage,
  //   element: <LazyPage Component={Pages.DashboardPage} />,
  // },
  // {
  //   path: ROUTES.DASHBOARD.LabsPage,
  //   element: <LazyPage Component={Pages.LabsPage} />,
  // },
  // {
  //   path: ROUTES.DASHBOARD.ProgressPage,
  //   element: <LazyPage Component={Pages.ProgressPage} />,
  // },
  // {
  //   path: ROUTES.DASHBOARD.GoalsPage,
  //   element: <LazyPage Component={Pages.GoalsPage} />,
  // },
  // {
  //   path: ROUTES.DASHBOARD.CommunityPage,
  //   element: <LazyPage Component={Pages.CommunityPage} />,
  // },
  // {
  //   path: ROUTES.DASHBOARD.SettingsPage,
  //   element: <LazyPage Component={Pages.SettingsPage} />,
  // },
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
