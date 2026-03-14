// src/features/labs/components/lab-thumbnail.tsx
import { Terminal, CheckCircle2, Timer, Play, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DIFF_STYLES, type LabDifficulty } from '../constants/diff-styles';

export interface LabThumbnailProps {
  difficulty: LabDifficulty;
  category: string;
  xpReward: number;
  isCompleted: boolean;
  isStarted: boolean;
  /** compact: shorter height for dense 4-col grids */
  compact?: boolean;
}

export function LabThumbnail({
  difficulty,
  category,
  xpReward,
  isCompleted,
  isStarted,
  compact = false,
}: LabThumbnailProps) {
  const diff = DIFF_STYLES[difficulty] ?? DIFF_STYLES.BEGINNER;

  return (
    <div className={cn('relative overflow-hidden bg-muted', compact ? 'h-28' : 'aspect-video')}>
      {/* Background gradient */}
      <div
        className={cn(
          'w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br border',
          diff.gradientCls,
        )}>
        <Terminal className={cn(compact ? 'h-6 w-6' : 'h-9 w-9', diff.textCls)} />
        <p className={cn('font-bold uppercase tracking-widest px-4 truncate max-w-full text-center', diff.textCls, compact ? 'text-[9px]' : 'text-[11px]')}>
          {category.replace(/_/g, ' ')}
        </p>
      </div>

      {/* Status pill — top start */}
      <div className='absolute top-2 start-2'>
        {isCompleted ? (
          <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white shadow-md'>
            <CheckCircle2 className='h-2.5 w-2.5' /> Solved
          </span>
        ) : isStarted ? (
          <span className='inline-flex items-center gap-1 rounded-full bg-yellow-500/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white shadow-md'>
            <Timer className='h-2.5 w-2.5' /> In Progress
          </span>
        ) : (
          <span className='inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70'>
            <Play className='h-2.5 w-2.5' /> New
          </span>
        )}
      </div>

      {/* XP pill — top end */}
      <div className='absolute top-2 end-2'>
        <span className='inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm border border-yellow-500/30 px-2 py-0.5 text-[10px] font-bold text-yellow-400'>
          <Zap className='h-2.5 w-2.5' /> {xpReward} XP
        </span>
      </div>
    </div>
  );
}
