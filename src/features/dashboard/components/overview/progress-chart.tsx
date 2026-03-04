// src/features/dashboard/components/overview/progress-chart.tsx
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FlaskConical, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeeklyProgress } from '../../hooks/use-dashboard-data';

function Bar({
  xp,
  labs,
  maxXp,
  label,
  delay,
}: {
  xp: number;
  labs: number;
  maxXp: number;
  label: string;
  delay: number;
}) {
  const pct = maxXp > 0 ? Math.min((xp / maxXp) * 100, 100) : 0;
  const hasActivity = xp > 0 || labs > 0;

  return (
    <div className='group flex flex-1 flex-col items-center gap-1'>
      {/* XP value on hover / if active */}
      <span
        className={`font-mono text-[10px] transition-opacity ${
          hasActivity ? 'text-primary' : 'text-transparent'
        }`}>
        {xp > 0 ? `+${xp}` : ''}
      </span>

      {/* Bar */}
      <div className='relative flex h-20 w-full max-w-[28px] items-end overflow-hidden rounded-full bg-muted'>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ delay, duration: 0.6, ease: 'easeOut' }}
          className='w-full rounded-full bg-gradient-to-t from-primary to-cyan-400'
        />
        {/* Labs dot indicator — يشير لوجود lab هذا اليوم */}
        {labs > 0 && (
          <span className='absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/80' />
        )}
      </div>

      <span className='text-[10px] text-muted-foreground'>{label}</span>
    </div>
  );
}

export function ProgressChart() {
  const { t } = useTranslation('dashboard');
  const { data, isLoading } = useWeeklyProgress();

  const maxXp = data ? Math.max(...data.map((d) => d.xp), 1) : 1;
  const totalXP = data?.reduce((s, d) => s + d.xp, 0) ?? 0;
  const totalLabs = data?.reduce((s, d) => s + d.labs, 0) ?? 0;

  return (
    <section className='space-y-3'>
      <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
        <span className='h-1.5 w-1.5 rounded-full bg-cyan-400' />
        {t('chart.weeklyXP')}
      </h2>

      <div className='rounded-xl border border-border/40 bg-card p-4 space-y-4'>
        {/* Weekly summary */}
        {!isLoading && (
          <div className='flex items-center gap-4 pb-2 border-b border-border/30'>
            <div className='flex items-center gap-1.5'>
              <Zap size={13} className='text-primary' />
              <span className='font-mono text-sm font-bold text-foreground'>
                {totalXP.toLocaleString()}
              </span>
              <span className='text-xs text-muted-foreground'>
                XP this week
              </span>
            </div>
            <div className='h-3 w-px bg-border/60' />
            <div className='flex items-center gap-1.5'>
              <FlaskConical size={13} className='text-cyan-400' />
              <span className='font-mono text-sm font-bold text-foreground'>
                {totalLabs}
              </span>
              <span className='text-xs text-muted-foreground'>
                {t('chart.labsCompleted', 'labs')}
              </span>
            </div>
          </div>
        )}

        {/* Bars */}
        {isLoading ? (
          <div className='flex h-28 items-end justify-around gap-1'>
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className='w-7 rounded-full'
                style={{ height: `${30 + i * 8}%` }}
              />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className='flex h-28 items-center justify-center text-sm text-muted-foreground'>
            {t('chart.noData')}
          </div>
        ) : (
          <div className='flex items-end justify-around gap-1'>
            {data.map((point, i) => (
              <Bar
                key={point.day}
                xp={point.xp}
                labs={point.labs}
                maxXp={maxXp}
                label={point.day}
                delay={i * 0.05}
              />
            ))}
          </div>
        )}

        {/* Legend */}
        {!isLoading && data && data.length > 0 && (
          <div className='flex items-center gap-3 pt-1 border-t border-border/20'>
            <div className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-gradient-to-t from-primary to-cyan-400' />
              <span className='text-[10px] text-muted-foreground'>
                XP earned
              </span>
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='h-1.5 w-1.5 rounded-full bg-white/60 ring-1 ring-border' />
              <span className='text-[10px] text-muted-foreground'>
                Lab completed
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
