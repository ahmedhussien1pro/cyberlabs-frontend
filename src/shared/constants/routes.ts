// src/shared/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',

  AUTH: {
    LOGIN: '/auth',
    REGISTER: '/auth',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    LOGOUT: '/logout',
    OTP_VERIFICATION: '/otp',
    OAUTH_CALLBACK: '/auth/callback',
    GOOGLE_CALLBACK: '/auth/google/callback',
    GITHUB_CALLBACK: '/auth/github/callback',
  },

  DASHBOARD: {
    HOME: '/dashboard',
    ADMIN: '/dashboard/admin',
    TRAINEE: '/dashboard/trainee',
    CONTENT_CREATOR: '/dashboard/content-creator',
  },

  COURSES: {
    LIST: '/courses',
    DETAIL: (id: string) => `/courses/${id}`,
    LESSON: (courseId: string, lessonId: string) =>
      `/courses/${courseId}/lessons/${lessonId}`,
  },

  PROFILE: {
    VIEW: '/profile',
    EDIT: '/profile/edit',
    ACHIEVEMENTS: '/profile/achievements',
    CERTIFICATES: '/profile/certificates',
  },

  LABS: {
    LIST: '/labs',
    DETAIL: (id: string) => `/labs/${id}`,
  },

  UNAUTHORIZED: '/403',
} as const;
