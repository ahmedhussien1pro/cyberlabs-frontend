// src/features/courses/components/curriculum/CurriculumSkeleton.tsx
export function CurriculumSkeleton() {
  return (
    <div className='space-y-3'>
      {[1, 2, 3].map((i) => (
        <div key={i} className='flex gap-4'>
          <div className='h-[50px] w-[50px] shrink-0 rounded-full bg-muted animate-pulse' />
          <div className='flex-1 rounded-xl border border-border/30 bg-muted/20 h-16 animate-pulse' />
        </div>
      ))}
    </div>
  );
}
