// src/features/profile/components/profile-achievements/profile-achievements-section.tsx
import { useState } from 'react';
import { Trophy, BookOpen, Users, Flag, Star, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfileAchievements, type AchievementItem } from '../../hooks/use-profile-achievements';

// ── Category metadata ────────────────────────────────────────
type IconFC = React.FC<{ className?: string }>;
const CATS: Record<string, { Icon: IconFC; color: string; bg: string }> = {
  LEARNING:    { Icon: BookOpen as IconFC, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  COMMUNITY:   { Icon: Users as IconFC,    color: 'text-blue-500',    bg: 'bg-blue-500/10' },
  COMPETITION: { Icon: Trophy as IconFC,   color: 'text-amber-500',   bg: 'bg-amber-500/10' },
  MILESTONE:   { Icon: Flag as IconFC,     color: 'text-violet-500',  bg: 'bg-violet-500/10' },
  CUSTOM:      { Icon: Star as IconFC,     color: 'text-pink-500',    bg: 'bg-pink-500/10' },
};
const DEFAULT_CAT = { Icon: Star as IconFC, color: 'text-pink-500', bg: 'bg-pink-500/10' };

type Tab = 'all' | 'completed' | 'in-progress';

// ── Component ────────────────────────────────────────────────────────
export function ProfileAchievementsSection() {
  const { i18n } = useTranslation('profile');
  const isAr = i18n.language === 'ar';
  const [tab, setTab] = useState<Tab>('all');
  const { data: items = [], isLoading } = useProfileAchievements();

  if (isLoading) return <AchievementsSkeleton />;
  if (items.length === 0) return <EmptyAchievements isAr={isAr} />;

  const completedCount = items.filter((i) => i.achievedAt !== null).length;
  const filtered =
    tab === 'completed'   ? items.filter((i) => i.achievedAt !== null) :
    tab === 'in-progress' ? items.filter((i) => i.achievedAt === null) :
    items;

  const TABS: { key: Tab; label: string; ar: string }[] = [
    { key: 'all',         label: 'All',         ar: 'الكل' },
    { key: 'completed',   label: 'Completed',   ar: 'مكتمل' },
    { key: 'in-progress', label: 'In Progress', ar: 'جاري' },
  ];

  return (
    <section className='space-y-4'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <Trophy className='h-5 w-5 text-amber-500' />
          <h2 className='text-base font-bold text-foreground'>
            {isAr ? 'الإنجازات' : 'Achievements'}
          </h2>
          {completedCount > 0 && (
            <span className='rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-px text-xs font-bold text-amber-500'>
              {completedCount}
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className='flex gap-1'>
          {TABS.map(({ key, label, ar }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
                tab === key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {isAr ? ar : label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className='grid gap-3 sm:grid-cols-2'>
        {filtered.map((item, i) => (
          <AchievementCard key={item.id} item={item} isAr={isAr} delay={i * 0.04} />
        ))}
      </div>
    </section>
  );
}

// ── Achievement Card ────────────────────────────────────────────────
function AchievementCard({
  item, isAr, delay,
}: {
  item: AchievementItem;
  isAr: boolean;
  delay: number;
}) {
  const cat = CATS[item.achievement.category] ?? DEFAULT_CAT;
  const { Icon } = cat;
  const isCompleted = item.achievedAt !== null;
  const title = isAr ? (item.achievement.ar_title ?? item.achievement.title) : item.achievement.title;
  const desc  = isAr ? (item.achievement.ar_description ?? item.achievement.description) : item.achievement.description;
  const pct   = item.progress != null ? Math.round(item.progress * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay }}
      className={cn(
        'flex gap-3 rounded-xl border p-3 transition-all duration-200',
        isCompleted
          ? 'border-amber-500/20 bg-amber-500/[0.04]'
          : 'border-border/40 bg-card/60',
        'hover:border-primary/30 hover:shadow-sm',
      )}
    >
      {/* Category icon */}
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', cat.bg)}>
        {item.achievement.iconUrl ? (
          <img src={item.achievement.iconUrl} alt='' className='h-6 w-6 object-contain' />
        ) : (
          <Icon className={cn('h-5 w-5', cat.color)} />
        )}
      </div>

      {/* Content */}
      <div className='min-w-0 flex-1'>
        {/* Title row */}
        <div className='flex items-start justify-between gap-1'>
          <p className='line-clamp-1 text-sm font-semibold leading-tight text-foreground'>
            {title}
          </p>
          {isCompleted ? (
            <CheckCircle2 className='h-4 w-4 shrink-0 text-amber-500' />
          ) : (
            <Clock className='h-4 w-4 shrink-0 text-muted-foreground/40' />
          )}
        </div>

        {/* Description */}
        {desc && (
          <p className='mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground'>{desc}</p>
        )}

        {/* Footer: XP + date / progress */}
        <div className='mt-2 flex items-center gap-2'>
          {item.achievement.xpReward > 0 && (
            <span className='rounded-full bg-primary/10 px-2 py-px text-[9px] font-bold text-primary'>
              +{item.achievement.xpReward} XP
            </span>
          )}

          {isCompleted ? (
            <span className='text-[10px] text-muted-foreground'>
              {new Date(item.achievedAt!).toLocaleDateString(
                isAr ? 'ar-EG' : 'en-US',
                { year: 'numeric', month: 'short' },
              )}
            </span>
          ) : pct > 0 ? (
            <div className='flex flex-1 items-center gap-1.5'>
              <div className='h-1 flex-1 overflow-hidden rounded-full bg-muted/60'>
                <div className='h-full rounded-full bg-primary/60' style={{ width: `${pct}%` }} />
              </div>
              <span className='text-[9px] text-muted-foreground'>{pct}%</span>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────
function EmptyAchievements({ isAr }: { isAr: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-amber-500/20 bg-amber-500/[0.03] py-12 text-center'
    >
      <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10'>
        <Sparkles className='h-5 w-5 text-amber-500/60' />
      </div>
      <p className='text-sm font-semibold text-foreground/70'>
        {isAr ? 'لا توجد إنجازات بعد' : 'No achievements yet'}
      </p>
      <p className='max-w-xs text-xs leading-relaxed text-muted-foreground'>
        {isAr
          ? 'أتمّ المختبرات والكورسات وحافظ على سلسلتك لتفتح الإنجازات.'
          : 'Complete labs, courses, and streaks to unlock achievements!'}
      </p>
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function AchievementsSkeleton() {
  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-6 w-36' />
        <div className='flex gap-1'>
          {[1, 2, 3].map((i) => <Skeleton key={i} className='h-7 w-20 rounded-full' />)}
        </div>
      </div>
      <div className='grid gap-3 sm:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-xl' />
        ))}
      </div>
    </section>
  );
}
