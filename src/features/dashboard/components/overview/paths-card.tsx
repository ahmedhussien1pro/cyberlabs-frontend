// src/features/dashboard/components/overview/paths-card.tsx
import { useState } from 'react';
import { Map, ChevronRight, CheckCircle2, Clock, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserPaths } from '@/shared/hooks/use-user-data';
import { ROUTES } from '@/shared/constants';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Tab = 'active' | 'completed';

export function PathsCard() {
  const { t, i18n } = useTranslation('dashboard');
  const isAr = i18n.language === 'ar';
  const { data, isLoading } = useUserPaths();
  const [tab, setTab] = useState<Tab>('active');

  const active = data?.filter((p) => !p.completedAt).slice(0, 4) ?? [];
  const completed = data?.filter((p) => p.completedAt).slice(0, 4) ?? [];
  const list = tab === 'active' ? active : completed;

  return (
    <section className='space-y-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-violet-500' />
          {t('overview.learningPaths', 'Learning Paths')}
        </h2>
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='h-7 gap-1 text-xs text-muted-foreground'>
          <Link to={ROUTES.PATHS?.LIST ?? '/paths'}>
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
              ? `${t('overview.activePaths', 'Active')} (${active.length})`
              : `${t('overview.completedPaths', 'Completed')} (${completed.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className='divide-y divide-border/30 rounded-xl border border-border/40 bg-card'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3 p-4'>
              <Skeleton className='h-10 w-10 shrink-0 rounded-xl' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-3.5 w-2/3' />
                <Skeleton className='h-1.5 w-full rounded-full' />
              </div>
            </div>
          ))
        ) : list.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-10 text-muted-foreground'>
            <Map size={28} className='opacity-40' />
            <p className='text-sm'>
              {tab === 'active'
                ? t('overview.noActivePaths', 'No active paths')
                : t('overview.noCompletedPaths', 'No completed paths yet')}
            </p>
            {tab === 'active' && (
              <Button asChild variant='outline' size='sm' className='mt-1'>
                <Link to={ROUTES.PATHS?.LIST ?? '/paths'}>
                  {t('overview.explorePaths', 'Explore Paths')}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          list.map((enrollment, i) => {
            const name = isAr
              ? (enrollment.careerPath.ar_name ?? enrollment.careerPath.name)
              : enrollment.careerPath.name;
            const pct = Math.min(enrollment.progress, 100);
            const isComplete = !!enrollment.completedAt;

            return (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className='flex items-center gap-3 p-4'>
                {/* Icon */}
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                    isComplete ? 'bg-green-500/10' : 'bg-violet-500/10',
                  )}>
                  {enrollment.careerPath.iconUrl ? (
                    <img
                      src={enrollment.careerPath.iconUrl}
                      alt=''
                      className='h-6 w-6 object-contain'
                    />
                  ) : isComplete ? (
                    <Trophy size={18} className='text-green-500' />
                  ) : (
                    <Map size={18} className='text-violet-500' />
                  )}
                </div>

                {/* Info */}
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='truncate text-sm font-semibold'>{name}</p>
                    {isComplete ? (
                      <Badge className='shrink-0 border-0 bg-green-500/10 text-[10px] text-green-500'>
                        <CheckCircle2 size={9} className='mr-1' />
                        {t('overview.completed', 'Done')}
                      </Badge>
                    ) : (
                      <span className='shrink-0 font-mono text-[11px] text-muted-foreground'>
                        {pct}%
                      </span>
                    )}
                  </div>

                  {!isComplete ? (
                    <>
                      <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted'>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: i * 0.05 + 0.1, duration: 0.5 }}
                          className='h-full rounded-full bg-gradient-to-r from-violet-500 to-primary'
                        />
                      </div>
                      <p className='mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground'>
                        <Clock size={9} />
                        {t('overview.startedAt', 'Started')}{' '}
                        {new Date(enrollment.startedAt).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p className='mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground'>
                      <CheckCircle2 size={9} className='text-green-500' />
                      {t('overview.completedAt', 'Completed')}{' '}
                      {enrollment.completedAt
                        ? new Date(enrollment.completedAt).toLocaleDateString()
                        : ''}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}
