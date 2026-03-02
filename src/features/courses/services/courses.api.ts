import apiClient from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type {
  Course,
  CourseColor,
  CourseSection,
  CourseFilters,
  Enrollment,
  PaginatedCourses,
  PathDetail,
  PathsListResponse,
} from '../types/course.types';

const { COURSES, PATHS, ENROLLMENTS } = API_ENDPOINTS;

// ── Normalizer ────────────────────────────────────────────────────────
// Backend returns color as UPPERCASE (BLUE/EMERALD). Tailwind needs lowercase.
export function normalizeCourse(raw: any): Course {
  return {
    ...raw,
    color: (raw.color as string)?.toLowerCase() as CourseColor,
    sections: Array.isArray(raw.sections)
      ? raw.sections.map((s: any) => ({
          ...s,
          lessons: Array.isArray(s.lessons) ? s.lessons : [],
        }))
      : [],
  };
}

function normalizeCourseList(raw: any): PaginatedCourses {
  const list: any[] = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
      ? raw
      : [];
  return {
    data: list.map(normalizeCourse),
    meta: raw?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 },
  };
}

// ── Courses API ───────────────────────────────────────────────────────
export const coursesApi = {
  // GET /courses?search=&difficulty=&access=&state=&page=
  list: (filters: CourseFilters = {}): Promise<PaginatedCourses> =>
    apiClient
      .get(COURSES.BASE, { params: filters })
      .then((r) => normalizeCourseList(r.data)),

  // GET /courses/:slug
  get: (slug: string): Promise<Course> =>
    apiClient
      .get(COURSES.BY_SLUG(slug))
      .then((r) => normalizeCourse(r.data?.data ?? r.data)),

  // GET /courses/:slug/curriculum  → sections[] with lessons[]
  getCurriculum: (slug: string): Promise<CourseSection[]> =>
    apiClient
      .get(COURSES.CURRICULUM(slug))
      .then((r) => (Array.isArray(r.data) ? r.data : (r.data?.data ?? []))),

  // GET /courses/:slug/sections  → alternate endpoint
  getSections: (slug: string): Promise<CourseSection[]> =>
    apiClient
      .get(COURSES.SECTIONS(slug))
      .then((r) => (Array.isArray(r.data) ? r.data : (r.data?.data ?? []))),

  // POST /courses/:courseId/enroll
  enroll: (
    courseId: string,
  ): Promise<{ success: boolean; enrolledAt: string }> =>
    apiClient.post(COURSES.ENROLL(courseId)).then((r) => r.data),

  // POST /courses/:courseId/lessons/:lessonId/complete
  markLessonComplete: (
    courseId: string,
    lessonId: string,
  ): Promise<{ success: boolean; completedAt: string }> =>
    apiClient
      .post(COURSES.MARK_LESSON_COMPLETE(courseId, lessonId))
      .then((r) => r.data),

  // GET /courses/me/progress
  getMyProgress: (): Promise<{
    enrolled: string[];
    completed: Record<string, string[]>;
    favorites: string[];
  }> => apiClient.get(COURSES.MY_PROGRESS).then((r) => r.data),

  // PUT /courses/me/favorites
  syncFavorite: (
    courseId: string,
    action: 'add' | 'remove',
  ): Promise<{ success: boolean }> =>
    apiClient
      .put(COURSES.MY_FAVORITES, { courseId, action })
      .then((r) => r.data),

  // ── Enrollments ──────────────────────────────────────────────────
  // GET /enrollments/me  → all enrolled courses for current user
  getMyEnrollments: (): Promise<Enrollment[]> =>
    apiClient
      .get(ENROLLMENTS.MY)
      .then((r) => (Array.isArray(r.data) ? r.data : (r.data?.data ?? []))),

  // ── Learning Paths ────────────────────────────────────────────────
  // GET /paths
  listPaths: (filters?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    search?: string;
  }): Promise<PathsListResponse> =>
    apiClient.get(PATHS.BASE, { params: filters }).then((r) => r.data),

  // GET /paths/:slug
  getPath: (slug: string): Promise<PathDetail> =>
    apiClient.get(PATHS.BY_SLUG(slug)).then((r) => r.data),

  // POST /paths/:slug/enroll
  enrollPath: (
    slug: string,
  ): Promise<{ success: boolean; enrolledAt: string }> =>
    apiClient.post(PATHS.ENROLL(slug)).then((r) => r.data),
};
