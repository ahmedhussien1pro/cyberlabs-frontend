// src/features/labs/components/lab-skill-tags.tsx
const MAX_VISIBLE = 3;

interface LabSkillTagsProps {
  skills: string[];
  max?: number;
}

export function LabSkillTags({ skills, max = MAX_VISIBLE }: LabSkillTagsProps) {
  if (!skills?.length) return null;

  const visible  = skills.slice(0, max);
  const overflow = skills.length - max;

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
