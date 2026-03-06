// src/features/dashboard/components/overview/leaderboard-widget.tsx
import { Trophy, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLeaderboard } from '../../hooks/use-dashboard-data';
import { ROUTES } from '@/shared/constants';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const RANK_STYLE: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-slate-400',
  3: 'text-amber-600',
};

export function LeaderboardWidget() {
  const { t } = useTranslation('dashboard');
  // ✅ Fix: destructure isError to handle API failure state
  const { data, isLoading, isError } = useLeaderboard();
  const top5 = data?.slice(0, 5) ?? [];

  const currentUser = data?.find((e) => e.isCurrentUser);
  const currentUserInTop5 = top5.some((e) => e.isCurrentUser);
  const showCurrentUserRow =
    currentUser && !currentUserInTop5 && currentUser.rank > 5;

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-yellow-400' />
          {t('leaderboard.title')}
        </h2>
        <Link
          to={ROUTES.DASHBOARD.CommunityPage}
          className='text-xs text-muted-foreground hover:text-foreground transition-colors'>
          {t('overview.viewAll')}
        </Link>
      </div>

      <div className='overflow-hidden divide-y divide-border/30 rounded-xl border border-border/40 bg-card'>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3 p-3'>
              <Skeleton className='h-5 w-5 rounded' />
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-3.5 flex-1' />
              <Skeleton className='h-3.5 w-16' />
            </div>
          ))
        ) : isError ? (
          // ✅ Fix: show error state instead of blank screen
          <div className='flex flex-col items-center gap-2 py-8 text-destructive'>
            <AlertCircle size={28} className='opacity-50' />
            <p className='text-sm'>{t('common.errorLoading', 'Failed to load data')}</p>
          </div>
        ) : top5.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <Trophy size={28} className='opacity-30' />
            <p className='text-sm'>{t('leaderboard.empty')}</p>
          </div>
        ) : (
          <>
            {top5.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 transition-colors',
                  entry.isCurrentUser ? 'bg-primary/5' : 'hover:bg-muted/20',
                )}>
                <span
                  className={cn(
                    'w-6 shrink-0 text-center text-sm font-black',
                    RANK_STYLE[entry.rank] ?? 'text-muted-foreground',
                  )}>
                  {MEDAL[entry.rank] ?? entry.rank}
                </span>

                <Avatar className='h-8 w-8 shrink-0'>
                  <AvatarImage src={entry.avatarUrl} />
                  <AvatarFallback className='bg-primary/10 text-[10px] font-bold text-primary'>
                    {entry.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <span
                  className={cn(
                    'flex-1 truncate text-sm',
                    entry.isCurrentUser
                      ? 'font-bold text-primary'
                      : 'font-medium',
                  )}>
                  {entry.name}
                  {entry.isCurrentUser && (
                    // ✅ Fix: was hardcoded "(you)" — now translated
                    <span className='ms-1.5 text-[10px] font-normal text-muted-foreground'>
                      ({t('leaderboard.you', 'you')})
                    </span>
                  )}
                </span>

                <div className='flex shrink-0 items-center gap-2'>
                  <Badge
                    variant='outline'
                    className='border-primary/20 bg-primary/5 font-mono text-[10px] text-primary'>
                    Lv {entry.level}
                  </Badge>
                  <span className='w-20 text-right font-mono text-xs text-muted-foreground'>
                    {entry.totalXP.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            {/* Current user rank — outside top 5 */}
            {showCurrentUserRow && currentUser && (
              <>
                <div className='flex items-center justify-center py-1'>
                  <span className='text-[10px] text-muted-foreground tracking-widest'>
                    • • •
                  </span>
                </div>
                <div className='flex items-center gap-3 bg-primary/5 px-3 py-2.5'>
                  <span className='w-6 shrink-0 text-center text-sm font-bold text-muted-foreground'>
                    {currentUser.rank}
                  </span>
                  <Avatar className='h-8 w-8 shrink-0'>
                    <AvatarImage src={currentUser.avatarUrl} />
                    <AvatarFallback className='bg-primary/10 text-[10px] font-bold text-primary'>
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className='flex-1 truncate text-sm font-bold text-primary'>
                    {currentUser.name}
                    {/* ✅ Fix: was hardcoded "(you)" — now translated */}
                    <span className='ms-1.5 text-[10px] font-normal text-muted-foreground'>
                      ({t('leaderboard.you', 'you')})
                    </span>
                  </span>
                  <div className='flex shrink-0 items-center gap-2'>
                    <Badge
                      variant='outline'
                      className='border-primary/20 bg-primary/5 font-mono text-[10px] text-primary'>
                      Lv {currentUser.level}
                    </Badge>
                    <span className='w-20 text-right font-mono text-xs text-muted-foreground'>
                      {currentUser.totalXP.toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
