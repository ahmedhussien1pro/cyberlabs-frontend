// src/features/profile/components/profile-achievements/profile-achievements-section.tsx
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Lock, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { UserAchievement } from '../../types/profile.types';

const CATEGORY_STYLE: Record<string, string> = {
  COURSE_COMPLETION: 'bg-blue-500/10   text-blue-500   border-blue-500/20',
  LAB_SOLVED:        'bg-primary/10    text-primary    border-primary/20',
  STREAK:            'bg-orange-500/10 text-orange-500 border-orange-500/20',
  COMMUNITY:         'bg-purple-500/10 text-purple-500 border-purple-500/20',
  CONTRIBUTION:      'bg-cyan-500/10   text-cyan-500   border-cyan-500/20',
  CUSTOM:            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

interface Props {
  achievements: UserAchievement[];
}

export function ProfileAchievementsSection({ achievements }: Props) {
  const { t } = useTranslation('profile');

  // ── Coming Soon empty state ────────────────────────────────────────
  if (!achievements.length) {
    return (
      <section className='space-y-3'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <Trophy className='h-4 w-4 text-yellow-500' />
          {t('achievements.title')}
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-yellow-500/20 bg-yellow-500/[0.03] py-10 text-center'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10'>
            <Rocket className='h-5 w-5 text-yellow-500/70' />
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-semibold text-foreground/70'>Achievements</p>
            <p className='max-w-xs text-xs leading-relaxed text-muted-foreground'>
              Complete labs, courses, and streaks to unlock achievements.
            </p>
          </div>
          <span className='rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold text-yellow-600 dark:text-yellow-400'>
            🚀 Coming Soon
          </span>
        </motion.div>
      </section>
    );
  }

  const achieved = achievements.filter((a) => !!a.achievedAt);
  const inProgress = achievements.filter(
    (a) => !a.achievedAt && a.progress != null,
  );
  const locked = achievements
    .filter((a) => !a.achievedAt && a.progress == null)
    .slice(0, 3);

  return (
    <section className='space-y-3'>
      <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
        <Trophy className='h-4 w-4 text-yellow-500' />
        {t('achievements.title')}
        <span className='rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-500'>
          {achieved.length}/{achievements.length}
        </span>
      </h2>

      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {achieved.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className='flex items-start gap-3 rounded-xl border border-border/40 bg-card p-3 transition-all hover:border-primary/20'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-500/10'>
              {item.achievement.iconUrl ? (
                <img src={item.achievement.iconUrl} alt='' className='h-5 w-5' />
              ) : (
                <Sparkles className='h-4 w-4 text-yellow-500' />
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold text-foreground'>
                {item.achievement.title}
              </p>
              {item.achievement.description && (
                <p className='mt-0.5 line-clamp-1 text-[11px] text-muted-foreground'>
                  {item.achievement.description}
                </p>
              )}
              <div className='mt-1.5 flex flex-wrap items-center gap-1.5'>
                <Badge
                  variant='outline'
                  className={cn(
                    'border text-[10px]',
                    CATEGORY_STYLE[item.achievement.category] ??
                      CATEGORY_STYLE.CUSTOM,
                  )}>
                  {t(
                    `achievements.categories.${item.achievement.category}`,
                    item.achievement.category.replace(/_/g, ' '),
                  )}
                </Badge>
                <span className='text-[10px] font-semibold text-primary'>
                  +{item.achievement.xpReward} XP
                </span>
                {item.achievedAt && (
                  <span className='text-[10px] text-muted-foreground'>
                    {new Date(item.achievedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {inProgress.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (achieved.length + i) * 0.04 }}
            className='flex items-start gap-3 rounded-xl border border-border/30 bg-card p-3 opacity-70'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted'>
              {item.achievement.iconUrl ? (
                <img src={item.achievement.iconUrl} alt='' className='h-5 w-5 opacity-50' />
              ) : (
                <Sparkles className='h-4 w-4 text-muted-foreground' />
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold text-muted-foreground'>
                {item.achievement.title}
              </p>
              <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted'>
                <motion.div
                  className='h-full rounded-full bg-primary/40'
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 0.8, delay: (achieved.length + i) * 0.04 + 0.2 }}
                />
              </div>
              <p className='mt-0.5 text-right text-[10px] text-muted-foreground'>
                {item.progress}%
              </p>
            </div>
          </motion.div>
        ))}

        {locked.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (achieved.length + inProgress.length + i) * 0.04 }}
            className='flex items-start gap-3 rounded-xl border border-dashed border-border/30 bg-muted/10 p-3 opacity-40 select-none'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted'>
              <Lock className='h-4 w-4 text-muted-foreground' />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold text-muted-foreground'>
                {item.achievement.title}
              </p>
              <p className='mt-0.5 text-[11px] text-muted-foreground'>
                {t('achievements.locked')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
