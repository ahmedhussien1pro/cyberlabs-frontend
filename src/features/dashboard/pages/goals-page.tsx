import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Plus, Repeat, Target, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ComingSoonBanner } from '@/shared/components/common/coming-soon-banner';
import {
  useMyGoals,
  useDeleteGoal,
  useCompleteGoal,
} from '../hooks/use-goals-data';
import { GoalCard } from '../components/goals/goal-card';
import { CreateGoalDialog } from '../components/goals/create-goal-dialog';

export default function GoalsPage(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const [createOpen, setCreateOpen] = useState(false);
  // ✅ Fix: destructure isError
  const { data, isLoading, isError } = useMyGoals();
  const del = useDeleteGoal();
  const complete = useCompleteGoal();

  const active = data?.filter((g) => !g.isCompleted) ?? [];
  const done = data?.filter((g) => g.isCompleted) ?? [];

  return (
    <div className='container max-w-3xl space-y-6 py-6'>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-xl font-black tracking-tight'>
            {t('goals.title')}
          </h1>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            {t('goals.subtitle')}
          </p>
        </div>
        <Button
          size='sm'
          className='shrink-0 gap-1.5'
          onClick={() => setCreateOpen(true)}>
          <Plus size={14} />
          {t('goals.create')}
        </Button>
      </div>

      {/* ── Active Goals ─────────────────────────────────────── */}
      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-24 rounded-xl' />
          ))}
        </div>
      ) : isError ? (
        // ✅ Fix: error state instead of blank screen
        <div className='flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-14 text-center'>
          <AlertCircle size={32} className='text-destructive opacity-60' />
          <p className='text-sm font-medium text-destructive'>
            {t('common.errorLoading', 'Failed to load data')}
          </p>
        </div>
      ) : active.length === 0 ? (
        <div
          className='flex flex-col items-center gap-3 rounded-xl border
                        border-dashed border-border/60 py-14 text-center text-muted-foreground'>
          <Target size={32} className='opacity-30' />
          <p className='text-sm font-medium'>{t('goals.empty')}</p>
          <p className='text-xs'>{t('goals.emptyHint')}</p>
          <Button
            variant='outline'
            size='sm'
            className='mt-1 gap-1.5'
            onClick={() => setCreateOpen(true)}>
            <Plus size={13} />
            {t('goals.createFirst')}
          </Button>
        </div>
      ) : (
        <div className='space-y-3'>
          {active.map((goal, i) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={i}
              // ✅ Fix: pass isPending so GoalCard can disable buttons during mutation
              isDeleting={del.isPending && del.variables === goal.id}
              isCompleting={complete.isPending && complete.variables === goal.id}
              onDelete={(id) => del.mutate(id)}
              onComplete={(id) => complete.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* ── Completed Goals ─────────────────────────────────────── */}
      {!isError && done.length > 0 && (
        <section className='space-y-3'>
          <h2 className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
            {t('goals.completedSection')} ({done.length})
          </h2>
          <div className='space-y-2'>
            {done.map((goal, i) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                index={i}
                isDeleting={del.isPending && del.variables === goal.id}
                isCompleting={false}
                onDelete={(id) => del.mutate(id)}
                onComplete={() => {}}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Coming Soon ─────────────────────────────────────────── */}
      <div className='grid gap-3 sm:grid-cols-2'>
        <ComingSoonBanner
          icon={<Repeat size={15} className='text-primary' />}
          title={t('goals.cs.recurringTitle')}
          description={t('goals.cs.recurringDesc')}
        />
        <ComingSoonBanner
          icon={<Bell size={15} className='text-primary' />}
          title={t('goals.cs.remindersTitle')}
          description={t('goals.cs.remindersDesc')}
        />
      </div>

      <CreateGoalDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
