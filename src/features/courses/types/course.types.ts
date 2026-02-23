export type CourseAccess = 'free' | 'pro' | 'premium';
export type CourseStatus = 'published' | 'draft' | 'coming_soon';
export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type LessonType = 'video' | 'article' | 'quiz' | 'lab' | 'project';

// ── i18n block ───────────────────────────────────────────────
export interface CourseI18n {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  difficulty: string;
  state: string;
  topics: string[];
  prerequisites: string[];
  skills: string[];
  tags: string[];
}

// ── Curriculum ───────────────────────────────────────────────
export interface CourseLessonItem {
  id: string;
  order: number;
  title: string;
  ar_title: string;
  type: LessonType;
  durationMin: number;
  isFree: boolean;
  isCompleted?: boolean;
}

export interface CourseSection {
  id: string;
  order: number;
  title: string;
  ar_title: string;
  lessons: CourseLessonItem[];
}

// ── Main entity ──────────────────────────────────────────────
export interface Course {
  id: string;
  slug: string;
  image: string;
  color: 'emerald' | 'blue' | 'violet' | 'orange' | 'rose' | 'cyan';
  access: CourseAccess;
  status: CourseStatus;
  isNew?: boolean;
  isFeatured?: boolean;
  enrolled?: boolean;
  progress?: number;
  completedAt?: string | null;
  estimatedHours: number;
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  totalLessons: number;
  totalSections: number;
  pathId?: string;
  instructor: {
    name: string;
    avatar?: string;
    title: string;
  };
  en_data: CourseI18n;
  ar_data: CourseI18n;
  sections?: CourseSection[];
}

// ── Filters ──────────────────────────────────────────────────
export interface CourseFilters {
  search?: string;
  category?: string;
  difficulty?: CourseDifficulty;
  access?: CourseAccess;
  pathId?: string;
  page?: number;
  limit?: number;
}

// ── API responses ─────────────────────────────────────────────
export interface PaginatedCourses {
  data: Course[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
