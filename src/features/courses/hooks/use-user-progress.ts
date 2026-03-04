import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi, type MyProgressResponse } from '../services/courses.api';
import type { Enrollment } from '../types/course.types';

export const PROGRESS_KEY = ['courses', 'me', 'progress'] as const;
export const ENROLLMENTS_KEY = ['enrollments', 'me'] as const;

export function useUserProgress() {
  const enrollmentsQ = useQuery<Enrollment[]>({
    queryKey: ENROLLMENTS_KEY,
    queryFn: () => coursesApi.getMyEnrollments(),
    staleTime: 1000 * 60 * 3,
    retry: false,
  });

  const progressQ = useQuery<MyProgressResponse>({
    queryKey: PROGRESS_KEY,
    queryFn: () => coursesApi.getMyProgress(),
    staleTime: 1000 * 60 * 3,
    retry: false,
  });

  const enrollments = enrollmentsQ.data ?? [];
  const completed = progressQ.data?.completed ?? {};
  const favorites = progressQ.data?.favorites ?? [];
  const enrollMap = new Map(enrollments.map((e) => [e.courseId, e]));

  return {
    isLoading: enrollmentsQ.isLoading || progressQ.isLoading,
    isError: enrollmentsQ.isError || progressQ.isError,

    // Enrollment
    isEnrolled: (courseId: string) => enrollMap.has(courseId),
    isCompleted: (courseId: string) =>
      enrollMap.get(courseId)?.isCompleted ?? false,
    getProgress: (courseId: string) => enrollMap.get(courseId)?.progress ?? 0,

    // Topics
    isTopicCompleted: (courseId: string, topicId: string) =>
      (completed[courseId] ?? []).includes(topicId),
    getCompletedCount: (courseId: string) => completed[courseId]?.length ?? 0,
    isCourseCompleted: (courseId: string, total: number) =>
      total > 0 && (completed[courseId]?.length ?? 0) >= total,

    // Favorites
    isFavorite: (courseId: string) => favorites.includes(courseId),

    enrollments,
    favorites,
    completed,
  };
}

export function useEnrollMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => coursesApi.enroll(courseId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY });
      void qc.invalidateQueries({ queryKey: PROGRESS_KEY });
    },
  });
}

export function useFavoriteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, isFav }: { courseId: string; isFav: boolean }) =>
      coursesApi.syncFavorite(courseId, isFav ? 'remove' : 'add'),
    onSuccess: () => void qc.invalidateQueries({ queryKey: PROGRESS_KEY }),
  });
}
