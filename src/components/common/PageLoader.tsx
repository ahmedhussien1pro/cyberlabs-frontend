import { Loader2 } from 'lucide-react';

export const PageLoader = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <Loader2 className='w-12 h-12 mx-auto mb-4 animate-spin text-primary' />
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    </div>
  );
};
