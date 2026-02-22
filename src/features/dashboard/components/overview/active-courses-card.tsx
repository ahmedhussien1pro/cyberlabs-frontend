import { BookOpen, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserCourses } from '@/shared/hooks/use-user-data';
import { ROUTES } from '@/shared/constants';

const DIFF: Record<string, string> = {
  EASY: 'text-green-500  bg-green-500/10',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10',
  HARD: 'text-red-500    bg-red-500/10',
};

export function ActiveCoursesCard() {
  const { t, i18n } = useTranslation('dashboard');
  const isAr = i18n.language === 'ar';
  const { data, isLoading } = useUserCourses();
  const active = data?.filter((c) => !c.isCompleted).slice(0, 4) ?? [];

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-blue-500' />
          {t('overview.activeCourses')}
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
        ) : active.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <BookOpen size={28} className='opacity-40' />
            <p className='text-sm'>{t('overview.noActiveCourses')}</p>
            <Button asChild variant='outline' size='sm' className='mt-1'>
              <Link to={ROUTES.COURSES.LIST}>
                {t('overview.exploreCourses')}
              </Link>
            </Button>
          </div>
        ) : (
          active.map((enrollment) => {
            const title = isAr
              ? (enrollment.course.ar_title ?? enrollment.course.title)
              : enrollment.course.title;
            const diff =
              DIFF[enrollment.course.difficulty] ??
              'text-muted-foreground bg-muted';
            return (
              <div key={enrollment.id} className='flex items-center gap-3 p-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
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

                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='truncate text-sm font-medium'>{title}</p>
                    <Badge className={`shrink-0 border-0 text-[10px] ${diff}`}>
                      {enrollment.course.difficulty}
                    </Badge>
                  </div>
                  <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all'
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                  <p className='mt-0.5 text-right text-[10px] text-muted-foreground'>
                    {enrollment.progress}%
                  </p>
                </div>

                <Link
                  to={ROUTES.COURSES.DETAIL(enrollment.course.id)}
                  className='shrink-0'>
                  <ArrowRight size={14} className='text-muted-foreground' />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
