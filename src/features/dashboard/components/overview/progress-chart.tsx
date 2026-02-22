import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeeklyProgress } from '../../hooks/use-dashboard-data';

function Bar({
  value,
  max,
  label,
  delay,
}: {
  value: number;
  max: number;
  label: string;
  delay: number;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className='flex flex-1 flex-col items-center gap-1.5'>
      <span className='font-mono text-[10px] text-muted-foreground'>
        {value > 0 ? value : ''}
      </span>
      <div className='relative flex h-20 w-full max-w-[32px] items-end overflow-hidden rounded-full bg-muted'>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ delay, duration: 0.6, ease: 'easeOut' }}
          className='w-full rounded-full bg-gradient-to-t from-primary to-cyan-400'
        />
      </div>
      <span className='text-[10px] text-muted-foreground'>{label}</span>
    </div>
  );
}

export function ProgressChart() {
  const { t } = useTranslation('dashboard');
  const { data, isLoading } = useWeeklyProgress();

  const max = data ? Math.max(...data.map((d) => d.xp), 1) : 1;

  return (
    <section className='space-y-3'>
      <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
        <span className='h-1.5 w-1.5 rounded-full bg-cyan-400' />
        {t('chart.weeklyXP')}
      </h2>

      <div className='rounded-xl border border-border/40 bg-card p-4'>
        {isLoading ? (
          <div className='flex h-28 items-end justify-around gap-1'>
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className='w-8 rounded-full'
                style={{ height: `${40 + i * 10}%` }}
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
                value={point.xp}
                max={max}
                label={point.day}
                delay={i * 0.05}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
