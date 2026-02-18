import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils';

interface SearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SearchTrigger({ onClick, className }: SearchTriggerProps) {
  const { t } = useTranslation();

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'hidden md:flex items-center gap-2',
        'w-64 rounded-md border border-input bg-background px-3 py-1.5',
        'text-sm text-muted-foreground hover:text-foreground',
        'hover:bg-accent/60 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}>
      <Search className='w-4 h-4' />
      <span className='flex-1 text-left truncate'>
        {t('common:search.placeholder')}
      </span>
      <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
        <span className='hidden sm:inline'>Ctrl</span>
        <span className='hidden sm:inline'>+</span>
        <span>K</span>
      </kbd>
    </button>
  );
}
