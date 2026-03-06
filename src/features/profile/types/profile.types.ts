export type {
  UserStats,
  UserPoints,
  UserActivity,
  CompletedLab,
  EnrolledCourse,
} from '@/shared/types/user.types';

// ─── Profile-specific enums ──────────────────────────────────────────────
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

export type CertType = 'COURSE' | 'PATH' | 'LAB' | 'CUSTOM';

// ─── Full user profile ──────────────────────────────────────────────────
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
  /** Arabic title returned by the backend when available */
  ar_title?: string;
  issuer: string;
  /** Platform certificate type: COURSE | PATH | LAB | CUSTOM */
  certType?: CertType;
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
    slug?: string;
    title: string;
    ar_title?: string;
    description?: string;
    ar_description?: string;
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

/**
 * ✅ Fix: aligned with GET /paths/me response shape
 *   careerPath now includes id, slug, difficulty, estimatedHours, modulesCount
 *   so PathsCard can link to /paths/:slug and show module count
 */
export interface UserCareerPath {
  id: string;              // PathEnrollment.id
  progress: number;
  isCompleted?: boolean;
  enrolledAt: string;
  startedAt: string;       // alias of enrolledAt for backward compat
  completedAt?: string | null;
  careerPath: {
    id: string;
    slug: string;
    name: string;
    ar_name?: string | null;
    description?: string | null;
    ar_description?: string | null;
    iconUrl?: string | null;
    difficulty?: string;
    estimatedHours?: number | null;
    modulesCount?: number;
  };
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
