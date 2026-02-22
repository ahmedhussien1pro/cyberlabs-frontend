import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { CompletionCheck } from '../../utils/profile-completion';

interface Props {
  percentage: number;
  checks: CompletionCheck[];
  onEdit: () => void;
}

export function ProfileCompletionBar({ percentage, checks, onEdit }: Props) {
  const { t } = useTranslation('profile');

  if (percentage === 100) return null;

  const missing = checks.filter((c) => !c.done);

  return (
    <div className='rounded-xl border border-border/40 bg-card p-4 space-y-3'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-semibold text-foreground'>
            {t('completion.title')}
          </p>
          <p className='text-xs text-muted-foreground'>
            {t('completion.subtitle', { count: missing.length })}
          </p>
        </div>
        <span className='font-mono text-lg font-black text-primary'>
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className='h-2 overflow-hidden rounded-full bg-muted'>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='h-full rounded-full bg-gradient-to-r from-primary to-cyan-400'
        />
      </div>

      {/* Missing items */}
      <div className='flex flex-wrap gap-2'>
        {checks.slice(0, 6).map((check) => (
          <div
            key={check.key}
            className='flex items-center gap-1 text-[11px] text-muted-foreground'>
            {check.done ? (
              <CheckCircle2 size={11} className='text-green-500' />
            ) : (
              <Circle size={11} className='text-muted-foreground/50' />
            )}
            {t(check.labelKey)}
          </div>
        ))}
      </div>

      <Button
        size='sm'
        variant='outline'
        className='w-full text-xs'
        onClick={onEdit}>
        {t('completion.complete')}
      </Button>
    </div>
  );
}
