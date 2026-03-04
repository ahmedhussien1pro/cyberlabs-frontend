// src/features/courses/pages/courses-list-page.tsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Shield,
  SearchX,
  Heart,
  BookOpen,
  BookCheck,
  TrendingUp,
  Gauge,
  Flame,
  Unlock,
  Crown,
  Gem,
  Clock3,
  FlaskConical,
  BookMarked,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MainLayout from '@/shared/components/layout/main-layout';
import { PageHero } from '@/shared/components/common/page-hero';
import { Pagination } from '@/shared/components/common/pagination';
import { CourseCard } from '../components/course-card';
import { CourseCardSkeleton } from '../components/course-card-skeleton';
import { CourseFilterSidebar } from '../components/course-filters';
import { useCourses } from '../hooks/use-courses';
import { useCourseProgressStore } from '../store/course-progress.store';
import type { CourseFilters } from '../types/course.types';

type ViewMode = 'grid' | 'list';
const PAGE_SIZE = 9;

// ── Active filter chips ───────────────────────────────────────────────
interface ActiveFilterChip {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  onRemove: () => void;
}

function useActiveFilterChips(
  filters: CourseFilters,
  onChange: (f: CourseFilters) => void,
): ActiveFilterChip[] {
  const { t } = useTranslation('courses');
  const chips: ActiveFilterChip[] = [];

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `"${filters.search}"`,
      icon: SearchX,
      color: 'text-foreground',
      onRemove: () => onChange({ ...filters, search: '' }),
    });
  }
  if (filters.onlyFavorites) {
    chips.push({
      key: 'fav',
      label: t('filters.favorites', 'Favorites'),
      icon: Heart,
      color: 'text-rose-400',
      onRemove: () => onChange({ ...filters, onlyFavorites: false }),
    });
  }
  if (filters.onlyEnrolled) {
    chips.push({
      key: 'enrolled',
      label: t('filters.enrolled', 'Enrolled'),
      icon: BookOpen,
      color: 'text-blue-400',
      onRemove: () => onChange({ ...filters, onlyEnrolled: false }),
    });
  }
  if (filters.onlyCompleted) {
    chips.push({
      key: 'completed',
      label: t('filters.completed', 'Completed'),
      icon: BookCheck,
      color: 'text-emerald-400',
      onRemove: () => onChange({ ...filters, onlyCompleted: false }),
    });
  }

  const DIFF_MAP: Record<
    string,
    { label: string; icon: React.ElementType; color: string }
  > = {
    BEGINNER: {
      label: 'Beginner',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    INTERMEDIATE: {
      label: 'Intermediate',
      icon: Gauge,
      color: 'text-yellow-500',
    },
    ADVANCED: { label: 'Advanced', icon: Flame, color: 'text-red-500' },
  };
  if (filters.difficulty && DIFF_MAP[filters.difficulty]) {
    const d = DIFF_MAP[filters.difficulty];
    chips.push({
      key: 'diff',
      label: d.label,
      icon: d.icon,
      color: d.color,
      onRemove: () => onChange({ ...filters, difficulty: undefined }),
    });
  }

  const ACCESS_MAP: Record<
    string,
    { label: string; icon: React.ElementType; color: string }
  > = {
    FREE: { label: 'Free', icon: Unlock, color: 'text-emerald-500' },
    PRO: { label: 'Pro', icon: Crown, color: 'text-blue-500' },
    PREMIUM: { label: 'Premium', icon: Gem, color: 'text-violet-500' },
  };
  if (filters.access && ACCESS_MAP[filters.access]) {
    const a = ACCESS_MAP[filters.access];
    chips.push({
      key: 'access',
      label: a.label,
      icon: a.icon,
      color: a.color,
      onRemove: () => onChange({ ...filters, access: undefined }),
    });
  }

  const CT_MAP: Record<string, { label: string; icon: React.ElementType }> = {
    PRACTICAL: {
      label: t('filters.practical', 'Practical'),
      icon: FlaskConical,
    },
    THEORETICAL: {
      label: t('filters.theoretical', 'Theoretical'),
      icon: BookMarked,
    },
    MIXED: { label: t('filters.mixed', 'Mixed'), icon: BookOpen },
  };
  if (filters.contentType && CT_MAP[filters.contentType]) {
    const ct = CT_MAP[filters.contentType];
    chips.push({
      key: 'ct',
      label: ct.label,
      icon: ct.icon,
      color: 'text-muted-foreground',
      onRemove: () => onChange({ ...filters, contentType: undefined }),
    });
  }

  if (filters.state === 'COMING_SOON') {
    chips.push({
      key: 'state',
      label: t('filters.comingSoon', 'Coming Soon'),
      icon: Clock3,
      color: 'text-zinc-400',
      onRemove: () => onChange({ ...filters, state: undefined }),
    });
  }

  return chips;
}

// ─────────────────────────────────────────────────────────────────────
export default function CoursesListPage() {
  const { t } = useTranslation('courses');
  const [filters, setFilters] = useState<CourseFilters>({});
  const [view, setView] = useState<ViewMode>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { completedTopics } = useCourseProgressStore();
  const { data, isLoading, isError } = useCourses(filters);

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    let result = [...data.data];

    // ── search: client-side fallback (backend بيعملها كمان) ──────────
    if (filters.search?.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.ar_title ?? '').toLowerCase().includes(q) ||
          (c.description ?? '').toLowerCase().includes(q),
      );
    }

    // ── onlyCompleted: client-side فقط (من الـ local store) ──────────
    // onlyFavorites + onlyEnrolled → server-side via JWT (backend يتولاهم)
    if (filters.onlyCompleted) {
      result = result.filter((c) => {
        const done = completedTopics[c.id]?.length ?? 0;
        return c.totalTopics > 0 && done >= c.totalTopics;
      });
    }

    return result;
  }, [data, filters.search, filters.onlyCompleted, completedTopics]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const displayedData = filteredData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleFiltersChange = (f: CourseFilters) => {
    setFilters(f);
    setPage(1);
  };
  const handleReset = () => {
    setFilters({});
    setPage(1);
  };

  const activeChips = useActiveFilterChips(filters, handleFiltersChange);

  return (
    <MainLayout>
      <div className='min-h-screen bg-background'>
        <PageHero
          title={t('list.title', 'Master Cybersecurity')}
          subtitle={t('list.subtitle', 'Theory-first courses')}
          description={t(
            'list.description',
            'Packed with visuals, code, and hands-on labs.',
          )}
          showSearch={false}
        />

        <div className='container mx-auto px-4 py-8'>
          <div className='flex gap-7 relative'>
            {/* ── Sidebar Desktop ── */}
            <aside className='hidden lg:block w-60 shrink-0'>
              <div className='sticky top-20'>
                <CourseFilterSidebar
                  filters={filters}
                  onChange={handleFiltersChange}
                  onReset={handleReset}
                  totalCount={filteredData.length}
                />
              </div>
            </aside>

            {/* ── Mobile Drawer ── */}
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
                    onChange={handleFiltersChange}
                    onReset={handleReset}
                  />
                </div>
              </div>
            )}

            {/* ── Main Content ── */}
            <div className='flex-1 min-w-0 space-y-5'>
              {/* Toolbar */}
              <div className='flex items-center gap-3 flex-wrap'>
                <Button
                  variant='outline'
                  size='sm'
                  className='lg:hidden gap-2'
                  onClick={() => setSidebarOpen(true)}>
                  <SlidersHorizontal className='h-4 w-4' />
                  {t('filters.title', 'Filters')}
                </Button>

                {!isLoading && (
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-bold text-foreground'>
                      {filteredData.length}
                    </span>
                    {' courses found'}
                  </p>
                )}

                {/* Active chips */}
                {activeChips.length > 0 && (
                  <div className='flex flex-wrap items-center gap-1.5'>
                    {activeChips.map((chip) => (
                      <span
                        key={chip.key}
                        className='inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium'>
                        <chip.icon className={cn('h-3 w-3', chip.color)} />
                        {chip.label}
                        <button
                          onClick={chip.onRemove}
                          className='ms-0.5 text-muted-foreground hover:text-foreground transition-colors'>
                          <X className='h-3 w-3' />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className='flex-1' />

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
                  : displayedData.map((course, i) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        view={view}
                        index={i}
                      />
                    ))}
              </div>

              {/* Empty State */}
              {!isLoading && filteredData.length === 0 && (
                <div className='flex flex-col items-center justify-center min-h-[480px] gap-5 text-center py-16 rounded-2xl border border-dashed border-border/50 bg-muted/10'>
                  <div className='h-16 w-16 rounded-2xl bg-muted flex items-center justify-center border border-border/40'>
                    <Shield className='h-8 w-8 text-muted-foreground/50' />
                  </div>
                  <div className='space-y-1.5'>
                    <p className='font-bold text-base text-foreground'>
                      {t('list.empty', 'No courses found')}
                    </p>
                    <p className='text-sm text-muted-foreground max-w-xs'>
                      {activeChips.length > 0
                        ? t(
                            'list.emptyWithFilters',
                            'No courses match the selected filters',
                          )
                        : t(
                            'list.emptyHint',
                            'Try adjusting or resetting the filters',
                          )}
                    </p>
                  </div>
                  {activeChips.length > 0 && (
                    <div className='flex flex-wrap justify-center gap-2 max-w-sm'>
                      {activeChips.map((chip) => (
                        <span
                          key={chip.key}
                          className='inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium'>
                          <chip.icon
                            className={cn('h-3.5 w-3.5', chip.color)}
                          />
                          {chip.label}
                          <button
                            onClick={chip.onRemove}
                            className='ms-0.5 text-muted-foreground hover:text-destructive transition-colors'>
                            <X className='h-3 w-3' />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {activeChips.length > 0 && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleReset}
                      className='gap-1.5'>
                      <X className='h-3.5 w-3.5' />
                      {t('filters.resetAll', 'Clear all filters')}
                    </Button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className='py-6'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
