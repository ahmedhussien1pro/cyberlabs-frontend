import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../services/courses.api';
import { useCourseProgressStore } from '../store/course-progress.store';
import { toast } from 'sonner';
import type { Enrollment } from '../types/course.types';

// GET /enrollments/me  — used on Dashboard
export function useMyEnrollments() {
  return useQuery<Enrollment[]>({
    queryKey: ['enrollments', 'me'],
    queryFn: () => coursesApi.getMyEnrollments(),
    staleTime: 1000 * 60 * 5,
  });
}

// POST /courses/:courseId/enroll
export function useEnrollment() {
  const queryClient = useQueryClient();
  const { enrollCourse } = useCourseProgressStore();

  return useMutation({
    mutationFn: (courseId: string) => coursesApi.enroll(courseId),
    onMutate: (courseId) => {
      enrollCourse(courseId);
    },
    onSuccess: (_data, courseId) => {
      enrollCourse(courseId);
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'me'] });
      toast.success('Enrolled! Start learning now.', { duration: 2000 });
    },
    onError: () => {
      toast.error('Enrollment failed. Please try again.');
    },
  });
}
