import { Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import * as Pages from './lazy-routes';
import { ROUTES } from '@/shared/constants';
import { Preloader } from '@/shared/components/common/preloader';
import ProtectedRoute from './protected-route';

const LazyPage = ({
  Component,
}: {
  Component: React.LazyExoticComponent<React.ComponentType>;
}) => (
  <Suspense fallback={<Preloader />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  // ── Website (Public) ───────────────────────────────
  { path: ROUTES.HOME, element: <LazyPage Component={Pages.HomePage} /> },
  { path: ROUTES.ABOUT, element: <LazyPage Component={Pages.AboutPage} /> },
  { path: ROUTES.CONTACT, element: <LazyPage Component={Pages.ContactPage} /> },
  { path: ROUTES.PRICING, element: <LazyPage Component={Pages.PricingPage} /> },
  { path: ROUTES.TERMS, element: <LazyPage Component={Pages.TermsPage} /> },
  { path: ROUTES.PRIVACY, element: <LazyPage Component={Pages.PrivacyPage} /> },

  // ── Auth (Public) ─────────────────────────────────
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

  // ── Admin Preview (public – authenticates via token in query params) ──
  {
    path: '/admin-preview/courses/:slug',
    element: <LazyPage Component={Pages.AdminPreviewPage} />,
  },

  // ── Certificate Public Verification (no auth required) ────────
  {
    path: '/verify/:verificationId',
    element: <LazyPage Component={Pages.VerifyCertificatePage} />,
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

  // ── Notifications ──────────────────────────────
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.NotificationsPage} />
      </ProtectedRoute>
    ),
  },

  // ── Dashboard (Protected) ──────────────────────────
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
      // ➕ Certificates tab inside dashboard
      {
        path: 'certificates',
        element: <LazyPage Component={Pages.CertificatesPage} />,
      },
    ],
  },

  // ── Courses (Protected) ──────────────────────────
  {
    path: '/courses',
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.CoursesListPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/courses/:slug',
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.CourseDetailPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/courses/:slug/lessons/:lessonId',
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.LessonPage} />
      </ProtectedRoute>
    ),
  },

  // ── Labs (Protected) ─────────────────────────────
  {
    path: '/labs',
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.LabsListPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/labs/:slug',
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.LabDetailPage} />
      </ProtectedRoute>
    ),
  },

  // ── Learning Paths (Protected) ─────────────────────
  {
    path: '/paths',
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.PathsPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/paths/:slug',
    element: (
      <ProtectedRoute>
        <LazyPage Component={Pages.PathDetailPage} />
      </ProtectedRoute>
    ),
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

  // ── Temporary Pages ───────────────────────────────
  {
    path: '/temp',
    element: <LazyPage Component={Pages.TempPage} />,
  },
  {
    path: '/temp/quiz-result',
    element: <LazyPage Component={Pages.QuizResults} />,
  },
  {
    path: '/temp-lab',
    element: <LazyPage Component={Pages.LabLayout} />,
    children: [
      {
        index: true,
        element: <LazyPage Component={Pages.LabProductsPage} />,
      },
      {
        path: 'login',
        element: <LazyPage Component={Pages.LabLoginPage} />,
      },
      {
        element: <LazyPage Component={Pages.LabProtectedRoute} />,
        children: [
          {
            path: 'cart',
            element: <LazyPage Component={Pages.LabCartPage} />,
          },
          {
            path: 'account',
            element: <LazyPage Component={Pages.LabAccountPage} />,
          },
        ],
      },
    ],
  },
];

export default routes;
