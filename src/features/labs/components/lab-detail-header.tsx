// src/features/labs/components/lab-detail-header.tsx
import { Terminal, Clock, Zap, Trophy, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DIFF_STYLES, type LabDifficulty } from '../constants/diff-styles';

interface LabDetailHeaderProps {
  title: string;
  description: string;
  difficulty: LabDifficulty;
  duration: number;
  xpReward: number;
  pointsReward: number;
  isCompleted: boolean;
  isStarted: boolean;
}

export function LabDetailHeader({
  title,
  description,
  difficulty,
  duration,
  xpReward,
  pointsReward,
  isCompleted,
  isStarted,
}: LabDetailHeaderProps) {
  const diff = DIFF_STYLES[difficulty] ?? DIFF_STYLES.BEGINNER;

  return (
    <div className='flex flex-col sm:flex-row sm:items-start gap-5'>
      {/* Icon box */}
      <div
        className={cn(
          'h-16 w-16 shrink-0 rounded-2xl border bg-gradient-to-br',
          'flex items-center justify-center',
          diff.gradientCls,
        )}>
        <Terminal className={cn('h-7 w-7', diff.textCls)} />
      </div>

      {/* Info */}
      <div className='flex-1 space-y-2'>
        <h1 className='text-2xl font-bold leading-tight'>{title}</h1>
        <p className='text-sm text-muted-foreground leading-relaxed'>{description}</p>

        <div className='flex flex-wrap gap-2 pt-1'>
          <Badge variant='outline' className={cn('gap-1.5 text-xs', diff.badgeCls)}>
            <diff.Icon className='h-3.5 w-3.5' />
            {diff.label}
          </Badge>
          <Badge variant='outline' className='gap-1.5 text-xs border-primary/30 text-primary bg-primary/5'>
            <Clock className='h-3.5 w-3.5' /> {duration}m
          </Badge>
          <Badge variant='outline' className='gap-1.5 text-xs text-yellow-400 border-yellow-500/30 bg-yellow-500/5'>
            <Zap className='h-3.5 w-3.5' /> {xpReward} XP
          </Badge>
          <Badge variant='outline' className='gap-1.5 text-xs text-muted-foreground'>
            <Trophy className='h-3.5 w-3.5' /> {pointsReward} pts
          </Badge>
          {isCompleted && (
            <Badge className='gap-1.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'>
              <CheckCircle2 className='h-3.5 w-3.5' /> Solved
            </Badge>
          )}
          {isStarted && (
            <Badge className='gap-1.5 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'>
              <Clock className='h-3.5 w-3.5' /> In Progress
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
