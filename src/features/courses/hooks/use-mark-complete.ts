import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../services/courses.api';
import { useCourseProgressStore } from '../store/course-progress.store';
import { toast } from 'sonner';

interface Params {
  courseId: string;
  lessonId: string;
}

export function useMarkLessonComplete() {
  const queryClient = useQueryClient();
  const { markTopicComplete } = useCourseProgressStore();

  return useMutation({
    mutationFn: ({ courseId, lessonId }: Params) =>
      coursesApi.markTopicComplete(courseId, lessonId),

    onMutate: ({ courseId, lessonId }) => {
      markTopicComplete(courseId, lessonId);
    },

    onSuccess: (_data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'me'] });
      queryClient.invalidateQueries({
        queryKey: ['courses', 'detail', courseId],
      });
      toast.success('Lesson complete!', { duration: 1500 });
    },

    onError: () => {
      toast.error('Could not mark lesson as complete. Try again.');
    },
  });
}
