export type NotificationType =
  // Auth
  | 'AUTH_LOGIN'
  | 'AUTH_REGISTER'
  | 'AUTH_PASSWORD_CHANGED'
  | 'AUTH_PASSWORD_RESET'
  | 'AUTH_2FA_ENABLED'
  | 'AUTH_EMAIL_VERIFIED'
  // Profile
  | 'PROFILE_UPDATED'
  | 'PROFILE_AVATAR_CHANGED'
  // Courses
  | 'COURSE_ENROLLED'
  | 'COURSE_COMPLETED'
  // Paths
  | 'PATH_ENROLLED'
  | 'PATH_COMPLETED'
  // Labs
  | 'LAB_COMPLETED'
  // Gamification
  | 'BADGE_EARNED'
  | 'POINTS_EARNED'
  | 'LEADERBOARD_RANK_UP'
  | 'XP_LEVEL_UP'
  // Subscription
  | 'SUBSCRIPTION_ACTIVATED'
  | 'SUBSCRIPTION_EXPIRING'
  | 'SUBSCRIPTION_CANCELLED'
  // System
  | 'SYSTEM_WELCOME_BACK';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  ar_title: string | null;
  body?: string | null;
  ar_body?: string | null;
  isRead: boolean;
  isArchived: boolean;
  actionUrl?: string | null;
  priority: NotificationPriority;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page?: number;
  totalPages?: number;
}
