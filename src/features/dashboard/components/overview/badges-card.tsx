// src/features/dashboard/components/overview/badges-card.tsx
import { useState } from 'react';
import { Award, Lock, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  useBadgesWithStatus,
  type BadgeWithStatus,
} from '../../hooks/use-badges-data';

type Filter = 'all' | 'earned' | 'locked';

const TYPE_GRADIENT: Record<string, string> = {
  COURSE_COMPLETION: 'from-blue-500 to-cyan-400',
  LAB_SOLVED: 'from-primary to-cyan-500',
  STREAK: 'from-orange-500 to-yellow-400',
  COMMUNITY: 'from-green-500 to-emerald-400',
  CONTRIBUTION: 'from-purple-500 to-violet-400',
  CUSTOM: 'from-pink-500 to-rose-400',
};

function BadgeItem({
  badge,
  index,
}: {
  badge: BadgeWithStatus;
  index: number;
}) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const title = isAr ? (badge.ar_title ?? badge.title) : badge.title;
  const desc = isAr
    ? (badge.ar_description ?? badge.description)
    : badge.description;
  const gradient = TYPE_GRADIENT[badge.type] ?? 'from-gray-500 to-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.035, duration: 0.3 }}
      title={desc ?? title}
      className={cn(
        'group relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center',
        'transition-all duration-200 cursor-default select-none',
        badge.earned
          ? 'border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/8'
          : 'border-border/20 bg-muted/10 opacity-45 grayscale',
      )}>
      {/* Badge icon circle */}
      <div
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-full',
          badge.earned ? `bg-gradient-to-br ${gradient} shadow-md` : 'bg-muted',
        )}>
        {badge.iconUrl ? (
          <img
            src={badge.iconUrl}
            alt={title}
            className='h-8 w-8 object-contain'
          />
        ) : (
          <Award
            size={22}
            className={badge.earned ? 'text-white' : 'text-muted-foreground'}
          />
        )}

        {/* Status overlay icon */}
        {badge.earned ? (
          <div className='absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow'>
            <CheckCircle2 size={11} className='text-white' />
          </div>
        ) : (
          <div className='absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border/40'>
            <Lock size={9} className='text-muted-foreground' />
          </div>
        )}
      </div>

      {/* Title */}
      <p
        className={cn(
          'text-[11px] font-semibold leading-tight line-clamp-2',
          badge.earned ? 'text-foreground' : 'text-muted-foreground',
        )}>
        {title}
      </p>

      {/* XP reward */}
      {badge.xpReward > 0 && (
        <span
          className={cn(
            'flex items-center gap-0.5 text-[10px] font-medium',
            badge.earned ? 'text-primary' : 'text-muted-foreground',
          )}>
          <Zap size={9} />
          {badge.earned ? '+' : ''}
          {badge.xpReward} XP
        </span>
      )}

      {/* Award date */}
      {badge.earned && badge.awardedAt && (
        <p className='text-[9px] text-muted-foreground'>
          {new Date(badge.awardedAt).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
}

export function BadgesCard() {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, isError } = useBadgesWithStatus();
  const [filter, setFilter] = useState<Filter>('all');

  const allBadges = data ?? [];
  const earned = allBadges.filter((b) => b.earned);
  const locked = allBadges.filter((b) => !b.earned);

  const list =
    filter === 'all' ? allBadges : filter === 'earned' ? earned : locked;

  return (
    <section className='space-y-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-yellow-500' />
          {t('overview.badges', 'Badges')}
          {data && data.length > 0 && (
            <span className='rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-500'>
              {earned.length}/{allBadges.length}
            </span>
          )}
        </h2>

        {/* Progress bar */}
        {allBadges.length > 0 && (
          <div className='hidden sm:flex items-center gap-2'>
            <div className='h-1.5 w-24 overflow-hidden rounded-full bg-muted'>
              <div
                className='h-full rounded-full bg-yellow-500 transition-all duration-700'
                style={{
                  width: `${(earned.length / allBadges.length) * 100}%`,
                }}
              />
            </div>
            <span className='text-[10px] text-muted-foreground'>
              {Math.round((earned.length / allBadges.length) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className='flex gap-1 rounded-lg bg-muted/50 p-1'>
        {(['all', 'earned', 'locked'] as Filter[]).map((id) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              filter === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}>
            {id === 'all'
              ? `${t('badges.all', 'All')} (${allBadges.length})`
              : id === 'earned'
                ? `${t('badges.earned', 'Earned')} (${earned.length})`
                : `${t('badges.locked', 'Locked')} (${locked.length})`}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div className='rounded-xl border border-border/40 bg-card p-4'>
        {isLoading ? (
          <div className='grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6'>
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className='h-32 rounded-xl' />
            ))}
          </div>
        ) : isError ? (
          <div className='flex flex-col items-center gap-2 py-10 text-destructive'>
            <AlertCircle size={28} className='opacity-50' />
            <p className='text-sm'>
              {t('common.errorLoading', 'Failed to load badges')}
            </p>
          </div>
        ) : list.length === 0 ? (
          <div className='flex flex-col items-center gap-3 py-14 text-muted-foreground'>
            <Award size={32} className='opacity-30' />
            <p className='text-sm font-medium'>
              {filter === 'earned'
                ? t(
                    'badges.noneEarned',
                    'No badges earned yet — complete labs and courses!',
                  )
                : t('badges.noneFound', 'No badges in this category')}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6'>
            {list.map((badge, i) => (
              <BadgeItem key={badge.id} badge={badge} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
