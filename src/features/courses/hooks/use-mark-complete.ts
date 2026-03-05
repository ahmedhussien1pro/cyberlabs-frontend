// src/features/courses/hooks/use-mark-complete.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../services/courses.api';
import { toast } from 'sonner';
import { PROGRESS_KEY, ENROLLMENTS_KEY } from './use-user-progress';

interface Params {
  courseId: string;
  lessonId: string;
}

export function useMarkLessonComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, lessonId }: Params) =>
      coursesApi.markTopicComplete(courseId, lessonId),

    onSuccess: (_data, { courseId }) => {
      void queryClient.invalidateQueries({ queryKey: PROGRESS_KEY });
      void queryClient.invalidateQueries({ queryKey: ENROLLMENTS_KEY });
      void queryClient.invalidateQueries({
        queryKey: ['courses', 'detail', courseId],
      });
      toast.success('Lesson complete!', { duration: 1500 });
    },

    onError: () => {
      toast.error('Could not mark lesson as complete. Try again.');
    },
  });
}
