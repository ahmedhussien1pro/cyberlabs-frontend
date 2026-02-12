export const QUERY_KEYS = {
  // Auth
  AUTH: {
    ME: ["auth", "me"],
    VERIFY: (token: string) => ["auth", "verify", token],
  },
  
  // Users
  USERS: {
    ALL: ["users"],
    BY_ID: (id: string) => ["users", id],
    BY_USERNAME: (username: string) => ["users", "username", username],
  },
  
  // Courses
  COURSES: {
    ALL: ["courses"],
    BY_ID: (id: string) => ["courses", id],
    LIST: (filters?: Record<string, unknown>) => ["courses", "list", filters],
    ENROLLED: ["courses", "enrolled"],
    PROGRESS: (id: string) => ["courses", id, "progress"],
    LESSONS: (courseId: string) => ["courses", courseId, "lessons"],
    LESSON: (courseId: string, lessonId: string) => 
      ["courses", courseId, "lessons", lessonId],
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: ["dashboard", "stats"],
    ACTIVITY: ["dashboard", "activity"],
    ENROLLED_COURSES: ["dashboard", "enrolled-courses"],
  },
  
  // Profile
  PROFILE: {
    ACHIEVEMENTS: (userId?: string) => ["profile", userId || "me", "achievements"],
    CERTIFICATES: (userId?: string) => ["profile", userId || "me", "certificates"],
    ACTIVITY: (userId?: string) => ["profile", userId || "me", "activity"],
  },
} as const

export default QUERY_KEYS
