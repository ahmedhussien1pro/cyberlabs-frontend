import apiClient from '@/core/api/client';
import type {
  Course,
  CourseFilters,
  PaginatedCourses,
  PathDetail,
  PathsListResponse,
} from '../types/course.types';
import type { Topic } from '@/core/types/curriculumCourses.types';

const BASE = '/courses';
const PATHS_BASE = '/paths';

export const coursesApi = {
  // ─── Courses ─────────────────────────────────────────────────────────────

  // GET /api/v1/courses?search=&difficulty=&access=&page=&limit=
  list: (filters: CourseFilters = {}): Promise<PaginatedCourses> =>
    apiClient.get(BASE, { params: filters }).then((r) => r.data),

  // GET /api/v1/courses/:slug
  get: (slug: string): Promise<Course> =>
    apiClient.get(`${BASE}/${slug}`).then((r) => r.data),

  // GET /api/v1/courses/:slug/topics
  getTopics: (slug: string): Promise<Topic[]> =>
    apiClient.get(`${BASE}/${slug}/topics`).then((r) => r.data),

  // GET /api/v1/courses/:slug/topics/:topicId
  getTopic: (slug: string, topicId: string): Promise<Topic> =>
    apiClient.get(`${BASE}/${slug}/topics/${topicId}`).then((r) => r.data),

  // GET /api/v1/courses/:slug/content  — rich JSON content (topics/elements)
  getContent: (
    slug: string,
  ): Promise<{ topics: Topic[]; metadata: Record<string, unknown> }> =>
    apiClient.get(`${BASE}/${slug}/content`).then((r) => r.data),

  // POST /api/v1/courses/:courseId/enroll   [auth required]
  enroll: (
    courseId: string,
  ): Promise<{ success: boolean; enrolledAt: string }> =>
    apiClient.post(`${BASE}/${courseId}/enroll`).then((r) => r.data),

  // POST /api/v1/courses/:courseId/topics/:topicId/complete   [auth required]
  markComplete: (
    courseId: string,
    topicId: string,
  ): Promise<{ success: boolean; completedAt: string }> =>
    apiClient
      .post(`${BASE}/${courseId}/topics/${topicId}/complete`)
      .then((r) => r.data),

  // GET /api/v1/courses/me/progress   [auth required]
  getMyProgress: (): Promise<{
    enrolled: string[];
    completed: Record<string, string[]>;
    favorites: string[];
  }> => apiClient.get(`${BASE}/me/progress`).then((r) => r.data),

  // PUT /api/v1/courses/me/favorites   [auth required]
  syncFavorite: (
    courseId: string,
    action: 'add' | 'remove',
  ): Promise<{ success: boolean }> =>
    apiClient
      .put(`${BASE}/me/favorites`, { courseId, action })
      .then((r) => r.data),

  // ─── Learning Paths ───────────────────────────────────────────────────────

  // GET /api/v1/paths?page=&limit=&difficulty=&search=
  listPaths: (filters?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    search?: string;
  }): Promise<PathsListResponse> =>
    apiClient.get(PATHS_BASE, { params: filters }).then((r) => r.data),

  // GET /api/v1/paths/:slug
  getPath: (slug: string): Promise<PathDetail> =>
    apiClient.get(`${PATHS_BASE}/${slug}`).then((r) => r.data),

  // GET /api/v1/paths/:slug/enroll   [auth required]
  enrollPath: (
    slug: string,
  ): Promise<{ success: boolean; enrolledAt: string }> =>
    apiClient.get(`${PATHS_BASE}/${slug}/enroll`).then((r) => r.data),
};
