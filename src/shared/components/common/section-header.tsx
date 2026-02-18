// src/shared/components/section-header.tsx

import { cn } from '@/shared/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'space-y-2',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        align === 'left' && 'text-left',
        className,
      )}>
      <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>{title}</h2>
      {subtitle && <p className='text-lg text-muted-foreground'>{subtitle}</p>}
    </div>
  );
}
