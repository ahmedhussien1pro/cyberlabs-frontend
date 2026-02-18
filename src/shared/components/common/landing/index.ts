// ==================== MAIN COMPONENTS ====================
export { CourseLanding } from './course-landing';
export { LearnLanding } from './learn-landing';
export { PracticeLanding } from './practice-landing';
export { HomeLanding } from './home-landing';
export { LandingLayout } from './landing-layout';
export { MatrixRain } from './matrix-rain';

// ==================== SUB-COMPONENTS ====================
export { StatsBar } from './components/stats-bar';
export { ActionButtons } from './components/action-buttons';
export { LandingImage } from './components/landing-image';

// ==================== HOOKS ====================
export { useLandingActions } from './hooks/use-landing-actions';

// ==================== CONSTANTS ====================
export { DEFAULT_COURSE_IMAGE, FALLBACK_IMAGES } from './constants';

// ==================== TYPES ====================
export type {
  LocalizedText,
  DifficultyLevel,
  CourseStats,
  CourseLandingProps,
  LearnLandingProps,
  HomeLandingProps,
  PracticeLandingProps,
  LandingLayoutProps,
  MatrixRainProps,
  StatsBarProps,
  ActionButtonsProps,
  LandingImageProps,
} from './types';
