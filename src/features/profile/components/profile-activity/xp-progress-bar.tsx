import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { UserPoints } from '../../types/profile.types';

const LEVEL_THRESHOLDS = [
  0, 1000, 2500, 5000, 10000, 20000, 40000, 75000, 120000, 200000,
];

export function XpProgressBar({ points }: { points: UserPoints }) {
  const { t } = useTranslation('profile');
  const level = points.level;
  const xpMin =
    LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)] ?? 0;
  const xpMax =
    LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)] ??
    xpMin + 1000;
  const progress = Math.min(
    ((points.totalXP - xpMin) / (xpMax - xpMin)) * 100,
    100,
  );

  return (
    <div className='rounded-xl border border-border/40 bg-card p-4'>
      <div className='mb-2 flex items-center justify-between'>
        <span className='text-sm font-bold text-foreground'>
          {t('level')} {level}
          <span className='ml-2 text-xs font-normal text-muted-foreground'>
            → {t('level')} {level + 1}
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
        <span>{xpMax.toLocaleString()} XP</span>
      </div>
    </div>
  );
}
