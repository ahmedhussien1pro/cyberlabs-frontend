export function PathCardSkeleton() {
  return (
    <div className='flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card'>
      <div className='h-1 w-full animate-pulse bg-muted' />
      <div className='flex flex-col gap-4 p-5'>
        {/* Header */}
        <div className='flex items-start gap-3'>
          <div className='h-12 w-12 shrink-0 animate-pulse rounded-xl bg-muted' />
          <div className='flex-1 space-y-2'>
            <div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
            <div className='h-3 w-16 animate-pulse rounded-full bg-muted' />
          </div>
        </div>
        {/* Description */}
        <div className='space-y-1.5'>
          <div className='h-3 w-full animate-pulse rounded bg-muted' />
          <div className='h-3 w-4/5 animate-pulse rounded bg-muted' />
        </div>
        {/* Tags */}
        <div className='flex gap-1'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-4 w-14 animate-pulse rounded-full bg-muted'
            />
          ))}
        </div>
        {/* Stats */}
        <div className='flex gap-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-3 w-14 animate-pulse rounded bg-muted' />
          ))}
        </div>
        {/* CTA */}
        <div className='flex items-center justify-between border-t border-border/30 pt-3'>
          <div className='h-8 w-24 animate-pulse rounded-lg bg-muted' />
        </div>
      </div>
    </div>
  );
}
