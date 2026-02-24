import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { getTopicById } from '../data/mock-topics';
import { useCourseProgressStore } from '../store/course-progress.store';
import type { Topic } from '@/core/types/curriculumCourses.types';

const BACKEND_READY = import.meta.env.VITE_COURSES_ENABLED === 'true';

export const topicQueryKeys = {
  detail: (slug: string, topicId: string) =>
    ['courses', slug, 'topics', topicId] as const,
};

export function useTopic(courseSlug: string, topicId: string) {
  return useQuery({
    queryKey: topicQueryKeys.detail(courseSlug, topicId),
    queryFn: async (): Promise<Topic | null> => {
      if (!BACKEND_READY) {
        await new Promise((r) => setTimeout(r, 250));
        return getTopicById(courseSlug, topicId);
      }
      const res = await apiClient.get(
        `/courses/${courseSlug}/topics/${topicId}`,
      );
      return res.data;
    },
    enabled: !!courseSlug && !!topicId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useMarkTopicComplete() {
  const markComplete = useCourseProgressStore((s) => s.markTopicComplete);

  return useMutation({
    mutationFn: async ({
      courseId,
      topicId,
    }: {
      courseId: string;
      topicId: string;
    }) => {
      if (!BACKEND_READY) {
        markComplete(courseId, topicId);
        return;
      }
      await apiClient.post(`/courses/${courseId}/topics/${topicId}/complete`);
      markComplete(courseId, topicId);
    },
  });
}
