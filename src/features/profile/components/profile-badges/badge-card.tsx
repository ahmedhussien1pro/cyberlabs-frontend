// src/features/profile/components/profile-badges/badge-card.tsx
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getBadgeConfig,
  TIER_DESIGNS,
} from '@/features/badges/constants/badge-registry';
import type { UserBadge } from '../../types/profile.types';

const HEX = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)';

interface BadgeCardProps {
  badge: UserBadge;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  locked?: boolean;
}

const SIZES = {
  sm: {
    wrap: 'w-12 h-[54px]',
    icon: 'h-4 w-4',
    label: 'text-[9px]',
    xp: false,
  },
  md: {
    wrap: 'w-16 h-[72px]',
    icon: 'h-5 w-5',
    label: 'text-[10px]',
    xp: true,
  },
  lg: { wrap: 'w-20 h-[90px]', icon: 'h-6 w-6', label: 'text-xs', xp: true },
};

export function BadgeCard({
  badge,
  delay = 0,
  size = 'md',
  locked = false,
}: BadgeCardProps) {
  const { t, i18n } = useTranslation('profile');
  const isAr = i18n.language === 'ar';

  const slug = badge.badge.slug ?? '';
  const config = getBadgeConfig(slug);
  const design = TIER_DESIGNS[config.tier];
  const sz = SIZES[size];

  const title = isAr
    ? (badge.badge.ar_title ?? config.label_ar ?? badge.badge.title)
    : (badge.badge.title ?? config.label_en);

  const desc = isAr
    ? (badge.badge.ar_description ?? config.desc_ar ?? '')
    : (badge.badge.description ?? config.desc_en ?? '');

  const Icon = config.icon;

  const hexagon = (
    <div
      className={cn(
        sz.wrap,
        'relative flex items-center justify-center',
        'bg-gradient-to-b',
        design.bg,
        locked && 'opacity-35 grayscale',
      )}
      style={{ clipPath: HEX }}>
      {!locked &&
        (config.tier === 'GOLD' ||
          config.tier === 'PLATINUM' ||
          config.tier === 'DIAMOND') && (
          <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/15 via-white/5 to-transparent' />
        )}
      {!locked && config.tier === 'DIAMOND' && (
        <div
          className='absolute inset-0 animate-pulse opacity-20'
          style={{
            clipPath: HEX,
            background:
              'linear-gradient(135deg, rgba(167,139,250,0.5), transparent)',
          }}
        />
      )}
      {locked ? (
        <Lock className={cn(sz.icon, 'text-zinc-500')} />
      ) : (
        <Icon
          className={cn(
            sz.icon,
            design.iconColor,
            'drop-shadow-sm relative z-10',
          )}
        />
      )}
    </div>
  );

  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, type: 'spring', stiffness: 220, damping: 18 }}
            className='group flex flex-col items-center gap-1.5 cursor-default select-none'>
            <div
              className={cn(
                'relative rounded-sm ring-2 ring-transparent transition-all duration-300',
                !locked &&
                  cn(
                    design.ring,
                    'group-hover:ring-offset-1 group-hover:ring-offset-background',
                    `group-hover:shadow-lg group-hover:${design.glowColor}`,
                  ),
              )}
              style={{ clipPath: HEX }}>
              {hexagon}
            </div>

            <div className='text-center max-w-[72px]'>
              <p
                className={cn(
                  sz.label,
                  'font-semibold text-foreground leading-tight line-clamp-2',
                )}>
                {locked ? '???' : title}
              </p>
              {sz.xp && !locked && badge.badge.xpReward > 0 && (
                <p className='text-[9px] text-primary/70 font-bold mt-px'>
                  +{badge.badge.xpReward} XP
                </p>
              )}
            </div>

            {!locked && size !== 'sm' && (
              <span
                className={cn(
                  'text-[8px] font-black uppercase tracking-widest px-1.5 py-px rounded-sm',
                  'bg-black/60 border',
                  config.tier === 'BRONZE' &&
                    'border-amber-600/40  text-amber-400',
                  config.tier === 'SILVER' &&
                    'border-zinc-400/40   text-zinc-300',
                  config.tier === 'GOLD' &&
                    'border-yellow-500/40 text-yellow-300',
                  config.tier === 'PLATINUM' &&
                    'border-cyan-400/40   text-cyan-200',
                  config.tier === 'DIAMOND' &&
                    'border-violet-400/50 text-violet-200',
                )}>
                {isAr ? design.label_ar : design.label_en}
              </span>
            )}
          </motion.div>
        </TooltipTrigger>

        <TooltipContent
          side='top'
          className='max-w-[200px] text-center space-y-1 p-3'>
          <p className='font-bold text-sm'>
            {locked ? t('badgeLocked') : title}
          </p>
          {!locked && desc && (
            <p className='text-xs text-muted-foreground leading-relaxed'>
              {desc}
            </p>
          )}
          {!locked && badge.awardedAt && (
            <p className='text-[10px] text-muted-foreground/60'>
              {t('badgeEarnedAt')}{' '}
              {new Date(badge.awardedAt).toLocaleDateString(
                isAr ? 'ar-EG' : 'en-US',
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                },
              )}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
