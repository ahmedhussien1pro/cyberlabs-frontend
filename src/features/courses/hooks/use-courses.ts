import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { MOCK_COURSES_RESPONSE } from '../data/mock-courses';
import type { CourseFilters, PaginatedCourses } from '../types/course.types';

const BACKEND_READY = import.meta.env.VITE_COURSES_ENABLED === 'true';

export const coursesQueryKeys = {
  all: ['courses'] as const,
  list: (f: CourseFilters) => ['courses', 'list', f] as const,
  detail: (slug: string) => ['courses', 'detail', slug] as const,
};

export function useCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: coursesQueryKeys.list(filters),
    queryFn: async (): Promise<PaginatedCourses> => {
      if (!BACKEND_READY) {
        let data = [...MOCK_COURSES_RESPONSE.data];

        if (filters.search) {
          const q = filters.search.toLowerCase();
          data = data.filter(
            (c) =>
              c.title.toLowerCase().includes(q) ||
              c.ar_title.includes(q) ||
              c.tags.some((t) => t.includes(q)),
          );
        }
        if (filters.difficulty && filters.difficulty !== 'all')
          data = data.filter((c) => c.difficulty === filters.difficulty);
        if (filters.access && filters.access !== 'all')
          data = data.filter((c) => c.access === filters.access);
        if (filters.category)
          data = data.filter((c) => c.category === filters.category);

        return {
          data,
          meta: { total: data.length, page: 1, limit: 12, totalPages: 1 },
        };
      }

      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.difficulty && filters.difficulty !== 'all')
        params.set('difficulty', filters.difficulty);
      if (filters.access && filters.access !== 'all')
        params.set('access', filters.access);
      if (filters.category) params.set('category', filters.category);
      if (filters.page) params.set('page', String(filters.page));

      const res = await apiClient.get(
        `${API_ENDPOINTS.COURSES.BASE}?${params.toString()}`,
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
