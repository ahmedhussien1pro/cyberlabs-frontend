import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import type { CourseLesson } from '../types/course.types';

const extractData = <T>(res: any): T =>
  (res?.data !== undefined ? res.data : res) as T;

export const lessonQueryKeys = {
  detail: (slug: string, lessonId: string) =>
    ['courses', slug, 'lessons', lessonId] as const,
};

// GET /courses/:slug/lessons/:lessonId
export function useLesson(courseSlug: string, lessonId: string) {
  return useQuery<CourseLesson | null>({
    queryKey: lessonQueryKeys.detail(courseSlug, lessonId),
    queryFn: async () =>
      apiClient
        .get(`/courses/${courseSlug}/lessons/${lessonId}`)
        .then(extractData<CourseLesson>),
    enabled: !!courseSlug && !!lessonId,
    staleTime: 1000 * 60 * 30,
  });
}
