// ── Enums match Prisma schema (UPPERCASE) ────────────────────────────
// Exception: CourseColor stays lowercase — Tailwind class names require it
export type CourseAccess = 'FREE' | 'PRO' | 'PREMIUM';
export type CourseDifficulty =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'EXPERT';
export type CourseColor =
  | 'emerald'
  | 'blue'
  | 'violet'
  | 'orange'
  | 'rose'
  | 'cyan';
export type CourseState = 'PUBLISHED' | 'COMING_SOON' | 'DRAFT';
export type LessonType = 'VIDEO' | 'ARTICLE' | 'QUIZ';
export type CourseContentType = 'PRACTICAL' | 'THEORETICAL' | 'MIXED';
export type CourseCategory =
  | 'WEB_SECURITY'
  | 'PENETRATION_TESTING'
  | 'MALWARE_ANALYSIS'
  | 'CLOUD_SECURITY'
  | 'FUNDAMENTALS'
  | 'CRYPTOGRAPHY'
  | 'NETWORK_SECURITY'
  | 'TOOLS_AND_TECHNIQUES'
  | 'CAREER_AND_INDUSTRY';

// Unified alias — used by LearningPath/PathModule models
export type Difficulty = CourseDifficulty;

// ── Lesson & Section ─────────────────────────────────────────────────
export interface CourseLesson {
  id: string;
  order: number;
  title: string;
  ar_title: string | null;
  type: LessonType;
  duration: number;
  isPreview: boolean;
}

export interface CourseSection {
  id: string;
  order: number;
  title: string;
  ar_title: string | null;
  lessons: CourseLesson[];
}

// ── Instructor ───────────────────────────────────────────────────────
export interface CourseInstructor {
  name: string;
  title: string;
  avatar?: string;
}

// ── Course ───────────────────────────────────────────────────────────
export interface Course {
  id: string;
  slug: string;
  title: string;
  ar_title: string | null;
  description: string | null;
  ar_description: string | null;
  longDescription: string | null;
  ar_longDescription: string | null;
  image: string | null;
  thumbnail: string | null;
  color: CourseColor;
  access: CourseAccess;
  state: CourseState;
  difficulty: CourseDifficulty;
  ar_difficulty: string | null;
  category: CourseCategory;
  ar_category: string | null;
  contentType: CourseContentType;
  estimatedHours: number;
  enrollmentCount: number;
  averageRating: number;
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
  labsLink?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

// ── Filters ──────────────────────────────────────────────────────────
export interface CourseFilters {
  search?: string;
  difficulty?: CourseDifficulty | 'all';
  access?: CourseAccess | 'all';
  category?: CourseCategory | 'all';
  contentType?: CourseContentType | 'all';
  state?: CourseState | 'all';
  onlyFavorites?: boolean;
  onlyEnrolled?: boolean;
  onlyCompleted?: boolean;
  page?: number;
}

export interface PaginatedCourses {
  data: Course[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ── Enrollment ───────────────────────────────────────────────────────
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  isCompleted: boolean;
  enrolledAt: string;
  completedAt: string | null;
  lastAccessedAt: string | null;
  course: Pick<
    Course,
    'id' | 'slug' | 'title' | 'ar_title' | 'thumbnail' | 'color' | 'difficulty'
  >;
}

// ── Learning Path Types ──────────────────────────────────────────────
export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  ar_title: string | null;
  description: string | null;
  ar_description: string | null;
  iconName: string;
  color: CourseColor;
  difficulty: Difficulty;
  order: number;
  totalCourses: number;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface PathCourseItem {
  id: string | null;
  slug: string;
  title: string;
  ar_title: string | null;
  description: string | null;
  difficulty: Difficulty | null;
  duration: number | null;
  totalTopics: number;
  color: CourseColor | null;
  access: CourseAccess;
  isPublished: boolean;
  status: CourseState;
  order: number;
}

// ── Learning Path Types ──────────────────────────────────────────────

export interface PathModule {
  id: string;
  order: number;
  title: string;
  ar_title: string | null;
  description: string | null;
  ar_description: string | null;
  type: 'COURSE' | 'LAB' | 'QUIZ' | 'PROJECT';
  status: 'PUBLISHED' | 'COMING_SOON' | 'DRAFT';
  estimatedHours: number;
  isLocked: boolean;
  courseId: string | null;
  labId: string | null;

  course: {
    id: string;
    slug: string;
    title: string;
    ar_title: string | null;
    description: string | null;
    ar_description: string | null;
    longDescription: string | null;
    ar_longDescription: string | null;
    thumbnail: string | null;
    image: string | null;
    color: CourseColor;
    access: CourseAccess;
    state: CourseState;
    difficulty: CourseDifficulty;
    ar_difficulty: string | null;
    category: CourseCategory;
    ar_category: string | null;
    contentType: CourseContentType;
    isNew: boolean;
    isFeatured: boolean;
    totalTopics: number;
    estimatedHours: number;
    enrollmentCount: number;
    averageRating: number;
    reviewCount: number;
    tags: string[];
    skills: string[];
    ar_skills: string[];
    topics: string[];
    ar_topics: string[];
    prerequisites: string[];
    ar_prerequisites: string[];
    sections: { id: string; order: number }[];
    labsCount: number;
    userProgress: {
      progress: number;
      isCompleted: boolean;
    } | null;
  } | null;

  lab: {
    id: string;
    title: string;
    ar_title: string | null;
    difficulty: Difficulty | null;
    duration: number | null;
  } | null;

  userProgress: {
    progress: number;
    isCompleted: boolean;
  };
}

export interface PathDetail {
  id: string;
  slug: string;
  title: string;
  ar_title: string | null;
  description: string | null;
  ar_description: string | null;
  longDescription: string | null;
  ar_longDescription: string | null;
  iconName: string;
  color: CourseColor;
  difficulty: Difficulty;
  order: number;
  totalModules: number;
  totalCourses: number;
  totalLabs: number;
  estimatedHours: number;
  tags: string[];
  ar_tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isComingSoon: boolean;
  isPublished: boolean;
  modules: PathModule[];
  isEnrolled: boolean;
  progress: number;
  enrolledAt: string | null;
}

export interface PathListItem {
  id: string;
  slug: string;
  title: string;
  ar_title: string | null;
  description: string | null;
  ar_description: string | null;
  iconName: string;
  color: CourseColor;
  difficulty: Difficulty;
  order: number;
  totalCourses: number;
  totalLabs: number;
  estimatedHours: number;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isComingSoon: boolean;
  isPublished: boolean;
  isEnrolled: boolean;
  progress: number;
  _count: { modules: number };
}

export interface PathsListResponse {
  data: PathListItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ── Curriculum JSON Types ─────────────────────────────────────────────
export interface CurriculumElement {
  id: string | number;
  type:
    | 'image'
    | 'title'
    | 'text'
    | 'table'
    | 'terminal'
    | 'note'
    | 'hr'
    | 'orderedList'
    | 'list'
    | 'quiz';
  value?: { en: string; ar: string };
  [key: string]: unknown;
}

export interface CurriculumTopic {
  id: string;
  title: { en: string; ar: string };
  elements: CurriculumElement[];
}

export interface CurriculumData {
  topics: CurriculumTopic[];
  totalTopics: number;
  landingData?: Record<string, unknown>;
}
