// src/features/labs/components/lab-thumbnail.tsx
import { Terminal, CheckCircle2, Timer, Play, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DIFF_STYLES, type LabDifficulty } from '../constants/diff-styles';

interface LabThumbnailProps {
  difficulty: LabDifficulty;
  category: string;
  xpReward: number;
  isCompleted: boolean;
  isStarted: boolean;
}

export function LabThumbnail({
  difficulty,
  category,
  xpReward,
  isCompleted,
  isStarted,
}: LabThumbnailProps) {
  const diff = DIFF_STYLES[difficulty] ?? DIFF_STYLES.BEGINNER;

  return (
    <div className='relative aspect-video overflow-hidden bg-muted'>
      {/* Background gradient */}
      <div
        className={cn(
          'w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br border',
          diff.gradientCls,
        )}>
        <Terminal className={cn('h-9 w-9', diff.textCls)} />
        <p className={cn('text-[11px] font-bold uppercase tracking-widest px-4', diff.textCls)}>
          {category.replace(/_/g, ' ')}
        </p>
      </div>

      {/* Status pill — top start */}
      <div className='absolute top-3 start-3'>
        {isCompleted ? (
          <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white shadow-md'>
            <CheckCircle2 className='h-3 w-3' /> Solved
          </span>
        ) : isStarted ? (
          <span className='inline-flex items-center gap-1.5 rounded-full bg-yellow-500/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white shadow-md'>
            <Timer className='h-3 w-3' /> In Progress
          </span>
        ) : (
          <span className='inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-2.5 py-1 text-[11px] font-bold text-white/70'>
            <Play className='h-3 w-3' /> New
          </span>
        )}
      </div>

      {/* XP pill — top end */}
      <div className='absolute top-3 end-3'>
        <span className='inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm border border-yellow-500/30 px-2.5 py-1 text-[11px] font-bold text-yellow-400'>
          <Zap className='h-3 w-3' /> {xpReward} XP
        </span>
      </div>
    </div>
  );
}
