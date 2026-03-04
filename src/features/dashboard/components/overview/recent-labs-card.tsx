// src/features/dashboard/components/overview/recent-labs-card.tsx
import {
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserLabs } from '@/shared/hooks/use-user-data';
import { ROUTES } from '@/shared/constants';

const DIFF: Record<string, string> = {
  EASY: 'text-green-500  bg-green-500/10  border-green-500/20',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  HARD: 'text-red-500    bg-red-500/10    border-red-500/20',
  BEGINNER: 'text-green-500  bg-green-500/10  border-green-500/20',
  INTERMEDIATE: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  ADVANCED: 'text-red-500    bg-red-500/10    border-red-500/20',
};

export function RecentLabsCard() {
  const { t, i18n } = useTranslation('dashboard');
  const isAr = i18n.language === 'ar';
  const { data, isLoading } = useUserLabs();

  // أحدث 5 labs مكتملة مرتبة بتاريخ الإكمال (الأحدث أولاً)
  const recent = [...(data ?? [])]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <section className='space-y-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-green-500' />
          {t('overview.recentLabs', 'Completed Labs')}
          {data && data.length > 0 && (
            <span className='rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-500'>
              {data.length}
            </span>
          )}
        </h2>
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='h-7 gap-1 text-xs text-muted-foreground'>
          <Link to={ROUTES.LABS.LIST}>
            {t('overview.viewAll')} <ArrowRight size={12} />
          </Link>
        </Button>
      </div>

      {/* List */}
      <div className='divide-y divide-border/30 rounded-xl border border-border/40 bg-card'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3 p-3'>
              <Skeleton className='h-9 w-9 shrink-0 rounded-lg' />
              <div className='flex-1 space-y-1.5'>
                <Skeleton className='h-3.5 w-3/4' />
                <Skeleton className='h-3 w-1/2' />
              </div>
            </div>
          ))
        ) : recent.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <FlaskConical size={28} className='opacity-40' />
            <p className='text-sm'>
              {t('overview.noLabsYet', 'No labs completed yet')}
            </p>
            <Button asChild variant='outline' size='sm' className='mt-1'>
              <Link to={ROUTES.LABS.LIST}>
                {t('overview.exploreLabs', 'Explore Labs')}
              </Link>
            </Button>
          </div>
        ) : (
          recent.map((entry) => {
            const title = isAr
              ? (entry.lab.ar_title ?? entry.lab.title)
              : entry.lab.title;
            const diff =
              DIFF[entry.lab.difficulty?.toUpperCase()] ??
              'text-muted-foreground bg-muted border-border/40';

            return (
              <div key={entry.id} className='flex items-center gap-3 p-3'>
                {/* Icon */}
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10'>
                  <CheckCircle2 size={16} className='text-green-500' />
                </div>

                {/* Info */}
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{title}</p>
                  <div className='mt-0.5 flex flex-wrap items-center gap-2'>
                    <Badge className={`border text-[10px] ${diff}`}>
                      {entry.lab.difficulty}
                    </Badge>
                    <span className='flex items-center gap-1 text-[10px] text-primary font-semibold'>
                      <Zap size={9} />+{entry.lab.xpReward} XP
                    </span>
                    <span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                      <Clock size={9} />
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Link */}
                <Link
                  to={ROUTES.LABS.DETAIL(entry.lab.id)}
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
