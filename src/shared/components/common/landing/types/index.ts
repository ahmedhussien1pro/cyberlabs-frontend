export interface LocalizedText {
  en: string;
  ar: string;
}

export interface DifficultyLevel {
  en: 'Beginner' | 'Intermediate' | 'Advanced';
  ar: string;
}

export interface CourseStats {
  rating: number;
  difficulty: DifficultyLevel;
  duration: LocalizedText;
  students: number;
}

export interface HomeLandingProps {
  onDiscoverCourses?: () => void;
  onWatchDemo?: () => void;
}
export interface CourseLandingProps {
  title: LocalizedText;
  description: LocalizedText;
  difficulty: LocalizedText;
  duration: LocalizedText;
  courseImage?: string;
  instructor?: string;
  rating?: number;
  students?: number;
  onStartLearning?: () => void;
  onSave?: () => void;
  onFavorite?: () => void;
  isSaved?: boolean;
  isFavorite?: boolean;
}

export interface LearnLandingProps {
  onStartLearning?: () => void;
}

export interface PracticeLandingProps {
  onTryLab?: () => void;
}

export interface LandingLayoutProps {
  children: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  imageSide?: 'left' | 'right';
  showMobileImage?: boolean;
  mobileImageSize?: number;
  className?: string;
}

export interface MatrixRainProps {
  opacity?: number;
  color?: string;
  speed?: number;
  className?: string;
}

export interface StatsBarProps {
  rating: number;
  difficulty: LocalizedText;
  duration: LocalizedText;
  students: number;
}

export interface ActionButtonsProps {
  onSave?: () => void;
  onFavorite?: () => void;
  isSaved?: boolean;
  isFavorite?: boolean;
}

export interface LandingImageProps {
  src?: string;
  alt: string;
  students?: number;
  className?: string;
}
export interface ParticlesBackgroundProps {
  opacity?: number;
  particleColor?: string;
  lineColor?: string;
  particleCount?: number;
  className?: string;
}
