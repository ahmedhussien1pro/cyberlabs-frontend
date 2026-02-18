import { Star, Signal, Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { StatsBarProps } from '../types';

export function StatsBar({
  rating,
  difficulty,
  duration,
  students,
}: StatsBarProps) {
  const { t, i18n } = useTranslation('courses');
  const isRTL = i18n.language === 'ar';

  const stats = [
    {
      icon: Star,
      value: rating.toFixed(1),
      label: t('stats.rating'),
      color: 'text-yellow-600 dark:text-yellow-500',
    },
    {
      icon: Signal,
      value: isRTL ? difficulty.ar : difficulty.en,
      label: t('stats.level'),
      color: 'text-primary',
    },
    {
      icon: Clock,
      value: isRTL ? duration.ar : duration.en,
      label: t('stats.duration'),
      color: 'text-primary',
    },
    {
      icon: Users,
      value: `${students.toLocaleString()}+`,
      label: t('stats.students'),
      color: 'text-primary',
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 p-3 rounded-lg',
        'bg-primary/5 border border-primary/20 backdrop-blur-sm',
        'dark:border-primary/15',
        'md:flex-nowrap md:justify-between',
        // Mobile: Grid layout
        'grid grid-cols-2 md:flex',
      )}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2.5 flex-1',
              // Mobile: Add card style
              'md:flex-row md:bg-transparent md:border-0 md:rounded-none md:p-0',
              'bg-primary/5 border border-primary/15 rounded-lg p-2.5',
              'dark:border-primary/10',
              // Add divider on desktop (except last item)
              index < stats.length - 1 &&
                'md:border-r md:border-primary/25 md:pr-4 md:mr-4 dark:md:border-primary/20',
            )}>
            <Icon
              className={cn('h-4 w-4 flex-shrink-0', stat.color)}
              aria-hidden='true'
            />
            <div className='flex flex-col gap-0.5 min-w-0'>
              <div className='text-sm md:text-base font-bold text-white leading-none truncate'>
                {stat.value}
              </div>
              <div className='text-[10px] text-white/80 uppercase tracking-wide font-semibold leading-none hidden md:block'>
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
