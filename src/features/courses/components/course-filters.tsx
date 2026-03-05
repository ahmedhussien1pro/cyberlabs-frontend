// src/features/courses/components/course-filters.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  X,
  Heart,
  BookOpen,
  Clock3,
  FlaskConical,
  BookMarked,
  RotateCcw,
  ChevronDown,
  Globe,
  TrendingUp,
  Gauge,
  Flame,
  Unlock,
  Crown,
  Gem,
  BookCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUserProgress } from '../hooks/use-user-progress';
import type {
  CourseFilters,
  CourseDifficulty,
  CourseAccess,
} from '../types/course.types';

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        className='w-full flex items-center justify-between px-1 py-1.5 group rounded-md
                   hover:bg-muted/50 transition-colors'>
        <p
          className='text-[11px] font-bold uppercase tracking-wider
                      text-muted-foreground/60 group-hover:text-muted-foreground transition-colors'>
          {title}
        </p>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-muted-foreground/40 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className='overflow-hidden'>
            <div className='space-y-0.5 pt-1 pb-2'>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all text-start',
        active
          ? 'bg-primary/10 text-primary border border-primary/25 font-semibold'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent',
      )}>
      {children}
    </button>
  );
}

export function CourseFilterSidebar({
  filters,
  onChange,
  onReset,
}: {
  filters: CourseFilters;
  onChange: (f: CourseFilters) => void;
  onReset: () => void;
  totalCount?: number;
}) {
  const { t } = useTranslation('courses');

  // ── بيانات حقيقية من DB ──────────────────────────────────────────
  const { favorites, enrollments } = useUserProgress();

  const set = (patch: Partial<CourseFilters>) =>
    onChange({ ...filters, ...patch });

  const activeCount = [
    filters.difficulty && filters.difficulty !== 'all',
    filters.access && filters.access !== 'all',
    filters.contentType && filters.contentType !== 'all',
    filters.state && filters.state !== 'all',
    filters.onlyFavorites,
    filters.onlyEnrolled,
    filters.onlyCompleted,
  ].filter(Boolean).length;

  return (
    <aside className='w-full space-y-1.5'>
      {/* Search */}
      <div className='relative mb-3'>
        <Search
          className='absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4
                           text-muted-foreground pointer-events-none'
        />
        <input
          type='text'
          value={filters.search ?? ''}
          onChange={(e) => set({ search: e.target.value })}
          placeholder={t('filters.search', 'Search courses...')}
          className='w-full rounded-lg border border-border/60 bg-muted/40
                     ps-9 pe-3 py-2 text-sm text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/30
                     focus:border-primary/50 transition-all'
        />
        {filters.search && (
          <button
            type='button'
            onClick={() => set({ search: '' })}
            className='absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'>
            <X className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      {/* Reset */}
      {activeCount > 0 && (
        <div className='flex items-center justify-between px-1 mb-2'>
          <span className='text-xs text-muted-foreground'>
            {activeCount} {t('filters.active', 'active')}
          </span>
          <Button
            variant='ghost'
            size='sm'
            className='h-7 text-xs gap-1 text-muted-foreground px-2'
            onClick={onReset}>
            <RotateCcw className='h-3 w-3' />
            {t('filters.reset', 'Reset')}
          </Button>
        </div>
      )}

      <div className='h-px bg-border/40 my-2' />

      {/* MY LIBRARY */}
      <FilterSection title={t('filters.myLibrary', 'My Library')} defaultOpen>
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
          {favorites.length > 0 && (
            <Badge
              variant='secondary'
              className='text-[10px] h-4 px-1.5 shrink-0'>
              {favorites.length}
            </Badge>
          )}
        </Chip>
        <Chip
          active={!!filters.onlyEnrolled}
          onClick={() => set({ onlyEnrolled: !filters.onlyEnrolled })}>
          <BookOpen className='h-4 w-4 shrink-0 text-blue-400' />
          <span className='flex-1'>{t('filters.enrolled', 'Enrolled')}</span>
          {enrollments.length > 0 && (
            <Badge
              variant='secondary'
              className='text-[10px] h-4 px-1.5 shrink-0'>
              {enrollments.length}
            </Badge>
          )}
        </Chip>
        <Chip
          active={!!filters.onlyCompleted}
          onClick={() => set({ onlyCompleted: !filters.onlyCompleted })}>
          <BookCheck className='h-4 w-4 shrink-0 text-emerald-400' />
          <span className='flex-1'>{t('filters.completed', 'Completed')}</span>
        </Chip>
      </FilterSection>

      <div className='h-px bg-border/40' />

      {/* LEVEL */}
      <FilterSection title={t('filters.level', 'Level')} defaultOpen>
        {[
          {
            v: 'all',
            Icon: Globe,
            label: t('filters.allLevels', 'All Levels'),
            cls: 'text-muted-foreground',
          },
          {
            v: 'BEGINNER',
            Icon: TrendingUp,
            label: 'Beginner',
            cls: 'text-emerald-500',
          },
          {
            v: 'INTERMEDIATE',
            Icon: Gauge,
            label: 'Intermediate',
            cls: 'text-yellow-500',
          },
          {
            v: 'ADVANCED',
            Icon: Flame,
            label: 'Advanced',
            cls: 'text-red-500',
          },
        ].map(({ v, Icon, label, cls }) => (
          <Chip
            key={v}
            active={
              (!filters.difficulty && v === 'all') || filters.difficulty === v
            }
            onClick={() =>
              set({
                difficulty: v === 'all' ? undefined : (v as CourseDifficulty),
              })
            }>
            <Icon className={cn('h-4 w-4 shrink-0', cls)} />
            {label}
          </Chip>
        ))}
      </FilterSection>

      <div className='h-px bg-border/40' />

      {/* ACCESS */}
      <FilterSection title={t('filters.access', 'Access')} defaultOpen>
        {[
          {
            v: 'all',
            Icon: Globe,
            label: t('filters.allAccess', 'All Access'),
            cls: 'text-muted-foreground',
          },
          { v: 'FREE', Icon: Unlock, label: 'Free', cls: 'text-emerald-500' },
          { v: 'PRO', Icon: Crown, label: 'Pro', cls: 'text-blue-500' },
          { v: 'PREMIUM', Icon: Gem, label: 'Premium', cls: 'text-violet-500' },
        ].map(({ v, Icon, label, cls }) => (
          <Chip
            key={v}
            active={(!filters.access && v === 'all') || filters.access === v}
            onClick={() =>
              set({ access: v === 'all' ? undefined : (v as CourseAccess) })
            }>
            <Icon className={cn('h-4 w-4 shrink-0', cls)} />
            {label}
          </Chip>
        ))}
      </FilterSection>

      <div className='h-px bg-border/40' />

      {/* TYPE */}
      <FilterSection
        title={t('filters.contentType', 'Type')}
        defaultOpen={false}>
        {[
          { v: 'all', Icon: BookOpen, label: t('filters.all', 'All Types') },
          {
            v: 'PRACTICAL',
            Icon: FlaskConical,
            label: t('filters.practical', 'Practical'),
          },
          {
            v: 'THEORETICAL',
            Icon: BookMarked,
            label: t('filters.theoretical', 'Theoretical'),
          },
          { v: 'MIXED', Icon: BookOpen, label: t('filters.mixed', 'Mixed') },
        ].map(({ v, Icon, label }) => (
          <Chip
            key={v}
            active={
              (!filters.contentType && v === 'all') || filters.contentType === v
            }
            onClick={() =>
              set({
                contentType:
                  v === 'all' ? undefined : (v as CourseFilters['contentType']),
              })
            }>
            <Icon className='h-4 w-4 shrink-0 text-muted-foreground' />
            {label}
          </Chip>
        ))}
      </FilterSection>

      <div className='h-px bg-border/40' />

      {/* STATUS */}
      <FilterSection title={t('filters.status', 'Status')} defaultOpen={false}>
        <Chip
          active={filters.state === 'COMING_SOON'}
          onClick={() =>
            set({
              state:
                filters.state === 'COMING_SOON' ? undefined : 'COMING_SOON',
            })
          }>
          <Clock3 className='h-4 w-4 shrink-0 text-zinc-400' />
          {t('filters.comingSoon', 'Coming Soon')}
        </Chip>
      </FilterSection>
    </aside>
  );
}
