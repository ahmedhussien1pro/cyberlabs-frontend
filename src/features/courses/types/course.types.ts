export type CourseAccess = 'free' | 'pro' | 'premium';
export type CourseStatus = 'published' | 'draft' | 'coming_soon';
export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CourseI18n {
  category: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: string;
  state: string;
}

export interface Course {
  id: string;
  slug: string;
  image: string; // URL from R2 / CDN
  favorite: boolean;
  myCourses: boolean;
  status: CourseStatus;
  access: CourseAccess;
  en_data: CourseI18n;
  ar_data: CourseI18n;
  // API extras
  estimatedHours?: number;
  enrolledCount?: number;
  rating?: number;
  pathId?: string;
  totalLabs?: number;
}

export interface CourseFilters {
  search?: string;
  category?: string;
  difficulty?: CourseDifficulty;
  access?: CourseAccess;
  pathId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCourses {
  data: Course[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
