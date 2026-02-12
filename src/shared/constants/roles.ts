export enum UserRole {
  ADMIN = "admin",
  INSTRUCTOR = "instructor",
  STUDENT = "student",
  GUEST = "guest",
}

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: ["*"],
  [UserRole.INSTRUCTOR]: [
    "courses:create",
    "courses:edit",
    "courses:delete",
    "lessons:create",
    "lessons:edit",
    "lessons:delete",
  ],
  [UserRole.STUDENT]: [
    "courses:view",
    "courses:enroll",
    "lessons:view",
    "profile:edit",
  ],
  [UserRole.GUEST]: ["courses:view"],
} as const
