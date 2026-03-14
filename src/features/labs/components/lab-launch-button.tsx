// src/features/labs/components/lab-launch-button.tsx
// Reusable CTA button used in both LabCard and LabDetailPage
import { Loader2, RefreshCw, Zap, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LabLaunchButtonProps {
  isCompleted: boolean;
  isStarted: boolean;
  isLaunching: boolean;
  /** full width (card) or normal (detail page) */
  fullWidth?: boolean;
  size?: 'sm' | 'default';
  onLaunch: () => void;
  onViewDetail?: () => void | Promise<void>;
  /** compact: reduce height slightly */
  compact?: boolean;
}

export function LabLaunchButton({
  isCompleted,
  isStarted,
  isLaunching,
  fullWidth = true,
  size = 'sm',
  onLaunch,
  onViewDetail,
  compact = false,
}: LabLaunchButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleted || isStarted) {
      onLaunch();
    } else {
      onViewDetail ? onViewDetail() : onLaunch();
    }
  };

  return (
    <Button
      size={size}
      className={fullWidth
        ? compact ? 'w-full h-8 text-xs gap-1' : 'w-full h-9 text-xs gap-1.5'
        : 'h-11 font-bold text-sm rounded-xl gap-2 w-full'
      }
      variant={isCompleted ? 'outline' : 'default'}
      disabled={isLaunching}
      onClick={handleClick}>
      {isLaunching ? (
        <><Loader2 className='h-3.5 w-3.5 animate-spin' /> Launching...</>
      ) : isCompleted ? (
        <><RefreshCw className='h-3.5 w-3.5' /> Try Again</>
      ) : isStarted ? (
        <><Zap className='h-3.5 w-3.5' /> Resume Lab</>
      ) : (
        <>Start Lab <ArrowRight className='h-3.5 w-3.5' /></>
      )}
    </Button>
  );
}

// Variant for detail page with Play icon
export function LabLaunchButtonDetail({
  isCompleted,
  isStarted,
  isLaunching,
  onLaunch,
}: Omit<LabLaunchButtonProps, 'onViewDetail' | 'fullWidth' | 'size' | 'compact'>) {
  return (
    <Button
      className='w-full h-11 font-bold text-sm rounded-xl gap-2'
      disabled={isLaunching}
      onClick={(e) => { e.stopPropagation(); onLaunch(); }}>
      {isLaunching ? (
        <><Loader2 className='h-4 w-4 animate-spin' /> Launching...</>
      ) : isCompleted ? (
        <><RefreshCw className='h-4 w-4' /> Try Again</>
      ) : isStarted ? (
        <><Play className='h-4 w-4' /> Resume Lab</>
      ) : (
        <><Play className='h-4 w-4' /> Launch Lab</>
      )}
    </Button>
  );
}
