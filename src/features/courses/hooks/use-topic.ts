// src/features/courses/hooks/use-topic.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { useCourseProgressStore } from '../store/course-progress.store';
import { toast } from 'sonner';
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
  const queryClient = useQueryClient();
  const { markTopicComplete } = useCourseProgressStore();

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

    onMutate: ({ courseId, topicId }) => {
      markTopicComplete(courseId, topicId);
    },

    // ✅ Fix: حذف { courseId } غير المستخدم
    onSuccess: (_data, _vars) => {
      queryClient.invalidateQueries({
        queryKey: ['courses', 'me', 'progress'],
      });
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'activity'] });
    },

    onError: () => {
      toast.error('تعذر حفظ التقدم، حاول مجدداً.');
    },
  });
}
