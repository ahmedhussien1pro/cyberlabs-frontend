export type CourseAccess = 'free' | 'pro' | 'premium';
export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseColor =
  | 'emerald'
  | 'blue'
  | 'violet'
  | 'orange'
  | 'rose'
  | 'cyan';
export type CourseStatus = 'published' | 'coming_soon' | 'draft';
export type LessonType = 'article' | 'video' | 'lab' | 'quiz' | 'project';
export type CourseContentType = 'practical' | 'theoretical' | 'mixed';
export type CourseCategory =
  | 'Web Security'
  | 'Penetration Testing'
  | 'Malware Analysis'
  | 'Cloud Security'
  | 'Fundamentals'
  | 'Cryptography'
  | 'Network Security'
  | 'Tools & Techniques'
  | 'Career & Industry';

export interface CourseInstructor {
  name: string;
  title: string;
  avatar?: string;
}

export interface CourseLesson {
  id: string;
  order: number;
  title: string;
  ar_title: string;
  type: LessonType;
  durationMin: number;
  isFree: boolean;
}

export interface CourseSection {
  id: string;
  order: number;
  title: string;
  ar_title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  slug: string;

  title: string;
  ar_title: string;
  description: string;
  ar_description: string;
  longDescription: string;
  ar_longDescription: string;

  image: string;
  color: CourseColor;
  access: CourseAccess;
  status: CourseStatus;
  difficulty: CourseDifficulty;
  ar_difficulty: string;
  category: CourseCategory;
  ar_category: string;
  contentType: CourseContentType;

  estimatedHours: number;
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  totalTopics: number;

  instructor: CourseInstructor;

  topics: string[];
  ar_topics: string[];
  skills: string[];
  ar_skills: string[];
  prerequisites: string[];
  ar_prerequisites: string[];
  tags: string[];
  sections: CourseSection[];

  /** External labs URL shown in "Go To Labs" button */
  labsLink?: string;

  isNew?: boolean;
  isFeatured?: boolean;
}

// ── Filters ─────────────────────────────────────────────────────────
export interface CourseFilters {
  search?: string;
  difficulty?: CourseDifficulty | 'all';
  access?: CourseAccess | 'all';
  category?: CourseCategory | 'all';
  contentType?: CourseContentType | 'all';
  status?: CourseStatus | 'all';
  onlyFavorites?: boolean;
  onlyEnrolled?: boolean;
  onlyCompleted?: boolean;
  page?: number;
}

export interface PaginatedCourses {
  data: Course[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
