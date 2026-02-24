import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCourseProgressStore } from '../store/course-progress.store';
import { coursesApi } from '../services/courses.api';

export function useSyncProgress(isAuthenticated: boolean) {
  const { enrollCourse, markTopicComplete, toggleFavorite, isFavorite } =
    useCourseProgressStore();

  const { data } = useQuery({
    queryKey: ['courses', 'me', 'progress'],
    queryFn: coursesApi.getMyProgress,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;

    // Hydrate enrolled
    data.enrolled.forEach((id) => enrollCourse(id));

    // Hydrate completed topics
    Object.entries(data.completed).forEach(([courseId, topicIds]) => {
      topicIds.forEach((tid) => markTopicComplete(courseId, tid));
    });

    // Hydrate favorites
    data.favorites.forEach((id) => {
      if (!isFavorite(id)) toggleFavorite(id);
    });
  }, [data]);
}
