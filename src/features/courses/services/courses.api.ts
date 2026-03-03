// src/features/courses/services/courses.api.ts
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

// ── Types ─────────────────────────────────────────────────────────────
export interface MyProgressResponse {
  enrolled: string[];
  completed: Record<string, string[]>;
  favorites: string[];
  enrollments: Array<{
    courseId: string;
    progress: number;
    isCompleted: boolean;
  }>;
}

export interface CurriculumData {
  topics: any[];
  totalTopics: number;
  landingData?: Record<string, unknown> | null;
}

// ── Normalizer ────────────────────────────────────────────────────────
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
  list: (filters: CourseFilters = {}): Promise<PaginatedCourses> =>
    apiClient
      .get(COURSES.BASE, { params: filters })
      .then((r) => normalizeCourseList(r.data)),

  get: (slug: string): Promise<Course> =>
    apiClient
      .get(COURSES.BY_SLUG(slug))
      .then((r) => normalizeCourse(r.data?.data ?? r.data)),

  // GET /courses/:slug/curriculum — topics from JSON file
  getCurriculum: (slug: string): Promise<CurriculumData> =>
    apiClient.get(COURSES.CURRICULUM(slug)).then((r) => {
      const payload = r.data?.data ?? r.data;
      return {
        topics: Array.isArray(payload?.topics) ? payload.topics : [],
        totalTopics: Number(payload?.totalTopics) || 0,
        landingData: payload?.landingData ?? null,
      };
    }),

  getSections: (slug: string): Promise<CourseSection[]> =>
    apiClient
      .get(COURSES.SECTIONS(slug))
      .then((r) => (Array.isArray(r.data) ? r.data : (r.data?.data ?? []))),

  enroll: (
    courseId: string,
  ): Promise<{ success: boolean; enrolledAt: string; courseId?: string }> =>
    apiClient.post(COURSES.ENROLL(courseId)).then((r) => r.data),

  markTopicComplete: (
    courseId: string,
    topicId: string,
  ): Promise<{ success: boolean; progress: number; isCompleted: boolean }> =>
    apiClient
      .post(`/courses/${courseId}/topics/${topicId}/complete`)
      .then((r) => r.data),

  getMyProgress: (): Promise<MyProgressResponse> =>
    apiClient.get(COURSES.MY_PROGRESS).then((r) => r.data),

  syncFavorite: (
    courseId: string,
    action: 'add' | 'remove',
  ): Promise<{ success: boolean }> =>
    apiClient
      .put(COURSES.MY_FAVORITES, { courseId, action })
      .then((r) => r.data),

  getMyEnrollments: (): Promise<Enrollment[]> =>
    apiClient
      .get(ENROLLMENTS.MY)
      .then((r) => (Array.isArray(r.data) ? r.data : (r.data?.data ?? []))),

  listPaths: (filters?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    search?: string;
  }): Promise<PathsListResponse> =>
    apiClient.get(PATHS.BASE, { params: filters }).then((r) => r.data),

  getPath: (slug: string): Promise<PathDetail> =>
    apiClient.get(PATHS.BY_SLUG(slug)).then((r) => r.data),

  enrollPath: (
    slug: string,
  ): Promise<{ success: boolean; enrolledAt: string }> =>
    apiClient.post(PATHS.ENROLL(slug)).then((r) => r.data),
};
