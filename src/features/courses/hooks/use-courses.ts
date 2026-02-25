import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { CourseFilters, PaginatedCourses } from '../types/course.types';

const extractData = <T>(res: any): T => {
  return (res?.data !== undefined && res?.meta !== undefined ? res : res?.data !== undefined ? res.data : res) as T;
};

export const coursesQueryKeys = {
  all: ['courses'] as const,
  list: (f: CourseFilters) => ['courses', 'list', f] as const,
  detail: (slug: string) => ['courses', 'detail', slug] as const,
};

export function useCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: coursesQueryKeys.list(filters),
    queryFn: async (): Promise<PaginatedCourses> => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.difficulty && filters.difficulty !== 'all')
        params.set('difficulty', filters.difficulty);
      if (filters.access && filters.access !== 'all')
        params.set('access', filters.access);
      if (filters.category) params.set('category', filters.category);
      if (filters.page) params.set('page', String(filters.page));

      return apiClient.get(
        `${API_ENDPOINTS.COURSES.BASE}?${params.toString()}`,
      ).then(extractData<PaginatedCourses>);
    },
    staleTime: 1000 * 60 * 5,
  });
}
