import apiClient from '@/core/api/client';
import type {
  Course,
  CourseFilters,
  PaginatedCourses,
} from '../types/course.types';
import type { Topic } from '@/core/types/curriculumCourses.types';

const BASE = '/courses';

export const coursesApi = {
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
  // Called once on app load to hydrate Zustand store from server
  getMyProgress: (): Promise<{
    enrolled: string[];
    completed: Record<string, string[]>;
    favorites: string[];
  }> => apiClient.get(`${BASE}/me/progress`).then((r) => r.data),

  // PUT /api/v1/courses/me/favorites
  syncFavorite: (
    courseId: string,
    action: 'add' | 'remove',
  ): Promise<{ success: boolean }> =>
    apiClient
      .put(`${BASE}/me/favorites`, { courseId, action })
      .then((r) => r.data),
};
