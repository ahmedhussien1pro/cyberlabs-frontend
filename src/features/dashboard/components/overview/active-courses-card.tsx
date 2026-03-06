// src/features/dashboard/components/overview/active-courses-card.tsx
import { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserCourses } from '@/shared/hooks/use-user-data';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/lib/utils';

const DIFF: Record<string, string> = {
  EASY: 'text-green-500  bg-green-500/10',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10',
  HARD: 'text-red-500    bg-red-500/10',
};

type Tab = 'active' | 'completed';

export function ActiveCoursesCard() {
  const { t, i18n } = useTranslation('dashboard');
  const isAr = i18n.language === 'ar';
  // ✅ Fix: destructure isError
  const { data, isLoading, isError } = useUserCourses();
  const [tab, setTab] = useState<Tab>('active');

  const active = data?.filter((c) => !c.isCompleted).slice(0, 4) ?? [];
  const completed = data?.filter((c) => c.isCompleted).slice(0, 4) ?? [];
  const list = tab === 'active' ? active : completed;

  return (
    <section className='space-y-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-blue-500' />
          {t('overview.courses', 'Courses')}
        </h2>
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='h-7 gap-1 text-xs text-muted-foreground'>
          <Link to={ROUTES.COURSES.LIST}>
            {t('overview.viewAll')} <ChevronRight size={12} />
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 rounded-lg bg-muted/50 p-1'>
        {(['active', 'completed'] as Tab[]).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              tab === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}>
            {id === 'active'
              ? `${t('overview.activeCourses', 'Active')} (${active.length})`
              : `${t('overview.completedCourses', 'Completed')} (${completed.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className='divide-y divide-border/30 rounded-xl border border-border/40 bg-card'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3 p-3'>
              <Skeleton className='h-10 w-10 shrink-0 rounded-lg' />
              <div className='flex-1 space-y-1.5'>
                <Skeleton className='h-3.5 w-3/4' />
                <Skeleton className='h-1.5 w-full rounded-full' />
              </div>
            </div>
          ))
        ) : isError ? (
          // ✅ Fix: error state
          <div className='flex flex-col items-center gap-2 py-8 text-destructive'>
            <AlertCircle size={28} className='opacity-50' />
            <p className='text-sm'>{t('common.errorLoading', 'Failed to load data')}</p>
          </div>
        ) : list.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <BookOpen size={28} className='opacity-40' />
            <p className='text-sm'>
              {tab === 'active'
                ? t('overview.noActiveCourses')
                : t('overview.noCompletedCourses', 'No completed courses yet')}
            </p>
            {tab === 'active' && (
              <Button asChild variant='outline' size='sm' className='mt-1'>
                <Link to={ROUTES.COURSES.LIST}>
                  {t('overview.exploreCourses')}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          list.map((enrollment) => {
            const title = isAr
              ? (enrollment.course.ar_title ?? enrollment.course.title)
              : enrollment.course.title;
            const diff =
              DIFF[enrollment.course.difficulty] ??
              'text-muted-foreground bg-muted';

            return (
              <div key={enrollment.id} className='flex items-center gap-3 p-3'>
                {/* Thumbnail / Icon */}
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 overflow-hidden'>
                  {enrollment.course.thumbnail ? (
                    <img
                      src={enrollment.course.thumbnail}
                      alt=''
                      className='h-full w-full rounded-lg object-cover'
                    />
                  ) : (
                    <BookOpen size={18} className='text-primary' />
                  )}
                </div>

                {/* Info */}
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='truncate text-sm font-medium'>{title}</p>
                    <Badge className={`shrink-0 border-0 text-[10px] ${diff}`}>
                      {enrollment.course.difficulty}
                    </Badge>
                  </div>

                  {tab === 'active' ? (
                    <>
                      <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted'>
                        <div
                          className='h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all'
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <p className='mt-0.5 text-right text-[10px] text-muted-foreground'>
                        {enrollment.progress}%
                      </p>
                    </>
                  ) : (
                    <div className='mt-1 flex items-center gap-1.5'>
                      <CheckCircle2 size={11} className='text-green-500' />
                      <span className='text-[10px] text-green-500 font-medium'>
                        {t('overview.completed', 'Completed')}
                      </span>
                      {enrollment.xpReward != null && enrollment.xpReward > 0 && (
                        <span className='flex items-center gap-0.5 text-[10px] text-primary'>
                          <Zap size={9} />+{enrollment.xpReward}{' '}
                          {/* ✅ XP label kept as-is: it's a universal abbreviation */}
                          XP
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action */}
                <Link
                  to={ROUTES.COURSES.DETAIL(enrollment.course.id)}
                  className='shrink-0 text-muted-foreground hover:text-foreground transition-colors'>
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
