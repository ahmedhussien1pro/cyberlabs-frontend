// src/features/courses/components/filter-chip.tsx
// Single selectable chip used inside filter sections
import { cn } from '@/lib/utils';

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all text-start',
        active
          ? 'bg-primary/10 text-primary border border-primary/25 font-semibold'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent',
      )}>
      {children}
    </button>
  );
}
