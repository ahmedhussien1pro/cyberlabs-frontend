import { Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import * as Pages from './lazy-routes';
import { ROUTES } from '@/shared/constants';
import { Preloader } from '@/shared/components/common/preloader';
import ProtectedRoute from './protected-route';

const LazyPage = ({
  Component,
}: {
  Component: React.LazyExoticComponent<() => React.ReactElement>;
}) => (
  <Suspense fallback={<Preloader />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  // ── Website ────────────────────────────────────
  { path: ROUTES.HOME, element: <LazyPage Component={Pages.HomePage} /> },
  { path: ROUTES.ABOUT, element: <LazyPage Component={Pages.AboutPage} /> },
  { path: ROUTES.CONTACT, element: <LazyPage Component={Pages.ContactPage} /> },
  { path: ROUTES.PRICING, element: <LazyPage Component={Pages.PricingPage} /> },
  { path: ROUTES.TERMS, element: <LazyPage Component={Pages.TermsPage} /> },
  { path: ROUTES.PRIVACY, element: <LazyPage Component={Pages.PrivacyPage} /> },

  // ── Auth ───────────────────────────────────────
  { path: ROUTES.AUTH.LOGIN, element: <LazyPage Component={Pages.AuthPage} /> },
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

  // ── Profile ────────────────────────────────────
  {
    path: ROUTES.PROFILE.VIEW,
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.ProfilePage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/:userId',
    element: <LazyPage Component={Pages.PublicProfilePage} />,
  },

  // ── Dashboard (nested layout) ──────────────────
  {
    path: ROUTES.DASHBOARD.DashboardPage,
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Preloader />}>
          <Pages.DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LazyPage Component={Pages.DashboardPage} /> },
      { path: 'labs', element: <LazyPage Component={Pages.LabsPage} /> },
      {
        path: 'progress',
        element: <LazyPage Component={Pages.ProgressPage} />,
      },
      { path: 'goals', element: <LazyPage Component={Pages.GoalsPage} /> },
      {
        path: 'community',
        element: <LazyPage Component={Pages.CommunityPage} />,
      },
      {
        path: 'settings',
        element: <LazyPage Component={Pages.SettingsPage} />,
      },
    ],
  },
  // ── Courses (public protected) ──────────────
  {
    path: '/courses',
    element: <LazyPage Component={Pages.CoursesListPage} />,
  },
  {
    path: '/courses/:slug',
    element: <LazyPage Component={Pages.CourseDetailPage} />,
  },
  {
    path: '/courses/:slug/lessons/:lessonId',
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.LessonPage} />
      </ProtectedRoute>
    ),
  },
  // ── Labs (public protected) ──────────────────
  {
    path: '/labs',
    element: <LazyPage Component={Pages.LabsListPage} />,
  },
  {
    path: '/labs/:slug',
    element: <LazyPage Component={Pages.LabDetailPage} />,
  },
  // ── Learning Paths ─────────────────────────────
  {
    path: '/paths',
    element: <LazyPage Component={Pages.PathsPage} />,
  },
  {
    path: '/paths/:slug',
    element: <LazyPage Component={Pages.PathDetailPage} />,
  },

  // ── Errors ─────────────────────────────────────
  {
    path: ROUTES.UNAUTHORIZED,
    element: <LazyPage Component={Pages.UnauthorizedPage} />,
  },
  {
    path: '*',
    element: <LazyPage Component={Pages.NotFoundPage} />,
  },
  {
    path: '/temp',
    element: <LazyPage Component={Pages.TempPage} />,
  },
  { path: '*', element: <LazyPage Component={Pages.NotFoundPage} /> },
];

export default routes;
