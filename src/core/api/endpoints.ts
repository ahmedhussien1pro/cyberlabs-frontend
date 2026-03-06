// src/core/api/endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_EMAIL_OTP: '/auth/verify-email-otp',
    RESEND_VERIFICATION: '/auth/resend-verification',
    GOOGLE_LOGIN: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    GITHUB_LOGIN: '/auth/github',
    GITHUB_CALLBACK: '/auth/github/callback',
    TWO_FACTOR_GENERATE: '/auth/2fa/generate',
    TWO_FACTOR_ENABLE: '/auth/2fa/enable',
    TWO_FACTOR_DISABLE: '/auth/2fa/disable',
    TWO_FACTOR_VERIFY: '/auth/2fa/verify',
  },

  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    BY_USERNAME: (username: string) => `/users/username/${username}`,
    UPDATE_PROFILE: '/users/me',
    UPDATE_PASSWORD: '/users/me/password',
    UPDATE_AVATAR: '/users/avatar',
    AVATAR_PRESIGN: '/users/me/avatar/presign',
    AVATAR_CONFIRM: '/users/me/avatar/confirm',
    DELETE_ACCOUNT: '/users/me',
    EXPORT_DATA: '/users/me/export',
    SESSIONS: '/users/me/sessions',
    REVOKE_SESSION: (id: string) => `/users/me/sessions/${id}`,
    NOTIFICATION_PREFS: '/users/me/notifications/preferences',
  },

  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    ARCHIVE: (id: string) => `/notifications/${id}/archive`,
    DELETE: (id: string) => `/notifications/${id}`,
  },

  PATHS: {
    BASE: '/paths',
    BY_SLUG: (slug: string) => `/paths/${slug}`,
    ENROLL: (slug: string) => `/paths/${slug}/enroll`,
  },

  COURSES: {
    BASE: '/courses',
    BY_SLUG: (slug: string) => `/courses/${slug}`,
    CURRICULUM: (slug: string) => `/courses/${slug}/curriculum`,
    SECTIONS: (slug: string) => `/courses/${slug}/sections`,
    ENROLL: (courseId: string) => `/courses/${courseId}/enroll`,
    MARK_LESSON_COMPLETE: (courseId: string, lessonId: string) =>
      `/courses/${courseId}/lessons/${lessonId}/complete`,
    MY_PROGRESS: '/courses/me/progress',
    MY_FAVORITES: '/courses/me/favorites',
  },

  ENROLLMENTS: {
    BASE: '/enrollments',
    MY: '/enrollments',
  },

  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITY: '/dashboard/activity',
    ENROLLED_COURSES: '/dashboard/courses',
    ACTIVE_LABS: '/dashboard/labs/active',
    PROGRESS_WEEKLY: '/dashboard/progress/weekly',
    PROGRESS_MONTHLY: '/dashboard/progress/monthly',
    PROGRESS_CHART: '/dashboard/progress/chart',
    LEADERBOARD: '/dashboard/leaderboard',
    HEATMAP: '/dashboard/heatmap',
  },

  // ✅ Fix: was /labs/me — backend controller is @Controller('practice-labs')
  LABS: {
    BASE: '/practice-labs',
    BY_ID: (id: string) => `/practice-labs/${id}`,
    BY_SLUG: (slug: string) => `/practice-labs/${slug}`,
    ALL: '/practice-labs',
    // ✅ MY_LABS now points to /practice-labs/progress (user's own progress list)
    MY_LABS: '/practice-labs/progress',
    ACTIVE: '/practice-labs/progress',
    STATS: '/practice-labs/stats',
    START: (id: string) => `/practice-labs/${id}/launch`,
    COMPLETE: (id: string) => `/practice-labs/${id}/submit`,
    PROGRESS: (id: string) => `/practice-labs/progress?labId=${id}`,
    SUBMIT: (id: string) => `/practice-labs/${id}/submit`,
    LAUNCH_CONSUME: '/practice-labs/launch/consume',
    HINT: (id: string) => `/practice-labs/${id}/hint`,
  },

  GOALS: {
    BASE: '/goals',
    BY_ID: (id: string) => `/goals/${id}`,
    CREATE: '/goals',
    UPDATE: (id: string) => `/goals/${id}`,
    DELETE: (id: string) => `/goals/${id}`,
  },

  PROGRESS: {
    BASE: '/progress',
    BY_COURSE: (courseId: string) => `/progress/course/${courseId}`,
    DASHBOARD: '/progress/dashboard',
    CHART_DATA: '/progress/chart',
  },

  PROFILE: {
    ACHIEVEMENTS: '/profile/achievements',
    CERTIFICATES: '/profile/certificates',
    ACTIVITY: '/profile/activity',
  },
} as const;
