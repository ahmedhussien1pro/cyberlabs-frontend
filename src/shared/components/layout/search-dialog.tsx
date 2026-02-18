// src/components/layout/search-dialog.tsx
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // TODO: Implement search logic
    setTimeout(() => setIsSearching(false), 1000);
  }, [query]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='sr-only'>{t('search.title')}</DialogTitle>
        </DialogHeader>

        <div className='flex items-center gap-2 pb-4 border-b'>
          <Search className='w-5 h-5 text-muted-foreground' />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('search.placeholder')}
            className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
            autoFocus
          />
          <kbd className='hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
            <span className='text-xs'>ESC</span>
          </kbd>
        </div>

        <div className='min-h-[200px] py-4'>
          {isSearching ? (
            <div className='flex items-center justify-center h-32'>
              <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
            </div>
          ) : query ? (
            <div className='text-center text-sm text-muted-foreground py-8'>
              {t('search.noResults')}
            </div>
          ) : (
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                {t('search.suggestions')}
              </p>
              {/* TODO: Add recent searches or suggestions */}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Search Button Trigger Component
export function SearchButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation('common');

  return (
    <Button
      variant='outline'
      className='hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground w-64'
      onClick={onClick}>
      <Search className='w-4 h-4' />
      <span className='flex-1 text-left text-sm'>{t('search.button')}</span>
      <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
        <span className='text-xs'>⌘</span>K
      </kbd>
    </Button>
  );
}
