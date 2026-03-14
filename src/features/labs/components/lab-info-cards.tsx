// src/features/labs/components/lab-info-cards.tsx
import { BookOpen, Target, Code2 } from 'lucide-react';
import type { Lab } from '../types/lab.types';

interface LabInfoCardsProps {
  scenario?: string;
  objective?: string;
  skills?: string[];
  fallbackDesc?: string;
}

export function LabInfoCards({ scenario, objective, skills, fallbackDesc }: LabInfoCardsProps) {
  return (
    <div className='space-y-5'>
      {/* Scenario */}
      <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
        <div className='flex items-center gap-2 text-sm font-bold'>
          <BookOpen className='h-4 w-4 text-primary' /> Scenario
        </div>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {scenario ?? fallbackDesc}
        </p>
      </div>

      {/* Objective */}
      <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
        <div className='flex items-center gap-2 text-sm font-bold'>
          <Target className='h-4 w-4 text-primary' /> Objective
        </div>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {objective ?? 'Find the flag and submit it to complete the lab.'}
        </p>
      </div>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
          <div className='flex items-center gap-2 text-sm font-bold'>
            <Code2 className='h-4 w-4 text-primary' /> Skills You'll Practice
          </div>
          <div className='flex flex-wrap gap-2'>
            {skills.map((s) => (
              <span
                key={s}
                className='text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium'>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
