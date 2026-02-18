// src/shared/components/stats-section.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  BookOpenCheck,
  CalendarDays,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { useCountUp } from '@/shared/hooks/use-count-up';
import { cn } from '@/shared/utils';

interface StatItem {
  icon: LucideIcon;
  value: number;
  labelKey: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

interface StatCardProps {
  stat: StatItem;
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const { t } = useTranslation(['common']);
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
      className={cn(
        'group relative transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}>
      {/* Main Card */}
      <div className='relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-xl hover:-translate-y-1'>
        {/* Gradient Accent - Top */}
        <div
          className={cn(
            'absolute left-0 top-0 h-1 w-0 transition-all duration-1000 ease-out',
            stat.gradient,
            hasAnimated && 'w-full',
          )}
        />

        {/* Background Gradient on Hover */}
        <div
          className={cn(
            'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.03]',
            stat.gradient,
          )}
        />

        {/* Content Wrapper */}
        <div className='relative flex items-start gap-4'>
          {/* Icon Container */}
          <div
            className={cn(
              'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl',
              'transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
              stat.iconBg,
            )}>
            <Icon
              className={cn(
                'h-7 w-7 transition-transform duration-300',
                stat.iconColor,
                hasAnimated && 'scale-110',
              )}
            />
          </div>

          {/* Number & Label */}
          <div className='flex-1 space-y-1'>
            <div
              ref={elementRef}
              className={cn(
                'text-4xl font-black tracking-tight transition-all duration-300',
                'bg-gradient-to-br bg-clip-text text-transparent',
                stat.gradient,
              )}>
              {count.toLocaleString()}
            </div>
            <p className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
              {t(`stats.${stat.labelKey}`)}
            </p>
          </div>
        </div>

        {/* Bottom Accent Dot */}
        <div className='absolute bottom-4 right-4 flex gap-1'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-all duration-500',
                stat.gradient,
                hasAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
              )}
              style={{
                transitionDelay: `${1000 + i * 100}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatsSection() {
  const { t } = useTranslation(['common']);

  const stats: StatItem[] = [
    {
      icon: Users,
      value: 1232,
      labelKey: 'students',
      gradient: 'bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
    },
    {
      icon: BookOpenCheck,
      value: 30,
      labelKey: 'courses',
      gradient:
        'bg-gradient-to-br from-violet-500 via-purple-600 to-purple-600',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
    },
    {
      icon: CalendarDays,
      value: 42,
      labelKey: 'events',
      gradient: 'bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
    },
    {
      icon: ShieldCheck,
      value: 24,
      labelKey: 'trainers',
      gradient: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <section className='relative overflow-hidden py-20 md:py-28'>
      {/* Background Decoration */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent' />
        <div className='absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent' />
      </div>

      <div className='container'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
            <span className='text-muted-foreground'>{t('stats.badge')}</span>
          </div>

          <h2 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            {t('stats.title')}
          </h2>
          <p className='mt-3 text-lg text-muted-foreground'>
            {t('stats.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, index) => (
            <StatCard key={stat.labelKey} stat={stat} index={index} />
          ))}
        </div>

        {/* Footer Info */}
        <div className='mt-10 text-center'>
          <p className='text-xs text-muted-foreground'>
            {t('stats.updated')} •{' '}
            {new Date().toLocaleDateString('en-US', {
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
