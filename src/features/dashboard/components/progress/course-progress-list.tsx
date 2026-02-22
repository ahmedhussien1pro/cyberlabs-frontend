import { BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/shared/constants';
import { useUserCourses } from '@/shared/hooks/use-user-data';

export function CourseProgressList() {
  const { t, i18n } = useTranslation('dashboard');
  const isAr = i18n.language === 'ar';
  const { data, isLoading } = useUserCourses();
  const active = data?.filter((c) => !c.isCompleted) ?? [];

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-blue-400' />
          {t('progress.courseProgress')}
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

      <div className='divide-y divide-border/30 overflow-hidden rounded-xl border border-border/40 bg-card'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='space-y-1.5 p-3'>
              <Skeleton className='h-3.5 w-1/2' />
              <Skeleton className='h-1.5 w-full rounded-full' />
            </div>
          ))
        ) : active.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <BookOpen size={24} className='opacity-30' />
            <p className='text-xs'>{t('progress.noCourses')}</p>
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
            return (
              <Link
                key={enrollment.id}
                to={ROUTES.COURSES.DETAIL(enrollment.course.id)}
                className='block p-3 transition-colors hover:bg-muted/30'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='truncate text-sm font-medium'>{title}</p>
                  <span className='shrink-0 font-mono text-[11px] text-muted-foreground'>
                    {enrollment.progress}%
                  </span>
                </div>
                <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-blue-500 to-primary'
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
