export type NotificationType =
  | 'SYSTEM'
  | 'ACHIEVEMENT'
  | 'LEVEL_UP'
  | 'LAB'
  | 'COURSE'
  | 'CHALLENGE'
  | 'MESSAGE';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  link?: string;
  meta?: {
    xp?: number;
    level?: number;
    badge?: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}
