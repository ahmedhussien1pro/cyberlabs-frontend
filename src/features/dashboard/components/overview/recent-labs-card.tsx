import { FlaskConical, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserLabs } from '@/shared/hooks/use-user-data';
import { ROUTES } from '@/shared/constants';

const DIFF: Record<string, string> = {
  EASY: 'text-green-500  border-green-500/30  bg-green-500/5',
  MEDIUM: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5',
  HARD: 'text-red-500    border-red-500/30    bg-red-500/5',
};

export function RecentLabsCard() {
  const { t, i18n } = useTranslation('dashboard');
  const isAr = i18n.language === 'ar';
  const { data, isLoading } = useUserLabs();
  const recent = data?.slice(0, 5) ?? [];

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-primary' />
          {t('overview.recentLabs')}
        </h2>
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='h-7 gap-1 text-xs text-muted-foreground'>
          <Link to={ROUTES.DASHBOARD.LabsPage}>
            {t('overview.viewAll')} <ChevronRight size={12} />
          </Link>
        </Button>
      </div>

      <div className='divide-y divide-border/30 rounded-xl border border-border/40 bg-card'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3 p-3'>
              <Skeleton className='h-8 w-8 shrink-0 rounded-lg' />
              <div className='flex-1 space-y-1.5'>
                <Skeleton className='h-3.5 w-2/3' />
                <Skeleton className='h-3 w-1/3' />
              </div>
            </div>
          ))
        ) : recent.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <FlaskConical size={28} className='opacity-40' />
            <p className='text-sm'>{t('overview.noLabsYet')}</p>
            <Button asChild variant='outline' size='sm' className='mt-1'>
              <Link to={ROUTES.LABS.LIST}>{t('overview.exploreLabs')}</Link>
            </Button>
          </div>
        ) : (
          recent.map((entry) => {
            const title = isAr
              ? (entry.lab.ar_title ?? entry.lab.title)
              : entry.lab.title;
            const diff = DIFF[entry.lab.difficulty] ?? 'text-muted-foreground';
            return (
              <div key={entry.id} className='flex items-center gap-3 p-3'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                  <FlaskConical size={15} className='text-primary' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{title}</p>
                  <div className='mt-0.5 flex items-center gap-1.5'>
                    <Badge
                      variant='outline'
                      className={`border px-1.5 py-0 text-[10px] ${diff}`}>
                      {entry.lab.difficulty}
                    </Badge>
                    <span className='text-[10px] text-muted-foreground'>
                      +{entry.lab.xpReward} XP
                    </span>
                  </div>
                </div>
                <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10'>
                  <Check size={12} className='text-green-500' />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
