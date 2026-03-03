// src/features/courses/hooks/use-sync-progress.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi, type MyProgressResponse } from '../services/courses.api';
import { useCourseProgressStore } from '../store/course-progress.store';

/**
 * Syncs backend progress into the local Zustand store.
 * Call once in the authenticated layout — runs after login.
 *
 * Syncs:
 *  - enrolledCourses   ← enrollment.courseId[]
 *  - completedTopics   ← { courseId: sectionId[] }
 *  - favoriteCourses   ← courseFavorite.courseId[]
 */
export function useSyncProgress() {
  const store = useCourseProgressStore();

  const { data, isSuccess } = useQuery<MyProgressResponse>({
    queryKey: ['courses', 'me', 'progress'],
    queryFn: coursesApi.getMyProgress,
    staleTime: 1000 * 60 * 5, // re-fetch after 5 min
    retry: false, // don't retry on 401
  });

  useEffect(() => {
    if (!isSuccess || !data) return;

    // 1. Sync enrollments
    data.enrolled.forEach((courseId) => store.enrollCourse(courseId));

    // 2. Sync completed sections (backend: { courseId: sectionId[] })
    Object.entries(data.completed).forEach(([courseId, sectionIds]) => {
      sectionIds.forEach((sectionId) =>
        store.markTopicComplete(courseId, sectionId),
      );
    });

    // 3. Sync favorites (only toggle if not already marked)
    data.favorites.forEach((courseId) => {
      if (!store.isFavorite(courseId)) store.toggleFavorite(courseId);
    });
  }, [isSuccess, data]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isSynced: isSuccess };
}
