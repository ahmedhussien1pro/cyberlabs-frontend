import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLeaderboard } from '../../hooks/use-dashboard-data';
import { ROUTES } from '@/shared/constants';

const RANK_STYLE: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-slate-400',
  3: 'text-amber-600',
};

export function LeaderboardWidget() {
  const { t } = useTranslation('dashboard');
  const { data, isLoading } = useLeaderboard();
  const top5 = data?.slice(0, 5) ?? [];

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-yellow-400' />
          {t('leaderboard.title')}
        </h2>
        <Link
          to={ROUTES.DASHBOARD.CommunityPage}
          className='text-xs text-muted-foreground hover:text-foreground'>
          {t('overview.viewAll')}
        </Link>
      </div>

      <div className='divide-y divide-border/30 rounded-xl border border-border/40 bg-card'>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3 p-3'>
              <Skeleton className='h-4 w-4' />
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-3.5 flex-1' />
              <Skeleton className='h-3.5 w-16' />
            </div>
          ))
        ) : top5.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <Trophy size={28} className='opacity-30' />
            <p className='text-sm'>{t('leaderboard.empty')}</p>
          </div>
        ) : (
          top5.map((entry) => (
            <div
              key={entry.id}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5',
                entry.isCurrentUser && 'bg-primary/5',
              )}>
              <span
                className={cn(
                  'w-5 shrink-0 text-center text-sm font-black',
                  RANK_STYLE[entry.rank] ?? 'text-muted-foreground',
                )}>
                {entry.rank}
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
                  <span className='ml-1.5 text-[10px] font-normal text-muted-foreground'>
                    (you)
                  </span>
                )}
              </span>

              <div className='flex items-center gap-1.5 shrink-0'>
                <Badge
                  variant='outline'
                  className='border-primary/20 bg-primary/5 font-mono text-[10px] text-primary'>
                  Lv {entry.level}
                </Badge>
                <span className='font-mono text-xs text-muted-foreground'>
                  {entry.totalXP.toLocaleString()} XP
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
