// src/features/labs/components/lab-skill-tags.tsx
const MAX_VISIBLE = 3;
const MAX_VISIBLE_COMPACT = 2;

export interface LabSkillTagsProps {
  skills: string[];
  max?: number;
  compact?: boolean;
}

export function LabSkillTags({ skills, max, compact = false }: LabSkillTagsProps) {
  if (!skills?.length) return null;

  const effectiveMax = max ?? (compact ? MAX_VISIBLE_COMPACT : MAX_VISIBLE);
  const visible  = skills.slice(0, effectiveMax);
  const overflow = skills.length - effectiveMax;

  return (
    <div className='flex flex-wrap gap-1'>
      {visible.map((s) => (
        <span
          key={s}
          className='text-[10px] px-2 py-0.5 rounded-full bg-muted/60 border border-border/40 text-muted-foreground'>
          {s}
        </span>
      ))}
      {overflow > 0 && (
        <span className='text-[10px] px-2 py-0.5 rounded-full bg-muted/60 border border-border/40 text-muted-foreground'>
          +{overflow}
        </span>
      )}
    </div>
  );
}
