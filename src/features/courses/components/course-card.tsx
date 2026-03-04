// src/features/courses/components/course-card.tsx
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

  const {
    toggleFavorite,
    isFavorite,
    isEnrolled,
    completedTopics,
    resetProgress,
  } = useCourseProgressStore();

  const fav = isFavorite(course.id);
  const enrolled = isEnrolled(course.id);

  // ── isCompleted: عدد الـ topics المكتملة >= إجمالي الـ topics ──
  const doneCnt = completedTopics[course.id]?.length ?? 0;
  const isCompleted =
    enrolled && course.totalTopics > 0 && doneCnt >= course.totalTopics;

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

  const handleReset = () => resetProgress(course.id);

  return (
    <>
      <SharedCourseCard
        course={course}
        variant={view === 'list' ? 'mini' : 'full'}
        index={index}
        enrolled={enrolled}
        isCompleted={isCompleted} // ← جديد
        onReset={handleReset} // ← جديد
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
