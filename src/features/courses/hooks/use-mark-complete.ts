import { useMutation } from '@tanstack/react-query';
import { useCourseProgressStore } from '../store/course-progress.store';
import { toast } from 'sonner';

interface Params {
  courseId: string;
  topicId: string;
}

async function mockMark(_p: Params): Promise<{ success: boolean }> {
  return new Promise((res) => setTimeout(() => res({ success: true }), 300));
}

export function useMarkTopicComplete() {
  const { markTopicComplete } = useCourseProgressStore();

  return useMutation({
    mutationFn: mockMark,
    onMutate: ({ courseId, topicId }) => {
      markTopicComplete(courseId, topicId);
    },
    onSuccess: (_d, { courseId, topicId }) => {
      markTopicComplete(courseId, topicId);
      toast.success('Topic complete!', { duration: 1500 });
    },
  });
}
