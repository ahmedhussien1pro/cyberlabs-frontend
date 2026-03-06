export interface Session {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface NotificationPrefs {
  emailNotifications: boolean;
  pushNotifications: boolean;
  labCompleted: boolean;
  courseUpdates: boolean;
  achievementUnlocked: boolean;
  weeklyReport: boolean;
  monthlyDigest: boolean;
  securityAlerts: boolean;
  newCoursesAvailable: boolean;
  promotions: boolean;
}

export interface EmailChangeResponse {
  token: string;
  expiresIn: number;
}
