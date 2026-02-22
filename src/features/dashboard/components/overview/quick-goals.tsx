import { Target, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyGoals } from '../../hooks/use-dashboard-data';
import { ROUTES } from '@/shared/constants';

const CATEGORY_COLOR: Record<string, string> = {
  labs: 'bg-primary/10    text-primary',
  courses: 'bg-blue-500/10  text-blue-500',
  xp: 'bg-yellow-500/10 text-yellow-500',
  streak: 'bg-orange-500/10 text-orange-500',
  custom: 'bg-purple-500/10 text-purple-500',
};

export function QuickGoals() {
  const { t } = useTranslation('dashboard');
  const { data, isLoading } = useMyGoals();
  const active = data?.filter((g) => !g.isCompleted).slice(0, 3) ?? [];

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-purple-400' />
          {t('goals.title')}
        </h2>
        <div className='flex items-center gap-1'>
          <Button
            asChild
            variant='ghost'
            size='sm'
            className='h-7 gap-1 text-xs text-muted-foreground'>
            <Link to={ROUTES.DASHBOARD.GoalsPage}>
              {t('overview.viewAll')} <ChevronRight size={12} />
            </Link>
          </Button>
        </div>
      </div>

      <div className='divide-y divide-border/30 rounded-xl border border-border/40 bg-card'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='space-y-2 p-3'>
              <Skeleton className='h-3.5 w-2/3' />
              <Skeleton className='h-1.5 w-full rounded-full' />
            </div>
          ))
        ) : active.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <Target size={28} className='opacity-30' />
            <p className='text-sm'>{t('goals.noGoals')}</p>
            <Button asChild variant='outline' size='sm' className='mt-1 gap-1'>
              <Link to={ROUTES.DASHBOARD.GoalsPage}>
                <Plus size={13} />
                {t('goals.createGoal')}
              </Link>
            </Button>
          </div>
        ) : (
          active.map((goal) => {
            const pct = Math.min(
              (goal.currentValue / goal.targetValue) * 100,
              100,
            );
            const color =
              CATEGORY_COLOR[goal.category] ?? CATEGORY_COLOR.custom;
            return (
              <div key={goal.id} className='space-y-2 p-3'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='truncate text-sm font-medium'>{goal.title}</p>
                  <div className='flex shrink-0 items-center gap-1.5'>
                    <Badge className={`border-0 text-[10px] ${color}`}>
                      {goal.category}
                    </Badge>
                    <span className='font-mono text-[10px] text-muted-foreground'>
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                </div>
                <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-purple-500 to-primary transition-all'
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
