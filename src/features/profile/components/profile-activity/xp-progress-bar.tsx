import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { UserPoints } from '@/shared/types/user.types';

interface Props {
  points: UserPoints;
}

export function XpProgressBar({ points }: Props) {
  const { t } = useTranslation('profile');

  const xpMin = Math.max(0, points.xpForNextLevel - 1000);
  const xpRange = points.xpForNextLevel - xpMin;
  const earned = Math.max(0, points.totalXP - xpMin);
  const progress = Math.min((earned / xpRange) * 100, 100);

  return (
    <div className='rounded-xl border border-border/40 bg-card p-4'>
      <div className='mb-2 flex items-center justify-between'>
        <span className='text-sm font-bold text-foreground'>
          {t('level')} {points.level}
          <span className='ml-2 text-xs font-normal text-muted-foreground'>
            → {t('level')} {points.level + 1}
          </span>
        </span>
        <span className='font-mono text-xs text-primary'>
          {Math.round(progress)}%
        </span>
      </div>

      <div className='h-2.5 overflow-hidden rounded-full bg-muted'>
        <motion.div
          className='h-full rounded-full bg-gradient-to-r from-primary via-cyan-400 to-[#00e5ff]'
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </div>

      <div className='mt-1.5 flex justify-between font-mono text-[11px] text-muted-foreground'>
        <span>{xpMin.toLocaleString()} XP</span>
        <span className='font-semibold text-foreground'>
          {points.totalXP.toLocaleString()} XP
        </span>
        <span>{points.xpForNextLevel.toLocaleString()} XP</span>
      </div>
    </div>
  );
}
