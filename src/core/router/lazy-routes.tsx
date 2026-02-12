import { lazy } from "react"

// Auth Pages
export const LoginPage = lazy(() => import("@/features/auth/pages/login-page"))
export const RegisterPage = lazy(() => import("@/features/auth/pages/register-page"))
export const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/forgot-password-page"))
export const ResetPasswordPage = lazy(() => import("@/features/auth/pages/reset-password-page"))
export const VerifyEmailPage = lazy(() => import("@/features/auth/pages/verify-email-page"))

// Website Pages
export const HomePage = lazy(() => import("@/features/website/pages/home-page"))
export const AboutPage = lazy(() => import("@/features/website/pages/about-page"))
export const ContactPage = lazy(() => import("@/features/website/pages/contact-page"))
export const PricingPage = lazy(() => import("@/features/website/pages/pricing-page"))

// Course Pages
export const CoursesListPage = lazy(() => import("@/features/courses/pages/courses-list-page"))
export const CourseDetailPage = lazy(() => import("@/features/courses/pages/course-detail-page"))
export const LessonPage = lazy(() => import("@/features/courses/pages/lesson-page"))

// Dashboard Pages
export const DashboardPage = lazy(() => import("@/features/dashboard/pages/dashboard-page"))
export const SettingsPage = lazy(() => import("@/features/dashboard/pages/settings-page"))

// Profile Pages
export const ProfilePage = lazy(() => import("@/features/profile/pages/profile-page"))
export const ProfileEditPage = lazy(() => import("@/features/profile/pages/profile-edit-page"))
export const CertificatesPage = lazy(() => import("@/features/profile/pages/certificates-page"))
export const AchievementsPage = lazy(() => import("@/features/profile/pages/achievements-page"))

// Error Pages
export const NotFoundPage = lazy(() => import("@/features/website/pages/not-found-page"))
