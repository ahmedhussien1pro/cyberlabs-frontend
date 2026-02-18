/**
 * Landing Components Type Definitions
 * @module shared/components/landing
 */

// ==================== SHARED TYPES ====================

/**
 * Localized text in multiple languages
 */
export interface LocalizedText {
  en: string
  ar: string
}

/**
 * Course difficulty level
 */
export interface DifficultyLevel {
  en: 'Beginner' | 'Intermediate' | 'Advanced'
  ar: string
}

/**
 * Course statistics
 */
export interface CourseStats {
  rating: number
  difficulty: DifficultyLevel
  duration: LocalizedText
  students: number
}

// ==================== COMPONENT PROPS ====================

/**
 * Home Landing Component Props
 */
export interface HomeLandingProps {
  /** Callback when "Discover Courses" button is clicked */
  onDiscoverCourses?: () => void
  /** Callback when "Watch Demo" button is clicked */
  onWatchDemo?: () => void
}

/**
 * Course Landing Component Props
 */
export interface CourseLandingProps extends CourseStats {
  title: LocalizedText
  description: LocalizedText
  courseImage?: string
  instructor?: string
  onStartLearning?: () => void
  onSave?: () => void
  onFavorite?: () => void
  isSaved?: boolean
  isFavorite?: boolean
}

/**
 * Learn Landing Component Props
 */
export interface LearnLandingProps {
  onStartLearning?: () => void
}

/**
 * Practice Landing Component Props
 */
export interface PracticeLandingProps {
  onTryLab?: () => void
}

/**
 * Landing Layout Component Props
 */
export interface LandingLayoutProps {
  children: React.ReactNode
  imageUrl?: string
  imageAlt?: string
  imageSide?: 'left' | 'right'
  showMobileImage?: boolean
  mobileImageSize?: number
  className?: string
  /** Use particles.js instead of matrix rain for background */
  useParticles?: boolean
}

/**
 * Matrix Rain Component Props
 */
export interface MatrixRainProps {
  opacity?: number
  className?: string
}

/**
 * Particles Background Component Props
 */
export interface ParticlesBackgroundProps {
  opacity?: number
  particleColor?: string
  lineColor?: string
  particleCount?: number
  className?: string
}

/**
 * Stats Bar Component Props
 */
export interface StatsBarProps extends CourseStats {}

/**
 * Action Buttons Component Props
 */
export interface ActionButtonsProps {
  onSave?: () => void
  onFavorite?: () => void
  isSaved?: boolean
  isFavorite?: boolean
}

/**
 * Landing Image Component Props
 */
export interface LandingImageProps {
  src?: string
  alt: string
  students?: number
  className?: string
}
