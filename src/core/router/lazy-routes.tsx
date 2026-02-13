// src/core/router/lazy-routes.tsx
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
  () => import('@/features/website/pages/pricing-page'),
);

// Auth Pages
export const AuthPage = lazy(() => import('@/features/auth/pages/auth-page'));
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

// Error Pages
export const NotFoundPage = lazy(
  () => import('@/features/errors/pages/not-found-page'),
);
export const UnauthorizedPage = lazy(
  () => import('@/features/errors/pages/unauthorized-page'),
);
