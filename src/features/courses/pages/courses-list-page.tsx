import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, List, SlidersHorizontal, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MainLayout from '@/shared/components/layout/main-layout';
import { MatrixRain } from '@/shared/components/common/landing/matrix-rain';
import { CourseCard } from '../components/course-card';
import { CourseCardSkeleton } from '../components/course-card-skeleton';
import { CourseFilterSidebar } from '../components/course-filters';
import { useCourses } from '../hooks/use-courses';
import { useCourseProgressStore } from '../store/course-progress.store';
import type { CourseFilters } from '../types/course.types';

type ViewMode = 'grid' | 'list';

export default function CoursesListPage() {
  const { t } = useTranslation('courses');
  const [filters, setFilters] = useState<CourseFilters>({});
  const [view, setView] = useState<ViewMode>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer

  const { favoriteCourses, enrolledCourses, completedTopics } =
    useCourseProgressStore();
  const { data, isLoading, isError } = useCourses(filters);

  // Client-side favorite / enrolled / completed filter
  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    let result = [...data.data];

    if (filters.onlyFavorites)
      result = result.filter((c) => favoriteCourses.includes(c.id));
    if (filters.onlyEnrolled)
      result = result.filter((c) => enrolledCourses.includes(c.id));
    if (filters.onlyCompleted)
      result = result.filter((c) => {
        const done = completedTopics[c.id]?.length ?? 0;
        return c.totalTopics > 0 && done >= c.totalTopics;
      });

    return result;
  }, [data, filters, favoriteCourses, enrolledCourses, completedTopics]);

  const handleReset = () => setFilters({});

  return (
    <MainLayout>
      <div className='min-h-screen bg-background'>
        {/* ── Hero ───────────────────────────────────────── */}
        <div className='relative overflow-hidden border-b border-border/50 bg-background/80'>
          <MatrixRain className='absolute inset-0 opacity-[0.07]' />
          <div className='relative z-10 container mx-auto px-4 py-14 text-center space-y-3'>
            <span className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold text-primary uppercase tracking-wider'>
              <Shield className='h-3.5 w-3.5' />
              {t('list.eyebrow', 'All Courses')}
            </span>
            <h1 className='text-4xl md:text-5xl font-black tracking-tight text-foreground'>
              {t('list.title', 'Master Cybersecurity')}
            </h1>
            <p className='text-muted-foreground text-lg max-w-xl mx-auto'>
              {t(
                'list.subtitle',
                'Theory-first courses packed with visuals, code, and hands-on labs.',
              )}
            </p>
          </div>
        </div>

        {/* ── Body: Sidebar + Grid ────────────────────────── */}
        <div className='container mx-auto px-4 py-8'>
          <div className='flex gap-7 relative'>
            {/* ── Sidebar — Desktop (always visible) ─────── */}
            <aside className='hidden lg:block w-60 shrink-0'>
              <div className='sticky top-20'>
                <CourseFilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onReset={handleReset}
                  totalCount={filteredData.length}
                />
              </div>
            </aside>

            {/* ── Mobile sidebar drawer ───────────────────── */}
            {sidebarOpen && (
              <div
                className='fixed inset-0 z-40 lg:hidden'
                onClick={() => setSidebarOpen(false)}>
                <div className='absolute inset-0 bg-background/80 backdrop-blur-sm' />
                <div
                  className='absolute start-0 top-0 bottom-0 w-72 bg-card border-e border-border/60 p-4 overflow-y-auto'
                  onClick={(e) => e.stopPropagation()}>
                  <div className='flex items-center justify-between mb-4'>
                    <p className='font-bold text-sm'>
                      {t('filters.title', 'Filters')}
                    </p>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className='text-muted-foreground hover:text-foreground'>
                      <X className='h-5 w-5' />
                    </button>
                  </div>
                  <CourseFilterSidebar
                    filters={filters}
                    onChange={(f) => {
                      setFilters(f);
                    }}
                    onReset={handleReset}
                  />
                </div>
              </div>
            )}

            {/* ── Main content ────────────────────────────── */}
            <div className='flex-1 min-w-0 space-y-5'>
              {/* Toolbar: mobile filter btn + view toggle + count */}
              <div className='flex items-center gap-3 flex-wrap'>
                {/* Mobile filter btn */}
                <Button
                  variant='outline'
                  size='sm'
                  className='lg:hidden gap-2'
                  onClick={() => setSidebarOpen(true)}>
                  <SlidersHorizontal className='h-4 w-4' />
                  {t('filters.title', 'Filters')}
                </Button>

                {/* Result count */}
                {!isLoading && (
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-bold text-foreground'>
                      {filteredData.length}
                    </span>
                    {' courses found'}
                  </p>
                )}

                {/* Spacer */}
                <div className='flex-1' />

                {/* View toggle */}
                <div className='flex rounded-lg border border-border/60 overflow-hidden'>
                  {(['grid', 'list'] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={cn(
                        'px-3 h-8 flex items-center justify-center transition-colors',
                        v === 'list' && 'border-s border-border/60',
                        view === v
                          ? 'bg-primary/15 text-primary'
                          : 'text-muted-foreground hover:bg-muted',
                      )}>
                      {v === 'grid' ? (
                        <LayoutGrid className='h-4 w-4' />
                      ) : (
                        <List className='h-4 w-4' />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {isError && (
                <div className='rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive'>
                  {t('list.error', 'Failed to load courses. Please try again.')}
                </div>
              )}

              {/* Grid / List */}
              <div
                className={cn(
                  'grid gap-5',
                  view === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1',
                )}>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <CourseCardSkeleton key={i} view={view} />
                    ))
                  : filteredData.map((course, i) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        view={view}
                        index={i}
                      />
                    ))}
              </div>

              {/* Empty state */}
              {!isLoading && filteredData.length === 0 && (
                <div className='flex flex-col items-center justify-center py-24 gap-4 text-center'>
                  <div className='h-14 w-14 rounded-2xl bg-muted flex items-center justify-center border border-border/40'>
                    <Shield className='h-7 w-7 text-muted-foreground' />
                  </div>
                  <p className='font-semibold text-foreground'>
                    {t('list.empty', 'No courses match your filters')}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {t('list.emptyHint', 'Try resetting the filters')}
                  </p>
                  <Button variant='outline' size='sm' onClick={handleReset}>
                    {t('filters.reset', 'Reset Filters')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
