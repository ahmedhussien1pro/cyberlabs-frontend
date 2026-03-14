// src/features/labs/components/lab-meta-badges.tsx
import { Clock, Trophy, Unlock, Crown, Gem } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DIFF_STYLES, ACCESS_BADGE_CLS, type LabDifficulty } from '../constants/diff-styles';

type AccessLevel = 'free' | 'pro' | 'premium';

const ACCESS_ICON = { free: Unlock, pro: Crown, premium: Gem } as const;

export interface LabMetaBadgesProps {
  difficulty: LabDifficulty;
  access?: AccessLevel;
  duration: number;
  pointsReward: number;
  /** compact: hide access badge, keep only diff + duration */
  compact?: boolean;
}

export function LabMetaBadges({
  difficulty,
  access = 'free',
  duration,
  pointsReward,
  compact = false,
}: LabMetaBadgesProps) {
  const diff       = DIFF_STYLES[difficulty] ?? DIFF_STYLES.BEGINNER;
  const AccessIcon = ACCESS_ICON[access];

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      <Badge variant='outline' className={cn('gap-1 text-[10px] font-semibold', diff.badgeCls)}>
        <diff.Icon className='h-3 w-3' />
        {diff.label}
      </Badge>

      {!compact && (
        <Badge variant='outline' className={cn('gap-1 text-[10px] font-bold', ACCESS_BADGE_CLS[access])}>
          <AccessIcon className='h-3 w-3' />
          {access.toUpperCase()}
        </Badge>
      )}

      <Badge variant='outline' className='gap-1 text-[10px] font-semibold text-primary border-primary/30 bg-primary/5'>
        <Clock className='h-3 w-3' /> {duration}m
      </Badge>

      {!compact && (
        <Badge variant='outline' className='gap-1 text-[10px] text-muted-foreground border-border/40'>
          <Trophy className='h-3 w-3' /> {pointsReward} pts
        </Badge>
      )}
    </div>
  );
}
