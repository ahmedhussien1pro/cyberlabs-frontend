import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function ComingSoonBanner({
  icon,
  title,
  description,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-4',
        className,
      )}>
      <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
        {icon ?? <Sparkles size={15} className='text-primary' />}
      </div>
      <div className='flex-1 space-y-0.5'>
        <div className='flex flex-wrap items-center gap-2'>
          <p className='text-sm font-semibold text-foreground'>{title}</p>
          <Badge
            variant='outline'
            className='h-4 border-primary/30 bg-primary/10 px-1.5
                       text-[10px] font-semibold text-primary'>
            Coming Soon
          </Badge>
        </div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
}
