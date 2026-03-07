// src/features/profile/components/profile-badges/profile-badges-section.tsx
import { useState } from 'react';
import { ShieldCheck, ShieldOff, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BadgeCard } from './badge-card';
import {
  BADGE_REGISTRY,
  TIER_DESIGNS,
  ALL_BADGE_SLUGS,
} from '@/features/badges/constants/badge-registry';
import type { UserBadge } from '../../types/profile.types';
import type { BadgeCategory } from '@/features/badges/types/badge.types';

const TAB_KEYS: Array<BadgeCategory | 'all'> = [
  'all',
  'learning',
  'labs',
  'paths',
  'streak',
  'xp',
  'leaderboard',
  'special',
];

interface ProfileBadgesSectionProps {
  badges: UserBadge[];
  /** When false (profile page), only earned badges are shown. Default: true */
  showLocked?: boolean;
}

export function ProfileBadgesSection({
  badges,
  showLocked = true,
}: ProfileBadgesSectionProps) {
  const { t, i18n } = useTranslation('profile');
  const isAr = i18n.language === 'ar';
  const [tab, setTab] = useState<BadgeCategory | 'all'>('all');

  const earnedSlugs = new Set(badges.map((b) => b.badge.slug ?? ''));

  const earnedFiltered = badges.filter((b) => {
    const cfg = b.badge.slug ? BADGE_REGISTRY[b.badge.slug] : null;
    return tab === 'all' || cfg?.category === tab;
  });

  const lockedFiltered = showLocked
    ? ALL_BADGE_SLUGS.filter((slug) => !earnedSlugs.has(slug))
        .filter(
          (slug) => tab === 'all' || BADGE_REGISTRY[slug]?.category === tab,
        )
        .map(
          (slug) =>
            ({
              id: `locked-${slug}`,
              awardedAt: '',
              badge: {
                slug,
                title: BADGE_REGISTRY[slug]?.label_en ?? slug,
                ar_title: BADGE_REGISTRY[slug]?.label_ar ?? slug,
                type: 'CUSTOM' as const,
                xpReward: 0,
              },
            }) satisfies UserBadge,
        )
    : [];

  const hasAny = earnedFiltered.length > 0 || lockedFiltered.length > 0;

  return (
    <section className='space-y-4'>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <ShieldCheck className='h-5 w-5 text-primary' />
          <h2 className='text-base font-bold text-foreground'>
            {t('badges')}
          </h2>
          {badges.length > 0 && (
            <span className='rounded-full border border-primary/20 bg-primary/10 px-2 py-px text-xs font-bold text-primary'>
              {badges.length}
            </span>
          )}
        </div>

        {/* Tier legend — only shown when earned badges exist */}
        {badges.length > 0 && (
          <div className='hidden items-center gap-3 sm:flex'>
            {Object.entries(TIER_DESIGNS).map(([tier, d]) => (
              <span
                key={tier}
                className={cn(
                  'text-[9px] font-black uppercase tracking-wider',
                  d.iconColor,
                )}>
                {isAr ? d.label_ar : d.label_en}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Category tabs ─────────────────────────────────────────────── */}
      <div className='flex flex-wrap gap-1.5'>
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
              tab === key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
            )}>
            {t(`badgeTabs.${key}`)}
          </button>
        ))}
      </div>

      {/* ── Grid / Empty state ──────────────────────────────────────────── */}
      {!hasAny ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/20 bg-primary/[0.03] py-14 text-center'>
          {/* icon */}
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10'>
            {showLocked ? (
              <ShieldOff className='h-5 w-5 text-muted-foreground/50' />
            ) : (
              <Sparkles className='h-5 w-5 text-primary/60' />
            )}
          </div>

          {showLocked ? (
            // No badges in selected tab category
            <>
              <p className='text-sm text-muted-foreground'>
                {t('badgeEmpty.title')}
              </p>
              <p className='max-w-xs text-xs leading-relaxed text-muted-foreground/60'>
                {t('badgeEmpty.subtitle')}
              </p>
            </>
          ) : (
            // Earned-only mode — user hasn’t earned any yet
            <>
              <p className='text-sm font-semibold text-foreground/70'>
                No badges earned yet
              </p>
              <p className='max-w-xs text-xs leading-relaxed text-muted-foreground'>
                Complete labs, courses, and streaks to earn your first badge!
              </p>
              <span className='rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary'>
                🏆 Start earning
              </span>
            </>
          )}
        </motion.div>
      ) : (
        <div className='flex flex-wrap gap-4'>
          {/* Earned badges */}
          {earnedFiltered.map((badge, i) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              delay={i * 0.04}
              size='md'
              locked={false}
            />
          ))}
          {/* Locked badges (only when showLocked=true) */}
          {lockedFiltered.map((badge, i) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              delay={earnedFiltered.length * 0.04 + i * 0.02}
              size='md'
              locked
            />
          ))}
        </div>
      )}
    </section>
  );
}
