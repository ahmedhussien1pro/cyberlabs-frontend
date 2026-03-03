// src/features/courses/components/course-card.tsx
// Wrapper: adds store (favorites/enrollment) + CourseInfoDialog on top of SharedCourseCard
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SharedCourseCard } from '@/shared/components/shared-course-card';
import { CourseInfoDialog } from './course-info-dialog';
import { useCourseProgressStore } from '../store/course-progress.store';
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
  const { toggleFavorite, isFavorite, isEnrolled } = useCourseProgressStore();
  const fav = isFavorite(course.id);
  const enrolled = isEnrolled(course.id);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(course.id);
    toast(
      fav
        ? t('card.removedFav', 'Removed from favorites')
        : t('card.addedFav', 'Added to favorites'),
      { duration: 1500 },
    );
  };

  return (
    <>
      <SharedCourseCard
        course={course}
        variant={view === 'list' ? 'mini' : 'full'}
        index={index}
        enrolled={enrolled}
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
