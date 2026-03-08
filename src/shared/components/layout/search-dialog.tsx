// src/shared/components/layout/search-dialog.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Loader2,
  BookOpen,
  FlaskConical,
  Map,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  globalSearch,
  type SearchResultType,
} from '@/features/search/api/search.api';
import { ROUTES } from '@/shared/constants';

// ─── local debounce hook ──────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── icon + href per type ─────────────────────────────────────────────────────

const TYPE_ICON: Record<SearchResultType, React.ReactNode> = {
  course: <BookOpen className='w-4 h-4' />,
  lab: <FlaskConical className='w-4 h-4' />,
  path: <Map className='w-4 h-4' />,
  challenge: <Trophy className='w-4 h-4' />,
};

function resultHref(type: SearchResultType, slug: string): string {
  switch (type) {
    case 'course':
      return ROUTES.COURSES.DETAIL(slug);
    case 'lab':
      return ROUTES.LABS.DETAIL(slug);
    case 'path':
      return ROUTES.PATHS.DETAIL(slug);
    case 'challenge':
      return ROUTES.CHALLENGES.DETAIL(slug);
  }
}

// ─── platform-aware shortcut label ───────────────────────────────────────────
// ✅ Fix: navigator.platform deprecated → userAgent check
const isMac =
  typeof navigator !== 'undefined' &&
  (('userAgentData' in navigator &&
    (
      navigator as Navigator & { userAgentData?: { platform?: string } }
    ).userAgentData?.platform
      ?.toUpperCase()
      .includes('MAC')) ??
    /Mac|iPhone|iPad|iPod/.test(navigator.userAgent));

// ─── SearchDialog ─────────────────────────────────────────────────────────────

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');

  // ✅ Fix: SUGGESTIONS من locale بدل hardcoded English
  const suggestions = t('search.defaultSuggestions', {
    returnObjects: true,
    defaultValue: [
      'SQL Injection',
      'Network Security',
      'CTF Basics',
      'Linux Fundamentals',
    ],
  }) as string[];

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  // Ctrl/⌘ + K shortcut
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

  const { data, isFetching, isError } = useQuery({
    queryKey: ['search', 'global', debouncedQuery],
    queryFn: () => globalSearch(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 30,
    retry: false,
    placeholderData: (prev) => prev,
  });

  const results = data?.results ?? [];
  const isTyping = query !== debouncedQuery;
  const isActive = debouncedQuery.trim().length >= 2;
  const showEmpty =
    isActive && !isFetching && !isTyping && !isError && results.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl p-0 gap-0 overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='sr-only'>{t('search.title')}</DialogTitle>
        </DialogHeader>

        {/* ── Search input ── */}
        <div className='flex items-center gap-3 px-4 py-3 border-b'>
          {isFetching || isTyping ? (
            <Loader2 className='w-5 h-5 text-muted-foreground animate-spin shrink-0' />
          ) : (
            <Search className='w-5 h-5 text-muted-foreground shrink-0' />
          )}
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10 text-base'
            autoFocus
          />
          <kbd className='hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0'>
            ESC
          </kbd>
        </div>

        {/* ── Results area ── */}
        <div className='min-h-[200px] max-h-[420px] overflow-y-auto'>
          {isError ? (
            <div className='flex flex-col items-center justify-center h-40 text-sm text-muted-foreground gap-2'>
              <p>{t('search.error')}</p>
            </div>
          ) : showEmpty ? (
            <div className='flex flex-col items-center justify-center h-40 text-sm text-muted-foreground gap-2'>
              <p>{t('search.noResults')}</p>
            </div>
          ) : results.length > 0 ? (
            <ul className='py-2'>
              {results.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    to={resultHref(item.type, item.slug)}
                    onClick={() => onOpenChange(false)}
                    className='flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors group'>
                    <span className='text-muted-foreground shrink-0 group-hover:text-foreground transition-colors'>
                      {TYPE_ICON[item.type]}
                    </span>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>
                        {item.title}
                      </p>
                      {item.description && (
                        <p className='text-xs text-muted-foreground truncate'>
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* ✅ Fix: عرض الـ difficulty إن وُجد */}
                    {item.difficulty && (
                      <Badge
                        variant='outline'
                        className='text-xs capitalize shrink-0 hidden sm:inline-flex'>
                        {t(
                          `search.difficulty.${item.difficulty}`,
                          item.difficulty,
                        )}
                      </Badge>
                    )}

                    <Badge
                      variant='secondary'
                      className='text-xs capitalize shrink-0'>
                      {t(`search.type.${item.type}`, item.type)}
                    </Badge>
                    <ArrowRight className='w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180' />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            // ✅ Fix: suggestions من locale
            <div className='p-4 space-y-3'>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1'>
                {t('search.suggestionsLabel')}
              </p>
              <div className='flex flex-wrap gap-2'>
                {Array.isArray(suggestions) &&
                  suggestions.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className='text-xs px-3 py-1.5 rounded-full border bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground'>
                      {s}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── SearchButton trigger ─────────────────────────────────────────────────────

export function SearchButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation('common');

  return (
    <button
      onClick={onClick}
      className='hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground w-64 text-sm h-9 rounded-md border border-input bg-background px-3 shadow-sm hover:bg-accent transition-colors'>
      <Search className='w-4 h-4 shrink-0' />
      {/* ✅ Fix: text-left → text-start (RTL-aware) */}
      <span className='flex-1 text-start'>{t('search.button')}</span>
      <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
        <span>{isMac ? '⌘' : 'Ctrl'}</span>K
      </kbd>
    </button>
  );
}
