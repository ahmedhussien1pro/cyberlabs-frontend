import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  view?: 'grid' | 'list';
}

export function LabCardSkeleton({ view = 'grid' }: Props) {
  if (view === 'list') {
    return (
      <div className='flex gap-4 rounded-2xl border border-border/40 bg-card p-4'>
        <Skeleton className='h-24 w-36 rounded-xl shrink-0' />
        <div className='flex-1 space-y-2'>
          <div className='flex gap-2'>
            <Skeleton className='h-5 w-16 rounded-full' />
            <Skeleton className='h-5 w-20 rounded-full' />
          </div>
          <Skeleton className='h-5 w-2/3' />
          <Skeleton className='h-4 w-full' />
          <div className='flex gap-3'>
            <Skeleton className='h-8 w-24 rounded-lg' />
            <Skeleton className='h-8 w-28 rounded-lg' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-border/40 bg-card overflow-hidden'>
      <Skeleton className='aspect-video w-full' />
      <div className='p-4 space-y-3'>
        <div className='flex gap-2'>
          <Skeleton className='h-5 w-16 rounded-full' />
          <Skeleton className='h-5 w-20 rounded-full' />
        </div>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-4/5' />
        <div className='flex gap-2 pt-1'>
          <Skeleton className='h-9 flex-1 rounded-lg' />
          <Skeleton className='h-9 flex-1 rounded-lg' />
        </div>
      </div>
    </div>
  );
}
