import type { LucideIcon } from 'lucide-react';

export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export type BadgeCategory =
  | 'learning'
  | 'labs'
  | 'paths'
  | 'streak'
  | 'xp'
  | 'leaderboard'
  | 'special';

export type BadgeSlug =
  // Learning
  | 'FIRST_COURSE'
  | 'COURSE_3'
  | 'COURSE_5'
  | 'COURSE_10'
  | 'COURSE_25'
  | 'COURSE_ALL'
  | 'SPEED_RUNNER'
  // Labs
  | 'FIRST_LAB'
  | 'LAB_3'
  | 'LAB_5'
  | 'LAB_10'
  | 'LAB_25'
  | 'LAB_50'
  | 'LAB_100'
  | 'HACK_KING'
  | 'FIRST_BLOOD'
  | 'PERFECT_SOLVE'
  // Paths
  | 'FIRST_PATH'
  | 'PATH_3'
  | 'PATH_ALL'
  | 'PATH_WEB_SEC'
  | 'PATH_PENTEST'
  | 'PATH_FORENSICS'
  // Streak
  | 'STREAK_3'
  | 'STREAK_7'
  | 'STREAK_14'
  | 'STREAK_30'
  | 'STREAK_60'
  | 'STREAK_100'
  // XP
  | 'XP_500'
  | 'XP_1000'
  | 'XP_5000'
  | 'XP_10000'
  | 'XP_50000'
  // Leaderboard & Time
  | 'LEADERBOARD_1'
  | 'LEADERBOARD_TOP3'
  | 'LEADERBOARD_TOP10'
  | 'TIME_LORD'
  | 'MARATHON'
  // Special
  | 'EARLY_ADOPTER'
  | 'NIGHT_OWL'
  | 'EARLY_BIRD'
  | 'WEEKEND_WARRIOR'
  | 'COMEBACK_KID'
  | 'PIONEER'
  | 'PERFECT_QUIZ'
  | 'SHARE_MASTER'
  | 'PROFILE_COMPLETE'
  | 'DARK_MODE'
  | 'LANGUAGE_SWITCH'
  | (string & {});

// ── visual config ──────────────────────────────────
export interface BadgeVisualConfig {
  icon: LucideIcon;
  tier: BadgeTier;
  category: BadgeCategory;
  label_en: string;
  label_ar: string;
  desc_en: string;
  desc_ar: string;
}

// ── Tier design tokens ────────────────────────────────────────────────────
export interface TierDesign {
  bg: string; // tailwind gradient
  ring: string; // ring color
  iconColor: string; // icon text-color
  glowColor: string; // shadow color class
  label_en: string;
  label_ar: string;
}
