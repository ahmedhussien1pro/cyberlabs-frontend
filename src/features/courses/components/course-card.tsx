import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SharedCourseCard } from '@/shared/components/shared-course-card';
import { CourseInfoDialog } from './course-info-dialog';
import {
  useUserProgress,
  useFavoriteMutation,
} from '../hooks/use-user-progress';
import type { Course } from '../types/course.types';

interface CourseCardProps {
  course: Course;
  view?: 'grid' | 'list';
  index?: number;
}

export function CourseCard({
  course,
  view = 'grid',
  index = 0,
}: CourseCardProps) {
  const { t } = useTranslation('courses');
  const [infoOpen, setInfoOpen] = useState(false);

  const { isEnrolled, isCourseCompleted, isFavorite } = useUserProgress();

  const favMutation = useFavoriteMutation();

  const enrolled = isEnrolled(course.id);
  const isCompleted = isCourseCompleted(course.id, course.totalTopics);
  const fav = isFavorite(course.id);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favMutation.mutate(
      { courseId: course.id, isFav: fav },
      {
        onSuccess: () =>
          toast(
            fav
              ? t('card.removedFav', 'Removed from favorites')
              : t('card.addedFav', 'Added to favorites'),
            { duration: 1500 },
          ),
        onError: () => toast.error('Failed to update favorites'),
      },
    );
  };

  return (
    <>
      <SharedCourseCard
        course={course}
        variant={view === 'list' ? 'mini' : 'full'}
        index={index}
        enrolled={enrolled}
        isCompleted={isCompleted}
        onReset={undefined}
        isFavorite={fav}
        onFavoriteToggle={handleFav}
        onInfoClick={() => setInfoOpen(true)}
      />
      <CourseInfoDialog
        course={course}
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
      />
    </>
  );
}
