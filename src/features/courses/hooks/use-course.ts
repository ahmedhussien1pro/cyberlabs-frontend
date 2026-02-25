import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { Course } from '../types/course.types';

const extractData = <T>(res: any): T => {
  return (res?.data !== undefined ? res.data : res) as T;
};

export const courseQueryKeys = {
  detail: (slug: string) => ['courses', 'detail', slug] as const,
};

export function useCourse(slug: string) {
  return useQuery({
    queryKey: courseQueryKeys.detail(slug),
    queryFn: async (): Promise<Course | null> => {
      return apiClient
        .get(API_ENDPOINTS.COURSES.BY_SLUG(slug))
        .then(extractData<Course>);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
