import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  BookOpenCheck,
  CalendarDays,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { useCountUp } from '@/features/landing/hooks/use-count-up';
import { cn } from '@/shared/utils';
import { SectionHeader } from '@/shared/components/common';

interface StatItem {
  icon: LucideIcon;
  value: number;
  labelKey: string;
}

interface StatCardProps {
  stat: StatItem;
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const { t } = useTranslation('landing');
  const [hasAnimated, setHasAnimated] = useState(false);

  const { count, isVisible, elementRef } = useCountUp({
    start: 0,
    end: stat.value,
    duration: 2.5,
    onComplete: () => setHasAnimated(true),
  });

  const Icon = stat.icon;

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}
      style={{ transitionDelay: `${index * 120}ms` }}>
      {/* Card */}
      <div className='group relative rounded-2xl border  border-black/10  bg-card p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]'>
        {/* Subtle top glow line */}
        <div
          className={cn(
            'absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-700',
            hasAnimated && 'w-full',
          )}
        />

        {/* Content */}
        <div className='flex items-center gap-4'>
          {/* Icon */}
          <div className='relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/8 ring-1 ring-primary/15 transition-all duration-300 group-hover:bg-primary/12 group-hover:ring-primary/30'>
            <Icon className='h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110' />
          </div>

          {/* Text */}
          <div>
            <div className='flex items-baseline gap-1'>
              <span className='text-3xl font-black tabular-nums tracking-tight text-primary'>
                {count.toLocaleString()}
              </span>
              <span className='text-primary/60 text-lg font-bold'>+</span>
            </div>
            <p className='mt-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70'>
              {t(`stats.${stat.labelKey}`)}
            </p>
          </div>
        </div>

        {/* Bottom subtle gradient */}
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent' />
      </div>
    </div>
  );
}

export function StatsSection() {
  const { t, i18n } = useTranslation('landing');

  const stats: StatItem[] = [
    { icon: Users, value: 1232, labelKey: 'students' },
    { icon: BookOpenCheck, value: 30, labelKey: 'courses' },
    { icon: CalendarDays, value: 42, labelKey: 'events' },
    { icon: ShieldCheck, value: 24, labelKey: 'trainers' },
  ];

  return (
    <section className='relative overflow-hidden py-6 md:py-10 '>
      {/* Top & Bottom border lines */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent' />
        <div className='absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent' />
      </div>

      <div className='container'>
        <SectionHeader
          title={t('stats.title')}
          subtitle={t('stats.subtitle')}
        />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, index) => (
            <StatCard key={stat.labelKey} stat={stat} index={index} />
          ))}
        </div>

        {/* Updated At */}
        <div className='mt-10 text-center'>
          <p className='text-[11px] tracking-wide text-muted-foreground/50'>
            {t('stats.updated')} •{' '}
            {new Date().toLocaleDateString(i18n.language, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
