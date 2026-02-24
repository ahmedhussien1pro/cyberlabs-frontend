import { useTranslation } from 'react-i18next';
import {
  Search,
  X,
  Heart,
  BookOpen,
  CheckCircle2,
  Clock3,
  FlaskConical,
  BookMarked,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCourseProgressStore } from '../store/course-progress.store';
import type {
  CourseFilters,
  CourseDifficulty,
  CourseAccess,
} from '../types/course.types';

interface CourseFilterSidebarProps {
  filters: CourseFilters;
  onChange: (f: CourseFilters) => void;
  onReset: () => void;
  totalCount?: number;
}

// ── Section wrapper ───────────────────────────────────────────────────
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-2'>
      <p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 px-1'>
        {title}
      </p>
      {children}
    </div>
  );
}

// ── Generic chip toggle ───────────────────────────────────────────────
function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all text-start',
        active
          ? 'bg-primary/15 text-primary border border-primary/30 font-semibold'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent',
        className,
      )}>
      {children}
    </button>
  );
}

export function CourseFilterSidebar({
  filters,
  onChange,
  onReset,
  totalCount,
}: CourseFilterSidebarProps) {
  const { t } = useTranslation('courses');
  const { favoriteCourses, enrolledCourses } = useCourseProgressStore();

  const set = (patch: Partial<CourseFilters>) =>
    onChange({ ...filters, ...patch });

  // Count active filters (for reset badge)
  const activeCount = [
    filters.difficulty && filters.difficulty !== 'all',
    filters.access && filters.access !== 'all',
    filters.contentType && filters.contentType !== 'all',
    filters.category && filters.category !== 'all',
    filters.status && filters.status !== 'all',
    filters.onlyFavorites,
    filters.onlyEnrolled,
    filters.onlyCompleted,
  ].filter(Boolean).length;

  return (
    <aside className='w-full space-y-5'>
      {/* ── Search ─────────────────────────────────────── */}
      <div className='relative'>
        <Search className='absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
        <input
          type='text'
          value={filters.search ?? ''}
          onChange={(e) => set({ search: e.target.value })}
          placeholder={t('filters.search', 'Search courses...')}
          className={cn(
            'w-full rounded-lg border border-border/60 bg-muted/40',
            'ps-9 pe-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50',
            'transition-all',
          )}
        />
        {filters.search && (
          <button
            onClick={() => set({ search: '' })}
            className='absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'>
            <X className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      {/* ── Reset bar ──────────────────────────────────── */}
      {activeCount > 0 && (
        <div className='flex items-center justify-between'>
          <span className='text-xs text-muted-foreground'>
            {activeCount} {t('filters.active', 'filter(s) active')}
          </span>
          <Button
            variant='ghost'
            size='sm'
            className='h-7 text-xs gap-1 text-muted-foreground'
            onClick={onReset}>
            <RotateCcw className='h-3 w-3' />
            {t('filters.reset', 'Reset')}
          </Button>
        </div>
      )}

      {/* ── My Library ─────────────────────────────────── */}
      <FilterSection title={t('filters.myLibrary', 'My Library')}>
        <Chip
          active={!!filters.onlyFavorites}
          onClick={() => set({ onlyFavorites: !filters.onlyFavorites })}>
          <Heart
            className={cn(
              'h-4 w-4 shrink-0',
              filters.onlyFavorites
                ? 'fill-current text-rose-500'
                : 'text-rose-400',
            )}
          />
          <span className='flex-1'>{t('filters.favorites', 'Favorites')}</span>
          {favoriteCourses.length > 0 && (
            <Badge variant='secondary' className='text-[10px] h-4 px-1.5'>
              {favoriteCourses.length}
            </Badge>
          )}
        </Chip>

        <Chip
          active={!!filters.onlyEnrolled}
          onClick={() => set({ onlyEnrolled: !filters.onlyEnrolled })}>
          <BookOpen className='h-4 w-4 shrink-0 text-blue-400' />
          <span className='flex-1'>{t('filters.enrolled', 'Enrolled')}</span>
          {enrolledCourses.length > 0 && (
            <Badge variant='secondary' className='text-[10px] h-4 px-1.5'>
              {enrolledCourses.length}
            </Badge>
          )}
        </Chip>

        <Chip
          active={!!filters.onlyCompleted}
          onClick={() => set({ onlyCompleted: !filters.onlyCompleted })}>
          <CheckCircle2 className='h-4 w-4 shrink-0 text-emerald-400' />
          {t('filters.completed', 'Completed')}
        </Chip>
      </FilterSection>

      {/* ── Level ──────────────────────────────────────── */}
      <FilterSection title={t('filters.level', 'Level')}>
        {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((d) => (
          <Chip
            key={d}
            active={
              (!filters.difficulty && d === 'all') || filters.difficulty === d
            }
            onClick={() =>
              set({ difficulty: d === 'all' ? 'all' : (d as CourseDifficulty) })
            }>
            <span className='text-base leading-none'>
              {d === 'all'
                ? '🌐'
                : d === 'Beginner'
                  ? '🟢'
                  : d === 'Intermediate'
                    ? '🟡'
                    : '🔴'}
            </span>
            <span>
              {d === 'all' ? t('filters.allLevels', 'All Levels') : d}
            </span>
          </Chip>
        ))}
      </FilterSection>

      {/* ── Access ─────────────────────────────────────── */}
      <FilterSection title={t('filters.access', 'Access')}>
        {(['all', 'free', 'pro', 'premium'] as const).map((a) => (
          <Chip
            key={a}
            active={(!filters.access && a === 'all') || filters.access === a}
            onClick={() => set({ access: a as CourseAccess | 'all' })}>
            <span className='text-base leading-none'>
              {a === 'all'
                ? '🌐'
                : a === 'free'
                  ? '🎁'
                  : a === 'pro'
                    ? '👑'
                    : '💎'}
            </span>
            <span className='capitalize'>
              {a === 'all' ? t('filters.allAccess', 'All Access') : a}
            </span>
          </Chip>
        ))}
      </FilterSection>

      {/* ── Content type ───────────────────────────────── */}
      <FilterSection title={t('filters.contentType', 'Type')}>
        {[
          {
            v: 'all',
            icon: <BookOpen className='h-4 w-4' />,
            label: t('filters.all', 'All Types'),
          },
          {
            v: 'practical',
            icon: <FlaskConical className='h-4 w-4' />,
            label: t('filters.practical', 'Practical'),
          },
          {
            v: 'theoretical',
            icon: <BookMarked className='h-4 w-4' />,
            label: t('filters.theoretical', 'Theoretical'),
          },
          {
            v: 'mixed',
            icon: <BookOpen className='h-4 w-4' />,
            label: t('filters.mixed', 'Mixed'),
          },
        ].map(({ v, icon, label }) => (
          <Chip
            key={v}
            active={
              (!filters.contentType && v === 'all') || filters.contentType === v
            }
            onClick={() =>
              set({ contentType: v as CourseFilters['contentType'] })
            }>
            <span className='text-muted-foreground'>{icon}</span>
            {label}
          </Chip>
        ))}
      </FilterSection>

      {/* ── Status ─────────────────────────────────────── */}
      <FilterSection title={t('filters.status', 'Status')}>
        <Chip
          active={filters.status === 'coming_soon'}
          onClick={() =>
            set({
              status: filters.status === 'coming_soon' ? 'all' : 'coming_soon',
            })
          }>
          <Clock3 className='h-4 w-4 text-zinc-400' />
          {t('filters.comingSoon', 'Coming Soon')}
        </Chip>
      </FilterSection>
    </aside>
  );
}
