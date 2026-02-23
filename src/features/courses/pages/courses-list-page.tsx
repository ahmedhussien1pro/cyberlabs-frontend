import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';
import { CourseCard } from '../components/course-card';
import { CourseCardSkeleton } from '../components/course-card-skeleton';
import { CourseFilters } from '../components/course-filters';
import { useCourses } from '../hooks/use-courses';
import type { CourseFilters as IFilters } from '../types/course.types';

const EMPTY_FILTERS: IFilters = {};

export default function CoursesListPage() {
  const { t } = useTranslation('courses');
  const [filters, setFilters] = useState<IFilters>(EMPTY_FILTERS);
  const { data, isLoading, isError } = useCourses(filters);

  return (
    <div className='container mx-auto px-4 py-10'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-1 flex items-center gap-2 text-sm font-semibold text-primary'>
          <BookOpen className='h-4 w-4' />
          {t('allCourses.eyebrow', 'All Courses')}
        </div>
        <h1 className='text-3xl font-black tracking-tight'>
          {t('allCourses.title', 'Browse Our Courses')}
        </h1>
        <p className='mt-1 text-muted-foreground'>
          {t('allCourses.subtitle', 'Find your next cybersecurity skill.')}
        </p>
      </div>

      {/* Filters */}
      <div className='mb-6'>
        <CourseFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      {/* Results count */}
      {!isLoading && data && (
        <p className='mb-4 text-sm text-muted-foreground'>
          {t('allCourses.results', { count: data.meta.total })}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className='rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-muted-foreground'>
          {t('allCourses.error', 'Failed to load courses. Please try again.')}
        </div>
      ) : data?.data.length === 0 ? (
        <div className='rounded-xl border border-dashed border-border/50 p-12 text-center'>
          <BookOpen className='mx-auto mb-3 h-10 w-10 text-muted-foreground/30' />
          <p className='text-sm text-muted-foreground'>
            {t('allCourses.empty', 'No courses match your filters.')}
          </p>
        </div>
      ) : (
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {data?.data.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
