export const ROUTES = {
  HOME: '/',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  VERIFY_EMAIL: '/verify-email',

  // Dashboard
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',

  // Labs
  LABS: '/labs',
  LAB_DETAIL: '/labs/:id',
  LAB_PLAYER: '/labs/:id/play',

  // Courses
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  LESSON: '/courses/:courseId/lessons/:lessonId',

  // Other
  LEADERBOARD: '/leaderboard',
  ABOUT: '/about',
  CONTACT: '/contact',
  NOT_FOUND: '*',
} as const;
