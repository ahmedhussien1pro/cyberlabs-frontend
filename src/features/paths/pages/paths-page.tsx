// src/features/paths/pages/paths-page.tsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { Navbar } from '@/shared/components/layout/navbar';
import { Footer } from '@/shared/components/layout/footer';
import { PathCard } from '../components/path-card';
import { PathCardSkeleton } from '../components/path-card-skeleton';
import { PathsHero } from '../components/paths-hero';
import { PathsFilterTabs } from '../components/paths-filter-tabs';
import { usePaths } from '../hooks/use-paths';
import type { PathDifficulty } from '../types/path.types';

export default function PathsPage() {
  const { t } = useTranslation('paths');

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<PathDifficulty | 'all'>('all');

  const {
    data: paths,
    isLoading,
    isError,
  } = usePaths({
    search: search || undefined,
    difficulty: difficulty === 'all' ? undefined : difficulty,
  });
  const { data: allPaths } = usePaths();

  // Count per difficulty for filter tab badges
  const diffCounts = useMemo(() => {
    if (!allPaths) return {} as Record<string, number>;
    return allPaths.reduce<Record<string, number>>((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] ?? 0) + 1;
      return acc;
    }, {});
  }, [allPaths]);

  return (
    <>
      <Navbar />

      <div className='min-h-screen bg-background'>
        {/* Hero */}
        <PathsHero
          search={search}
          onSearchChange={setSearch}
          totalCount={allPaths?.length}
        />

        {/* Content */}
        <div className='container mx-auto px-4 py-10'>
          {/* Filter tabs */}
          <PathsFilterTabs
            active={difficulty}
            onChange={setDifficulty}
            counts={diffCounts}
            loading={isLoading}
          />

          {/* Grid */}
          <div className='mt-8'>
            {/* Error state */}
            {isError && (
              <div className='flex items-center justify-center gap-2 py-16 text-sm text-destructive'>
                <AlertCircle className='h-4 w-4' />
                {t('states.failedLoad')}
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && !isError && (
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <PathCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && (!paths || paths.length === 0) && (
              <div className='py-20 text-center'>
                <p className='text-lg font-semibold text-foreground'>
                  {t('states.noResults')}
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  {t('states.noResultsHint')}
                </p>
              </div>
            )}

            {/* Cards */}
            {!isLoading && !isError && paths && paths.length > 0 && (
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                {paths.map((path, i) => (
                  <PathCard key={path.id} path={path} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
