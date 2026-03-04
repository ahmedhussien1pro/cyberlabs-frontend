import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useEnrollMutation,
  ENROLLMENTS_KEY,
  PROGRESS_KEY,
} from './use-user-progress';

export function useEnrollment() {
  const qc = useQueryClient();
  const mutation = useEnrollMutation();

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY });
    void qc.invalidateQueries({ queryKey: PROGRESS_KEY });
  };

  return {
    ...mutation,
    isPending: mutation.isPending,

    mutate: (courseId: string) => {
      mutation.mutate(courseId, {
        onSuccess: () => {
          invalidate();
          toast.success('Enrolled! Start learning now.', { duration: 2000 });
        },
        onError: () => toast.error('Enrollment failed. Please try again.'),
      });
    },

    mutateAsync: async (courseId: string) => {
      const result = await mutation.mutateAsync(courseId);
      invalidate();
      toast.success('Enrolled! Start learning now.', { duration: 2000 });
      return result;
    },
  };
}
