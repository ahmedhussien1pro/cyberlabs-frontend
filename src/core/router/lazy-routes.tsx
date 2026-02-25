import { lazy } from 'react';

// Website Pages
export const HomePage = lazy(
  () => import('@/features/website/pages/home-page'),
);
export const AboutPage = lazy(
  () => import('@/features/website/pages/about-page'),
);
export const ContactPage = lazy(
  () => import('@/features/website/pages/contact-page'),
);
export const PricingPage = lazy(
  () => import('@/features/pricing/pages/pricing-page'),
);
export const TermsPage = lazy(
  () => import('@/features/website/pages/legal/terms'),
);
export const PrivacyPage = lazy(
  () => import('@/features/website/pages/legal/privacy'),
);

// Auth Pages
export const AuthPage = lazy(() => import('@/features/auth/pages/auth-page'));
export const OtpVerificationPage = lazy(
  () => import('@/features/auth/pages/otp-verification-page'),
);
export const ForgotPasswordPage = lazy(
  () => import('@/features/auth/pages/forgot-password-page'),
);
export const ResetPasswordPage = lazy(
  () => import('@/features/auth/pages/reset-password-page'),
);
export const VerifyEmailPage = lazy(
  () => import('@/features/auth/pages/verify-email-page'),
);
export const LogoutPage = lazy(
  () => import('@/features/auth/pages/logout-page'),
);
export const OAuthCallbackPage = lazy(
  () => import('@/features/auth/pages/oauth-callback-page'),
);

// Profile Pages
export const ProfilePage = lazy(
  () => import('@/features/profile/pages/profile-page'),
);
export const PublicProfilePage = lazy(
  () => import('@/features/profile/pages/public-profile-page'),
);

// Notifications
export const NotificationsPage = lazy(
  () => import('@/features/notifications/pages/notifications-page'),
);

// Dashboard
export const DashboardLayout = lazy(
  () => import('@/features/dashboard/components/layout/dashboard-layout'),
);
export const DashboardPage = lazy(
  () => import('@/features/dashboard/pages/dashboard-page'),
);
export const LabsPage = lazy(
  () => import('@/features/dashboard/pages/labs-page'),
);
export const ProgressPage = lazy(
  () => import('@/features/dashboard/pages/progress-page'),
);
export const GoalsPage = lazy(
  () => import('@/features/dashboard/pages/goals-page'),
);
export const CommunityPage = lazy(
  () => import('@/features/dashboard/pages/community-page'),
);

// Settings
export const SettingsPage = lazy(
  () => import('@/features/settings/pages/settings-page'),
);

// Error Pages
export const NotFoundPage = lazy(
  () => import('@/features/errors/pages/not-found-page'),
);
export const UnauthorizedPage = lazy(
  () => import('@/features/errors/pages/unauthorized-page'),
);

// ── Courses ──────────────
export const CoursesListPage = lazy(
  () => import('@/features/courses/pages/courses-list-page'),
);
export const CourseDetailPage = lazy(
  () => import('@/features/courses/pages/course-detail-page'),
);
export const LessonPage = lazy(
  () => import('@/features/courses/pages/lesson-page'),
);
// ── Labs──────────────────
export const LabsListPage = lazy(
  () => import('@/features/labs/pages/labs-list-page'),
);
export const LabDetailPage = lazy(
  () => import('@/features/labs/pages/lab-detail-page'),
);
// ── Learning Paths ─────────────────────────────
export const PathsPage = lazy(
  () => import('@/features/paths/pages/paths-page'),
);
export const PathDetailPage = lazy(
  () => import('@/features/paths/pages/path-detail-page'),
);
// Dev (temporary) Pages
