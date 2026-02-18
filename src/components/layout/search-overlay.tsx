import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/utils';

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setIsSearching(false);
    }
  }, [open]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // TODO: hook TanStack Query search
    setTimeout(() => setIsSearching(false), 800);
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-full p-0 border-none bg-background/95 backdrop-blur',
          'top-0 left-0 right-0 translate-y-0 h-screen',
          'flex flex-col',
        )}>
        {/* Top search bar */}
        <div className='border-b px-4 md:px-8 py-3 flex items-center gap-3'>
          <Search className='w-5 h-5 text-muted-foreground' />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('search.placeholder')}
            className='border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base'
          />
          <button
            type='button'
            onClick={() => onOpenChange(false)}
            className='p-1 rounded-md hover:bg-accent text-muted-foreground'>
            <X className='w-4 h-4' />
            <span className='sr-only'>{t('search.close')}</span>
          </button>
        </div>

        {/* Results area */}
        <div className='flex-1 overflow-y-auto px-4 md:px-8 py-4'>
          {isSearching ? (
            <div className='flex h-full items-center justify-center'>
              <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
            </div>
          ) : !query ? (
            <div className='text-sm text-muted-foreground'>
              {t('search.suggestions')}
              {/* TODO: أضف suggestions / recent search */}
            </div>
          ) : (
            <div className='text-sm text-muted-foreground'>
              {/* TODO: أضف نتائج البحث الفعلية */}
              {t('search.noResults')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
