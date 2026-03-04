// src/features/dashboard/components/overview/recent-labs-card.tsx
import {
  FlaskConical,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Circle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserLabs } from '@/shared/hooks/use-user-data';
import { ROUTES } from '@/shared/constants';
import type { LabStatus } from '../../types/dashboard.types';
import { cn } from '@/lib/utils';

const DIFF: Record<string, string> = {
  EASY: 'text-green-500  border-green-500/30  bg-green-500/5',
  MEDIUM: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5',
  HARD: 'text-red-500    border-red-500/30    bg-red-500/5',
};

/* ── Status icon + color ─────────────────── */
function StatusIcon({ status }: { status: LabStatus }) {
  if (status === 'completed')
    return <CheckCircle2 size={16} className='text-green-500' />;
  if (status === 'active')
    return <PlayCircle size={16} className='text-primary' />;
  return <Circle size={16} className='text-muted-foreground/50' />;
}

const STATUS_LABEL: Record<LabStatus, string> = {
  completed: 'Completed',
  active: 'In Progress',
  not_started: 'Not Started',
};

const STATUS_BADGE: Record<LabStatus, string> = {
  completed: 'border-green-500/20 bg-green-500/5 text-green-500',
  active: 'border-primary/20 bg-primary/5 text-primary',
  not_started: 'border-border/40 bg-muted/30 text-muted-foreground',
};

export function RecentLabsCard() {
  const { t, i18n } = useTranslation('dashboard');
  const isAr = i18n.language === 'ar';
  const { data, isLoading } = useUserLabs();

  // أحدث 5 labs — مرتبة بـ startedAt أو completedAt (الأحدث أولاً)
  const recent =
    data
      ?.slice()
      .sort((a, b) => {
        const aDate = a.completedAt ?? a.startedAt ?? '';
        const bDate = b.completedAt ?? b.startedAt ?? '';
        return bDate.localeCompare(aDate);
      })
      .slice(0, 5) ?? [];

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-primary' />
          {t('overview.recentLabs')}
        </h2>
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='h-7 gap-1 text-xs text-muted-foreground'>
          <Link to={ROUTES.DASHBOARD.LabsPage}>
            {t('overview.viewAll')} <ChevronRight size={12} />
          </Link>
        </Button>
      </div>

      <div className='divide-y divide-border/30 rounded-xl border border-border/40 bg-card'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3 p-3'>
              <Skeleton className='h-8 w-8 shrink-0 rounded-lg' />
              <div className='flex-1 space-y-1.5'>
                <Skeleton className='h-3.5 w-2/3' />
                <Skeleton className='h-3 w-1/3' />
              </div>
              <Skeleton className='h-4 w-4 rounded-full' />
            </div>
          ))
        ) : recent.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <FlaskConical size={28} className='opacity-40' />
            <p className='text-sm'>{t('overview.noLabsYet')}</p>
            <Button asChild variant='outline' size='sm' className='mt-1'>
              <Link to={ROUTES.LABS.LIST}>{t('overview.exploreLabs')}</Link>
            </Button>
          </div>
        ) : (
          recent.map((entry) => {
            const title = isAr
              ? (entry.lab?.ar_title ?? entry.lab?.title ?? entry.title)
              : (entry.lab?.title ?? entry.title);
            const difficulty = entry.lab?.difficulty ?? entry.difficulty;
            const xpReward = entry.lab?.xpReward ?? entry.xpReward;
            const status: LabStatus = entry.status;
            const diff = DIFF[difficulty] ?? 'text-muted-foreground';

            return (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center gap-3 p-3 transition-colors',
                  status === 'active' && 'bg-primary/[0.02]',
                )}>
                {/* Icon */}
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                  <FlaskConical size={15} className='text-primary' />
                </div>

                {/* Info */}
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{title}</p>
                  <div className='mt-0.5 flex items-center gap-1.5 flex-wrap'>
                    <Badge
                      variant='outline'
                      className={`border px-1.5 py-0 text-[10px] ${diff}`}>
                      {difficulty}
                    </Badge>
                    {xpReward > 0 && (
                      <span className='text-[10px] text-muted-foreground'>
                        +{xpReward} XP
                      </span>
                    )}
                    {/* Progress bar لو active */}
                    {status === 'active' && entry.progress != null && (
                      <span className='text-[10px] text-primary'>
                        {entry.progress}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Status icon + link */}
                <div className='flex shrink-0 items-center gap-2'>
                  <span title={STATUS_LABEL[status]}>
                    <StatusIcon status={status} />
                  </span>
                  {status !== 'not_started' && (
                    <Link
                      to={ROUTES.LABS.DETAIL(entry.lab?.id ?? entry.id)}
                      className='text-muted-foreground hover:text-foreground transition-colors'>
                      <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
