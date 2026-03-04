// src/shared/components/common/pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <div className={cn('flex items-center justify-center gap-1.5', className)}>
      <Button
        variant='outline'
        size='icon'
        className='h-8 w-8'
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}>
        <ChevronLeft className='h-4 w-4' />
      </Button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`dots-${i}`}
            className='px-1 text-sm text-muted-foreground select-none'>
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size='icon'
            className='h-8 w-8 text-xs'
            onClick={() => onChange(p as number)}>
            {p}
          </Button>
        ),
      )}

      <Button
        variant='outline'
        size='icon'
        className='h-8 w-8'
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}>
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
}

function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const result: (number | '...')[] = [1];
  if (current > 3) result.push('...');
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    result.push(p);
  }
  if (current < total - 2) result.push('...');
  result.push(total);
  return result;
}
