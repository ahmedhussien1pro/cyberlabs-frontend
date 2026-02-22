import { useTranslation } from 'react-i18next';
import { MessageSquare, Swords, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ComingSoonBanner } from '@/shared/components/common/coming-soon-banner';
import { useLeaderboard } from '../hooks/use-dashboard-data';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
const RANK_STYLE: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-slate-400',
  3: 'text-amber-600',
};

export default function CommunityPage(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { data, isLoading } = useLeaderboard();
  const myEntry = data?.find((e) => e.isCurrentUser);

  return (
    <div className='container max-w-4xl space-y-6 py-6'>
      {/* ── Header ──────────────────────────────────── */}
      <div>
        <h1 className='text-xl font-black tracking-tight'>
          {t('community.title')}
        </h1>
        <p className='mt-0.5 text-sm text-muted-foreground'>
          {t('community.subtitle')}
        </p>
      </div>

      {/* ── Your Rank Banner ────────────────────────── */}
      {myEntry && (
        <div
          className='flex items-center gap-4 rounded-xl border border-primary/30
                        bg-primary/5 p-4'>
          <div
            className='flex h-12 w-12 shrink-0 items-center justify-center
                          rounded-full bg-primary/10 text-2xl font-black'>
            {MEDAL[myEntry.rank] ?? `#${myEntry.rank}`}
          </div>
          <div className='flex-1'>
            <p className='text-sm font-bold'>{t('community.yourRank')}</p>
            <p className='text-xs text-muted-foreground'>
              {myEntry.totalXP.toLocaleString()} XP · {t('leaderboard.level')}{' '}
              {myEntry.level}
            </p>
          </div>
          {data && (
            <Badge
              variant='outline'
              className='shrink-0 border-primary/30 bg-primary/10 text-primary'>
              Top {Math.ceil((myEntry.rank / data.length) * 100)}%
            </Badge>
          )}
        </div>
      )}

      {/* ── Full Leaderboard ────────────────────────── */}
      <section className='space-y-3'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-yellow-400' />
          {t('leaderboard.title')}
        </h2>

        <div
          className='divide-y divide-border/30 overflow-hidden
                        rounded-xl border border-border/40 bg-card'>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className='flex items-center gap-3 p-3'>
                <Skeleton className='h-4 w-5' />
                <Skeleton className='h-8 w-8 rounded-full' />
                <Skeleton className='h-3.5 flex-1' />
                <Skeleton className='h-3.5 w-20' />
              </div>
            ))
          ) : !data?.length ? (
            <div className='flex items-center justify-center py-10 text-sm text-muted-foreground'>
              {t('leaderboard.empty')}
            </div>
          ) : (
            data.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 transition-colors',
                  entry.isCurrentUser
                    ? 'bg-primary/5 hover:bg-primary/8'
                    : 'hover:bg-muted/20',
                )}>
                {/* Rank */}
                <span
                  className={cn(
                    'w-7 shrink-0 text-center text-sm font-semibold',
                    RANK_STYLE[entry.rank] ?? 'text-muted-foreground',
                  )}>
                  {MEDAL[entry.rank] ?? entry.rank}
                </span>

                {/* Avatar */}
                <Avatar className='h-8 w-8 shrink-0'>
                  <AvatarImage src={entry.avatarUrl} />
                  <AvatarFallback className='bg-primary/10 text-[10px] font-bold text-primary'>
                    {entry.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Name */}
                <span
                  className={cn(
                    'flex-1 truncate text-sm',
                    entry.isCurrentUser
                      ? 'font-bold text-primary'
                      : 'font-medium',
                  )}>
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className='ms-1 text-[10px] font-normal text-muted-foreground'>
                      ({t('community.you')})
                    </span>
                  )}
                </span>

                {/* Level + XP */}
                <div className='flex shrink-0 items-center gap-2'>
                  <Badge
                    variant='outline'
                    className='border-primary/20 bg-primary/5 font-mono text-[10px] text-primary'>
                    Lv {entry.level}
                  </Badge>
                  <span className='w-24 text-right font-mono text-xs text-muted-foreground'>
                    {entry.totalXP.toLocaleString()} XP
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Coming Soon ─────────────────────────────── */}
      <div className='grid gap-3 sm:grid-cols-3'>
        <ComingSoonBanner
          icon={<Swords size={15} className='text-primary' />}
          title={t('community.cs.challengesTitle')}
          description={t('community.cs.challengesDesc')}
        />
        <ComingSoonBanner
          icon={<MessageSquare size={15} className='text-primary' />}
          title={t('community.cs.forumTitle')}
          description={t('community.cs.forumDesc')}
        />
        <ComingSoonBanner
          icon={<Users size={15} className='text-primary' />}
          title={t('community.cs.buddyTitle')}
          description={t('community.cs.buddyDesc')}
        />
      </div>
    </div>
  );
}
