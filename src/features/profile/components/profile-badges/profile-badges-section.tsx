// src/features/profile/components/profile-badges/profile-badges-section.tsx
import { useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
      {/* ── Header ── */}
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <ShieldCheck className='h-5 w-5 text-primary' />
          <h2 className='font-bold text-base text-foreground'>{t('badges')}</h2>
          {badges.length > 0 && (
            <span className='text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-px'>
              {badges.length}
            </span>
          )}
        </div>

        {/* Tier legend */}
        <div className='hidden sm:flex items-center gap-3'>
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
      </div>

      {/* ── Category Tabs ── */}
      <div className='flex gap-1.5 flex-wrap'>
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'text-xs px-3 py-1 rounded-full font-medium transition-all duration-200',
              tab === key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
            )}>
            {t(`badgeTabs.${key}`)}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {!hasAny ? (
        <div className='flex flex-col items-center gap-3 py-14 text-center rounded-xl border border-dashed border-border/50 bg-muted/10'>
          <div className='h-12 w-12 rounded-2xl bg-muted flex items-center justify-center border border-border/40'>
            <Lock className='h-5 w-5 text-muted-foreground/50' />
          </div>
          <p className='text-sm text-muted-foreground'>
            {t('badgeEmpty.title')}
          </p>
          <p className='text-xs text-muted-foreground/60 max-w-xs leading-relaxed'>
            {t('badgeEmpty.subtitle')}
          </p>
        </div>
      ) : (
        <div className='flex flex-wrap gap-4'>
          {earnedFiltered.map((badge, i) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              delay={i * 0.04}
              size='md'
              locked={false}
            />
          ))}
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
