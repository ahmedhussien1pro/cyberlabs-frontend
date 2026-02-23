export function CourseCardSkeleton() {
  return (
    <div className='flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card'>
      <div className='h-44 animate-pulse bg-muted' />
      <div className='flex flex-col gap-3 p-4'>
        <div className='flex items-center justify-between'>
          <div className='h-3 w-20 animate-pulse rounded bg-muted' />
          <div className='h-4 w-16 animate-pulse rounded-full bg-muted' />
        </div>
        <div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
        <div className='h-3 w-full animate-pulse rounded bg-muted' />
        <div className='h-3 w-5/6 animate-pulse rounded bg-muted' />
        <div className='flex gap-1'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-4 w-16 animate-pulse rounded-full bg-muted'
            />
          ))}
        </div>
        <div className='flex gap-3 border-t border-border/30 pt-3'>
          <div className='h-3 w-10 animate-pulse rounded bg-muted' />
          <div className='h-3 w-12 animate-pulse rounded bg-muted' />
        </div>
      </div>
    </div>
  );
}
