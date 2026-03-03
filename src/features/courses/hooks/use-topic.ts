// src/features/courses/hooks/use-topic.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { useCourseProgressStore } from '../store/course-progress.store';
import { toast } from 'sonner';
import type { Topic } from '@/core/types/curriculumCourses.types';

// ── Types ─────────────────────────────────────────────────────────────
// Topic is already defined in curriculumCourses.types.ts:
//   { id: string; title: TranslatedText; elements: CourseElement[] }
// Re-export for convenience in lesson-page
export type { Topic };

export interface CourseContentData {
  courseId: string;
  topics: Topic[]; // ← CourseElement[] inside, TS-safe
  metadata: Record<string, any>;
}

// ── Query keys ────────────────────────────────────────────────────────
export const topicQueryKeys = {
  content: (slug: string) => ['courses', slug, 'content'] as const,
};

// ── Hooks ─────────────────────────────────────────────────────────────

/**
 * GET /courses/:slug/content
 * Returns all topics (with CourseElement[] elements) from the JSON file.
 * Cached for 1 hour — JSON content rarely changes.
 */
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

/**
 * Alias used by lesson-page to keep API surface compatible.
 * Returns full content; lesson-page picks the correct topic by index.
 */
export function useTopic(courseSlug: string, _sectionId: string) {
  return useCourseContent(courseSlug);
}

/**
 * POST /courses/:courseId/topics/:sectionId/complete
 * Marks all lessons in the section as complete on the backend.
 * Also does an optimistic update to the local Zustand store.
 */
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

    onSuccess: (_data, { courseId }) => {
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
