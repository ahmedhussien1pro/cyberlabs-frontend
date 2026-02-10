export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL_OTP: '/auth/verify-email-otp',
    TWO_FA: {
      GENERATE: '/auth/2fa/generate',
      ENABLE: '/auth/2fa/enable',
      DISABLE: '/auth/2fa/disable',
      VERIFY: '/auth/2fa/verify',
    },
  },

  // Labs
  LABS: {
    LIST: '/labs',
    DETAIL: (id: string) => `/labs/${id}`,
    START: '/labs/start',
    PROGRESS: (id: string) => `/labs/${id}/progress`,
    MY_PROGRESS: '/labs/my/progress',
    SUBMIT: (id: string) => `/labs/${id}/submit`,
    HINTS: (id: string) => `/labs/${id}/hints`,
    SUBMISSIONS: (id: string) => `/labs/${id}/submissions`,
    LEADERBOARD: '/labs/leaderboard/top',
  },

  // Courses
  COURSES: {
    LIST: '/courses',
    DETAIL: (id: string) => `/courses/${id}`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    SECTIONS: (id: string) => `/courses/${id}/sections`,
    LESSONS: (courseId: string, sectionId: string) =>
      `/courses/${courseId}/sections/${sectionId}/lessons`,
    LESSON_DETAIL: (courseId: string, lessonId: string) =>
      `/courses/${courseId}/lessons/${lessonId}`,
    MARK_COMPLETE: (courseId: string, lessonId: string) =>
      `/courses/${courseId}/lessons/${lessonId}/complete`,
    REVIEW: (id: string) => `/courses/${id}/reviews`,
  },

  // Gamification
  GAMIFICATION: {
    XP: '/gamification/xp',
    BADGES: '/gamification/badges',
    ACHIEVEMENTS: '/gamification/achievements',
    LEADERBOARD: '/gamification/leaderboard',
    STATS: '/gamification/stats',
  },

  // Profile
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    SKILLS: '/profile/skills',
    EDUCATION: '/profile/education',
    CERTIFICATIONS: '/profile/certifications',
    SOCIAL_LINKS: '/profile/social-links',
    CAREER_PATH: '/profile/career-path',
  },
} as const;
