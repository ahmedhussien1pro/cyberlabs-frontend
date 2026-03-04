import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { toast } from 'sonner';
import { PROGRESS_KEY, ENROLLMENTS_KEY } from './use-user-progress';
import type { Topic } from '@/core/types/curriculumCourses.types';

export type { Topic };

export interface CourseContentData {
  courseId: string;
  topics: Topic[];
  metadata: Record<string, any>;
}

export const topicQueryKeys = {
  content: (slug: string) => ['courses', slug, 'content'] as const,
};

export function useCourseContent(courseSlug: string) {
  return useQuery<CourseContentData>({
    queryKey: topicQueryKeys.content(courseSlug),
    queryFn: async () => {
      const res = await apiClient.get(`/courses/${courseSlug}/content`);
      const raw = res.data?.data ?? res.data;
      return {
        courseId: raw.courseId ?? '',
        topics: Array.isArray(raw.topics) ? (raw.topics as Topic[]) : [],
        metadata: raw.metadata ?? {},
      };
    },
    enabled: !!courseSlug,
    staleTime: 1000 * 60 * 60,
  });
}

export function useTopic(courseSlug: string, _sectionId: string) {
  return useCourseContent(courseSlug);
}

export function useMarkTopicComplete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      topicId,
    }: {
      courseId: string;
      topicId: string;
    }) =>
      apiClient
        .post(`/courses/${courseId}/topics/${topicId}/complete`)
        .then((r) => r.data),

    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PROGRESS_KEY });
      void qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY });
      void qc.invalidateQueries({ queryKey: ['user', 'activity'] });
    },

    onError: () => toast.error('تعذر حفظ التقدم، حاول مجدداً.'),
  });
}
