import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/core/api/client';
import { useCourseProgressStore } from '../store/course-progress.store';
import type { CourseAccess } from '../types/course.types';

const BACKEND_READY = import.meta.env.VITE_COURSES_ENABLED === 'true';

export function useEnrollment() {
  const enrollCourse = useCourseProgressStore((s) => s.enrollCourse);
  const { t } = useTranslation('courses');

  return useMutation({
    mutationFn: async ({
      courseId,
      access,
    }: {
      courseId: string;
      access: CourseAccess;
    }) => {
      if (access !== 'free') throw new Error('PAYWALL');
      if (!BACKEND_READY) {
        await new Promise((r) => setTimeout(r, 500));
        enrollCourse(courseId);
        return;
      }
      await apiClient.post(`/courses/${courseId}/enroll`);
      enrollCourse(courseId);
    },
    onSuccess: () =>
      toast.success(t('enrollment.success', 'Enrolled! Start learning now 🚀')),
    onError: (err: Error) => {
      if (err.message !== 'PAYWALL')
        toast.error(t('enrollment.error', 'Enrollment failed. Try again.'));
    },
  });
}
