import { lazy } from 'react';

// Auth Pages
export const LoginPage = lazy(() => import('@/features/auth/pages/auth-page'));
export const ForgotPasswordPage = lazy(
  () => import('@/features/auth/pages/forgot-password-page'),
);
export const ResetPasswordPage = lazy(
  () => import('@/features/auth/pages/reset-password-page'),
);
export const VerifyEmailPage = lazy(
  () => import('@/features/auth/pages/verify-email-page'),
);

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
  () => import('@/features/website/pages/pricing-page'),
);

// Course Pages
export const CoursesPage = lazy(
  () => import('@/features/courses/pages/courses-page'),
);
export const CourseDetailPage = lazy(
  () => import('@/features/courses/pages/course-detail-page'),
);
export const LessonPage = lazy(
  () => import('@/features/courses/pages/lesson-page'),
);

// Dashboard Pages
export const DashboardPage = lazy(
  () => import('@/features/dashboard/pages/dashboard-page'),
);
export const ProfilePage = lazy(
  () => import('@/features/dashboard/pages/dashboard-page'),
);
export const SettingsPage = lazy(
  () => import('@/features/dashboard/pages/settings-page'),
);
export const EnrolledCoursesPage = lazy(
  () => import('@/features/dashboard/pages/dashboard-page'),
);

// Error Pages
export const NotFoundPage = lazy(
  () => import('@/features/errors/pages/not-found-page'),
);
export const UnauthorizedPage = lazy(
  () => import('@/features/errors/pages/unauthorized-page'),
);
