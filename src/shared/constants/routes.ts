export const ROUTES = {
  HOME: "/",
  
  // Auth Routes
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
  },
  
  // Dashboard Routes
  DASHBOARD: {
    HOME: "/dashboard",
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",
  },
  
  // Course Routes
  COURSES: {
    LIST: "/courses",
    DETAIL: (id: string) => `/courses/${id}`,
    LESSON: (courseId: string, lessonId: string) => `/courses/${courseId}/lessons/${lessonId}`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
  },
  
  // Profile Routes
  PROFILE: {
    VIEW: (username: string) => `/profile/${username}`,
    EDIT: "/profile/edit",
    CERTIFICATES: "/profile/certificates",
    ACHIEVEMENTS: "/profile/achievements",
  },
  
  // Website Routes
  ABOUT: "/about",
  CONTACT: "/contact",
  PRICING: "/pricing",
  BLOG: "/blog",
  
  // Error Routes
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/401",
  FORBIDDEN: "/403",
  SERVER_ERROR: "/500",
} as const
