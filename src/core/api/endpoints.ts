export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    // Email/Password
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',

    // Password Reset
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',

    // Email Verification
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',

    // OTP (Phone)
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESEND_OTP: '/api/auth/resend-otp',

    // OAuth
    GOOGLE_LOGIN: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
    GITHUB_LOGIN: '/api/auth/github',
    GITHUB_CALLBACK: '/api/auth/github/callback',
  },

  // User Endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    BY_USERNAME: (username: string) => `/users/username/${username}`,
    UPDATE_PROFILE: '/users/profile',
    UPDATE_PASSWORD: '/users/password',
    UPDATE_AVATAR: '/users/avatar',
  },

  // Course Endpoints
  COURSES: {
    BASE: '/courses',
    BY_ID: (id: string) => `/courses/${id}`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    UNENROLL: (id: string) => `/courses/${id}/unenroll`,
    PROGRESS: (id: string) => `/courses/${id}/progress`,
    LESSONS: (id: string) => `/courses/${id}/lessons`,
    LESSON_BY_ID: (courseId: string, lessonId: string) =>
      `/courses/${courseId}/lessons/${lessonId}`,
    COMPLETE_LESSON: (courseId: string, lessonId: string) =>
      `/courses/${courseId}/lessons/${lessonId}/complete`,
  },

  // Dashboard Endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITY: '/dashboard/activity',
    ENROLLED_COURSES: '/dashboard/courses',
  },

  // Profile Endpoints
  PROFILE: {
    ACHIEVEMENTS: '/profile/achievements',
    CERTIFICATES: '/profile/certificates',
    ACTIVITY: '/profile/activity',
  },
} as const;
