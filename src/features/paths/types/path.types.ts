// ─── Primitives ───────────────────────────────────────────────────────────────
export type PathDifficulty =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'All Levels';

export type PathColor =
  | 'emerald'
  | 'blue'
  | 'violet'
  | 'orange'
  | 'rose'
  | 'cyan';

export type ModuleType = 'course' | 'lab' | 'quiz' | 'project';
export type ModuleStatus = 'published' | 'coming_soon' | 'draft';
export type ModuleState = 'done' | 'active' | 'locked' | 'soon';

// ─── Nested entities ──────────────────────────────────────────────────────────
export interface PathModuleCourse {
  id: string;
  title: string;
  ar_title?: string;
  slug: string;
  thumbnail?: string;
  color?: string;
  difficulty?: string;
  access?: 'FREE' | 'PRO' | 'PREMIUM';
  duration?: number;
  totalTopics?: number;
  estimatedHours?: number;
  description?: string;
  ar_description?: string;
  contentType?: string;
}

export interface PathModuleLab {
  id: string;
  title: string;
  ar_title?: string;
  slug: string;
  difficulty?: string;
  duration?: number;
}

export interface PathModuleProgress {
  progress: number;
  isCompleted: boolean;
}

// ─── PathModule ───────────────────────────────────────────────────────────────
export interface PathModule {
  id: string;
  order: number;
  title: string;
  ar_title: string;
  description: string;
  ar_description: string;
  type: ModuleType;
  status: ModuleStatus;
  estimatedHours: number;
  isLocked: boolean;
  slug?: string;
  course?: PathModuleCourse;
  lab?: PathModuleLab;
  userProgress?: PathModuleProgress;
}

// ─── LearningPath ─────────────────────────────────────────────────────────────
export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  ar_title: string;
  description: string;
  ar_description: string;
  longDescription: string;
  ar_longDescription: string;
  iconName: string;
  color: PathColor;
  difficulty: PathDifficulty;
  order: number;
  totalModules: number;
  totalCourses: number;
  totalLabs: number;
  estimatedHours: number;
  tags: string[];
  ar_tags: string[];
  prerequisites: string[];
  ar_prerequisites: string[];
  skills: string[];
  ar_skills: string[];
  modules: PathModule[];
  isNew?: boolean;
  isFeatured?: boolean;
  isComingSoon?: boolean;
  enrolled?: boolean;
  progress?: number;
  completedAt?: string | null;
}

// ─── Filters & helpers ────────────────────────────────────────────────────────
export interface PathFilters {
  difficulty?: PathDifficulty | 'all';
  search?: string;
}

export type PathDifficultyCount = Record<string, number>;
