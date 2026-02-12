export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
  },

  // User Endpoints
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    BY_USERNAME: (username: string) => `/users/username/${username}`,
    UPDATE_PROFILE: "/users/profile",
    UPDATE_PASSWORD: "/users/password",
    UPDATE_AVATAR: "/users/avatar",
  },

  // Course Endpoints
  COURSES: {
    BASE: "/courses",
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
    STATS: "/dashboard/stats",
    RECENT_ACTIVITY: "/dashboard/activity",
    ENROLLED_COURSES: "/dashboard/courses",
  },

  // Profile Endpoints
  PROFILE: {
    ACHIEVEMENTS: "/profile/achievements",
    CERTIFICATES: "/profile/certificates",
    ACTIVITY: "/profile/activity",
  },
} as const
