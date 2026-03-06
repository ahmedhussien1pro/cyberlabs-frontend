import { CheckCircle2, Circle, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Goal } from '../../types/dashboard.types';

const CAT: Record<string, string> = {
  labs: 'bg-primary/10  text-primary',
  courses: 'bg-blue-500/10 text-blue-500',
  xp: 'bg-yellow-500/10 text-yellow-500',
  streak: 'bg-orange-500/10 text-orange-500',
  custom: 'bg-purple-500/10 text-purple-500',
};

// ✅ Fix: added isDeleting + isCompleting props so parent can pass mutation state
interface Props {
  goal: Goal;
  index: number;
  isDeleting: boolean;
  isCompleting: boolean;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function GoalCard({
  goal,
  index,
  isDeleting,
  isCompleting,
  onDelete,
  onComplete,
}: Props) {
  const { t } = useTranslation('dashboard');
  const pct = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const color = CAT[goal.category] ?? CAT.custom;
  const overdue =
    goal.dueDate && !goal.isCompleted && new Date(goal.dueDate) < new Date();

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'group relative rounded-xl border border-border/40 bg-card p-4 transition-all',
        'hover:border-border/60 hover:shadow-sm',
        goal.isCompleted && 'opacity-60',
        (isDeleting || isCompleting) && 'pointer-events-none opacity-70',
      )}>
      {/* Header */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex items-start gap-2.5'>
          {/* ✅ Fix: disable button while completing mutation is running */}
          <button
            aria-label='Toggle complete'
            onClick={() => !goal.isCompleted && onComplete(goal.id)}
            disabled={goal.isCompleted || isCompleting}
            className='mt-0.5 shrink-0 text-muted-foreground transition-colors
                       hover:text-primary disabled:cursor-default'>
            {isCompleting ? (
              <Loader2 size={16} className='animate-spin text-primary' />
            ) : goal.isCompleted ? (
              <CheckCircle2 size={16} className='text-green-500' />
            ) : (
              <Circle size={16} />
            )}
          </button>
          <p
            className={cn(
              'text-sm font-medium leading-snug',
              goal.isCompleted && 'line-through text-muted-foreground',
            )}>
            {goal.title}
          </p>
        </div>

        {/* Actions — visible on hover */}
        <div
          className='flex shrink-0 items-center gap-1.5
                        opacity-0 transition-opacity group-hover:opacity-100'>
          <Badge className={cn('border-0 text-[10px]', color)}>
            {t(`goals.category.${goal.category}`)}
          </Badge>
          {/* ✅ Fix: disable delete button while deleting mutation is running */}
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 text-muted-foreground hover:text-destructive disabled:opacity-50'
            disabled={isDeleting}
            onClick={() => onDelete(goal.id)}>
            {isDeleting ? (
              <Loader2 size={12} className='animate-spin' />
            ) : (
              <Trash2 size={12} />
            )}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className='mt-3 space-y-1'>
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>
            {goal.currentValue.toLocaleString()} /{' '}
            {goal.targetValue.toLocaleString()} {goal.unit}
          </span>
          <span
            className={cn(
              'font-mono font-semibold',
              goal.isCompleted ? 'text-green-500' : 'text-foreground',
            )}>
            {Math.round(pct)}%
          </span>
        </div>
        <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
          <div
            className={cn(
              'h-full rounded-full transition-all',
              goal.isCompleted
                ? 'bg-green-500'
                : 'bg-gradient-to-r from-purple-500 to-primary',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Due date */}
      {goal.dueDate && (
        <p
          className={cn(
            'mt-2 text-[11px]',
            overdue ? 'text-red-400' : 'text-muted-foreground',
          )}>
          {overdue ? '⚠️ ' : '📅 '}
          {formatDistanceToNow(new Date(goal.dueDate), { addSuffix: true })}
        </p>
      )}
    </motion.article>
  );
}
