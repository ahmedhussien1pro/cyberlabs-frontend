import { useMutation } from '@tanstack/react-query';
import { useCourseProgressStore } from '../store/course-progress.store';
import { toast } from 'sonner';

interface EnrollParams {
  courseId: string;
}

async function mockEnroll(_p: EnrollParams): Promise<{ success: boolean }> {
  return new Promise((res) => setTimeout(() => res({ success: true }), 500));
}

export function useEnrollment() {
  const { enrollCourse } = useCourseProgressStore();

  return useMutation({
    mutationFn: mockEnroll,
    // Optimistic: update store immediately
    onMutate: ({ courseId }) => {
      enrollCourse(courseId);
    },
    onSuccess: (_d, { courseId }) => {
      enrollCourse(courseId); // idempotent — ensures store is in sync
      toast.success('Enrolled! Start learning now.', { duration: 2000 });
    },
    onError: () => {
      toast.error('Enrollment failed. Please try again.');
    },
  });
}
