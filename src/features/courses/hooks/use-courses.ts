import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../services/courses.api';
import type { CourseFilters, PaginatedCourses } from '../types/course.types';

export const coursesQueryKeys = {
  all: ['courses'] as const,
  list: (f: CourseFilters) => ['courses', 'list', f] as const,
  detail: (slug: string) => ['courses', 'detail', slug] as const,
};

export function useCourses(filters: CourseFilters = {}) {
  return useQuery<PaginatedCourses>({
    queryKey: coursesQueryKeys.list(filters),
    queryFn: () => coursesApi.list(filters),
    staleTime: 1000 * 60 * 5,
  });
}
