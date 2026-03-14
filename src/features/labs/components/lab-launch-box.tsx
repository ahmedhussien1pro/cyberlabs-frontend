// src/features/labs/components/lab-launch-box.tsx
// Right sidebar panel: hints list + launch CTA
import { Lightbulb, Clock, ChevronRight } from 'lucide-react';
import { LabLaunchButtonDetail } from './lab-launch-button';

interface Hint { id: string; xpCost: number; }
interface Progress { attempts: number; hintsUsed: number; }

interface LabLaunchBoxProps {
  hints?: Hint[];
  progress?: Progress;
  isCompleted: boolean;
  isStarted: boolean;
  isLaunching: boolean;
  onLaunch: () => void;
}

export function LabLaunchBox({
  hints,
  progress,
  isCompleted,
  isStarted,
  isLaunching,
  onLaunch,
}: LabLaunchBoxProps) {
  return (
    <div className='space-y-4'>
      {/* Hints */}
      {hints && hints.length > 0 && (
        <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
          <div className='flex items-center gap-2 text-sm font-bold'>
            <Lightbulb className='h-4 w-4 text-yellow-400' /> Hints Available
          </div>
          <div className='space-y-1.5'>
            {hints.map((h, i) => (
              <div key={h.id} className='flex justify-between text-xs text-muted-foreground'>
                <span>Hint {i + 1}</span>
                <span className='text-yellow-400 font-bold'>−{h.xpCost} XP</span>
              </div>
            ))}
          </div>
          <p className='text-[11px] text-muted-foreground/60 leading-relaxed'>
            Unlocked inside the lab. Costs XP.
          </p>
        </div>
      )}

      {/* In Progress info */}
      {isStarted && progress && (
        <div className='rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5 space-y-1.5'>
          <div className='flex items-center gap-2 text-xs font-bold text-yellow-400'>
            <Clock className='h-3.5 w-3.5' /> In Progress
          </div>
          <p className='text-xs text-muted-foreground'>
            {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}.
            {progress.hintsUsed > 0 ? ` ${progress.hintsUsed} hint(s) used.` : ''}
          </p>
        </div>
      )}

      {/* Launch box */}
      <div className='rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3'>
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <ChevronRight className='h-3.5 w-3.5 text-primary' />
          Opens in a <strong className='text-foreground'>new tab</strong> on the labs platform.
        </div>
        <p className='text-[11px] text-muted-foreground/70'>Progress is tracked automatically.</p>
        <LabLaunchButtonDetail
          isCompleted={isCompleted}
          isStarted={isStarted}
          isLaunching={isLaunching}
          onLaunch={onLaunch}
        />
      </div>
    </div>
  );
}
