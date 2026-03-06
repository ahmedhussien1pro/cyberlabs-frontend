// src/features/dashboard/components/overview/level-progress-bar.tsx
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUserPoints } from '@/shared/hooks/use-user-data';

export function LevelProgressBar() {
  const { t } = useTranslation('dashboard');
  const { data: points, isLoading } = useUserPoints();

  if (isLoading || !points) return null;

  // ✅ Fix: backend now returns xpIntoCurrentLevel + xpNeededForLevel + levelProgress
  //         fallback calculation in case backend is an older deploy
  const totalXP          = points.totalXP ?? 0;
  const level            = points.level ?? 1;
  const xpNeeded         = (points as any).xpNeededForLevel  ?? 1000;
  const xpInto           = (points as any).xpIntoCurrentLevel
                            ?? totalXP - (level - 1) * 1000;
  const pct              = (points as any).levelProgress
                            ?? Math.min(Math.round((xpInto / xpNeeded) * 100), 100);
  const xpForNext        = (points as any).xpForNextLevel ?? level * 1000;

  return (
    <div className='rounded-xl border border-border/40 bg-card px-4 py-3 space-y-2'>
      {/* Header */}
      <div className='flex items-center justify-between text-xs'>
        <span className='font-bold text-foreground'>
          {t('level')} {level}
          <span className='ml-1.5 font-normal text-muted-foreground'>
            → {t('level')} {level + 1}
          </span>
        </span>
        {/* ✅ Fix: was showing 100% because totalXP > level*1000 — now shows progress within current level */}
        <span className='font-mono font-semibold text-primary'>{pct}%</span>
      </div>

      {/* Bar */}
      <div className='h-2.5 overflow-hidden rounded-full bg-muted'>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400'
        />
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
        <span>0 XP</span>
        <span className='font-mono text-foreground font-medium'>
          {xpInto.toLocaleString()} XP
        </span>
        <span>{xpForNext.toLocaleString()} XP</span>
      </div>
    </div>
  );
}
