export type SocialPlatform =
  | 'GITHUB'
  | 'LINKEDIN'
  | 'TWITTER'
  | 'YOUTUBE'
  | 'FACEBOOK'
  | 'PORTFOLIO'
  | 'EMAIL'
  | 'OTHER';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type BadgeType =
  | 'COURSE_COMPLETION'
  | 'LAB_SOLVED'
  | 'STREAK'
  | 'COMMUNITY'
  | 'CONTRIBUTION'
  | 'CUSTOM';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  ar_bio?: string;
  avatarUrl?: string;
  address?: string;
  birthday?: string;
  phoneNumber?: string;
  role: string;
  internalRole?: string;
  createdAt: string;
  isActive: boolean;
  socialLinks?: SocialLink[];
  skills?: UserSkill[];
  education?: Education[];
  certifications?: UserCertification[];
  badges?: UserBadge[];
  achievements?: UserAchievement[];
  careerPaths?: UserCareerPath[];
}

export interface UserStats {
  totalHours: number;
  activeDays: number;
  completedLabs: number;
  completedCourses: number;
  badgesCount: number;
  certificationsCount: number;
  profileCompletion: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
}

export interface UserPoints {
  totalXP: number;
  totalPoints: number;
  level: number;
}

export interface SocialLink {
  id: string;
  type: SocialPlatform;
  url: string;
}

export interface UserSkill {
  id: string;
  level: SkillLevel;
  progress: number;
  skill: { id: string; name: string; ar_name?: string; category?: string };
}

export interface Education {
  id: string;
  institution: string;
  ar_institution?: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;
}

export interface UserCertification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expireDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface UserBadge {
  id: string;
  awardedAt: string;
  context?: string;
  badge: {
    title: string;
    ar_title?: string;
    description?: string;
    iconUrl?: string;
    type: BadgeType;
    xpReward: number;
  };
}

export interface UserAchievement {
  id: string;
  achievedAt?: string;
  progress?: number;
  achievement: {
    title: string;
    description?: string;
    iconUrl?: string;
    category: string;
    xpReward: number;
  };
}

export interface UserCareerPath {
  id: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
  careerPath: {
    name: string;
    ar_name?: string;
    description?: string;
    iconUrl?: string;
  };
}

export interface CompletedLab {
  labId: string;
  completedAt: string;
  attempts: number;
  lab: {
    id: string;
    title: string;
    difficulty: string;
    xpReward: number;
  };
}

export interface EnrolledCourse {
  courseId: string;
  progress: number;
  isCompleted: boolean;
  enrolledAt: string;
  completedAt?: string;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
    difficulty: string;
  };
}

export interface UserActivity {
  date: string;
  activeMinutes: number;
  completedTasks: number;
  labsSolved: number;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  ar_bio?: string;
  address?: string;
  birthday?: string;
  phoneNumber?: string;
  socialLinks?: Array<{ type: SocialPlatform; url: string }>;
}
