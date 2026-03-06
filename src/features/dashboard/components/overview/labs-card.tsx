// src/features/dashboard/components/overview/labs-card.tsx
import { useState } from 'react';
import {
  FlaskConical,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  AlertCircle,
  Play,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMyLabs } from '../../hooks/use-labs-data';
import { ROUTES } from '@/shared/constants';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Tab = 'all' | 'active' | 'completed';

const DIFF: Record<string, string> = {
  EASY: 'text-green-500 bg-green-500/10 border-green-500/20',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  HARD: 'text-red-500 bg-red-500/10 border-red-500/20',
  BEGINNER: 'text-green-500 bg-green-500/10 border-green-500/20',
  INTERMEDIATE: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  ADVANCED: 'text-red-500 bg-red-500/10 border-red-500/20',
};

export function LabsCard() {
  const { t, i18n } = useTranslation('dashboard');
  const isAr = i18n.language === 'ar';
  const { data, isLoading, isError } = useMyLabs();
  const [tab, setTab] = useState<Tab>('all');

  const all = data ?? [];
  const active = all.filter((l) => l.status === 'active');
  const completed = all.filter((l) => l.status === 'completed');

  const list = (
    tab === 'all' ? all : tab === 'active' ? active : completed
  ).slice(0, 6);

  const counts = { all: all.length, active: active.length, completed: completed.length };

  return (
    <section className='space-y-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-primary' />
          {t('overview.labs', 'Labs')}
        </h2>
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='h-7 gap-1 text-xs text-muted-foreground'>
          <Link to={ROUTES.LABS.LIST}>
            {t('overview.viewAll')} <ChevronRight size={12} />
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 rounded-lg bg-muted/50 p-1'>
        {(['all', 'active', 'completed'] as Tab[]).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              tab === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}>
            {id === 'all'
              ? `${t('labs.filter.all', 'All')} (${counts.all})`
              : id === 'active'
                ? `${t('labs.filter.active', 'Active')} (${counts.active})`
                : `${t('labs.filter.completed', 'Completed')} (${counts.completed})`}
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
                <Skeleton className='h-3 w-1/3' />
              </div>
            </div>
          ))
        ) : isError ? (
          <div className='flex flex-col items-center gap-2 py-10 text-destructive'>
            <AlertCircle size={28} className='opacity-50' />
            <p className='text-sm'>{t('common.errorLoading', 'Failed to load data')}</p>
          </div>
        ) : list.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-10 text-muted-foreground'>
            <FlaskConical size={28} className='opacity-40' />
            <p className='text-sm'>{t('overview.noLabsYet', 'No labs yet')}</p>
            {tab !== 'completed' && (
              <Button asChild variant='outline' size='sm' className='mt-1'>
                <Link to={ROUTES.LABS.LIST}>
                  {t('overview.exploreLabs', 'Explore Labs')}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          list.map((lab, i) => {
            const title = isAr ? (lab.ar_title ?? lab.title) : lab.title;
            const diff =
              DIFF[lab.difficulty?.toUpperCase() ?? ''] ??
              'text-muted-foreground bg-muted border-border/40';
            const isComplete = lab.status === 'completed';
            const isActive = lab.status === 'active';
            const pct = Math.min(lab.progress ?? 0, 100);

            return (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className='flex items-center gap-3 p-4'>
                {/* Icon */}
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                    isComplete
                      ? 'bg-green-500/10'
                      : isActive
                        ? 'bg-primary/10'
                        : 'bg-muted',
                  )}>
                  {isComplete ? (
                    <CheckCircle2 size={18} className='text-green-500' />
                  ) : isActive ? (
                    <Play size={18} className='text-primary' />
                  ) : (
                    <FlaskConical size={18} className='text-muted-foreground' />
                  )}
                </div>

                {/* Info */}
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <Link
                      to={ROUTES.LABS.DETAIL(lab.id)}
                      className='truncate text-sm font-semibold hover:text-primary transition-colors'>
                      {title}
                    </Link>
                    {isComplete ? (
                      <Badge className='shrink-0 border-0 bg-green-500/10 text-[10px] text-green-500'>
                        <CheckCircle2 size={9} className='mr-1' />
                        {t('overview.completed', 'Done')}
                      </Badge>
                    ) : (
                      <Badge className={`shrink-0 border text-[10px] ${diff}`}>
                        {lab.difficulty}
                      </Badge>
                    )}
                  </div>

                  <div className='mt-0.5 flex flex-wrap items-center gap-2'>
                    <span className='flex items-center gap-1 text-[10px] font-semibold text-primary'>
                      <Zap size={9} />
                      {lab.xpReward} XP
                    </span>
                    {isComplete && lab.completedAt && (
                      <span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                        <Clock size={9} />
                        {new Date(lab.completedAt).toLocaleDateString()}
                      </span>
                    )}
                    {isActive && pct > 0 && (
                      <span className='text-[10px] text-muted-foreground'>
                        {pct}%
                      </span>
                    )}
                  </div>

                  {/* Progress bar for active labs */}
                  {isActive && (
                    <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.05 + 0.1, duration: 0.5 }}
                        className='h-full rounded-full bg-gradient-to-r from-primary to-cyan-400'
                      />
                    </div>
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
