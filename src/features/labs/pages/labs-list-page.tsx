// src/features/labs/pages/labs-list-page.tsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Terminal,
  Shield,
  Zap,
  CheckCircle2,
  TrendingUp,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MainLayout from '@/shared/components/layout/main-layout';
import { MatrixRain } from '@/shared/components/common/landing/matrix-rain';
import { Skeleton } from '@/components/ui/skeleton';
import { LabCard } from '../components/lab-card';
import { useLabs } from '../hooks/use-labs';

const DIFF_FILTERS = [
  { v: 'all', label: 'All' },
  { v: 'BEGINNER',     label: 'Beginner',     activeClass: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' },
  { v: 'INTERMEDIATE', label: 'Intermediate', activeClass: 'border-yellow-500/50  text-yellow-400  bg-yellow-500/10'  },
  { v: 'ADVANCED',     label: 'Advanced',     activeClass: 'border-red-500/50     text-red-400     bg-red-500/10'     },
];

const SKELETON_COUNT = 8;

export default function LabListPage() {
  const { i18n } = useTranslation('labs');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const { data, isLoading, isError } = useLabs();

  const allLabs = useMemo(
    () => data?.categories.flatMap((c) => c.labs) ?? [],
    [data],
  );

  const [search, setSearch]       = useState('');
  const [activeDiff, setActiveDiff] = useState<string>('all');

  const filtered = useMemo(() => {
    if (!data?.categories) return [];
    return data.categories
      .map((cat) => ({
        ...cat,
        labs: cat.labs.filter((lab) => {
          const matchDiff   = activeDiff === 'all' || lab.difficulty === activeDiff;
          const q           = search.toLowerCase();
          const matchSearch =
            !q ||
            lab.title.toLowerCase().includes(q) ||
            lab.ar_title.toLowerCase().includes(q) ||
            lab.skills?.some((s) => s.toLowerCase().includes(q));
          return matchDiff && matchSearch;
        }),
      }))
      .filter((cat) => cat.labs.length > 0);
  }, [data, search, activeDiff]);

  const stats = useMemo(() => ({
    total:        allLabs.length,
    beginner:     allLabs.filter((l) => l.difficulty === 'BEGINNER').length,
    intermediate: allLabs.filter((l) => l.difficulty === 'INTERMEDIATE').length,
    solved:       allLabs.filter((l) => l.usersProgress?.[0]?.flagSubmitted).length,
  }), [allLabs]);

  const totalFiltered = filtered.reduce((n, c) => n + c.labs.length, 0);

  return (
    <MainLayout>
      <div className='min-h-screen bg-background'>

        {/* ── Hero ── */}
        <div className='relative overflow-hidden border-b border-border/50 bg-background/80'>
          <MatrixRain className='absolute inset-0 opacity-[0.07]' />
          <div className='relative z-10 container mx-auto px-4 py-14 text-center space-y-4'>

            <span className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold text-primary uppercase tracking-wider'>
              <Terminal className='h-3.5 w-3.5' />
              Practice Labs
            </span>

            <h1 className='text-4xl md:text-5xl font-black tracking-tight text-foreground'>
              Hack. <span className='text-primary'>Learn.</span> Master.
            </h1>

            <p className='text-muted-foreground text-base max-w-lg mx-auto'>
              Real-world vulnerable environments — no setup needed.
              Attack, exploit, and submit the flag.
            </p>

            {!isLoading && data && (
              <div className='flex items-center justify-center gap-8 pt-3 flex-wrap'>
                {[
                  { Icon: Shield,       label: 'Total Labs',   value: stats.total,        cls: 'text-foreground'  },
                  { Icon: TrendingUp,   label: 'Beginner',     value: stats.beginner,     cls: 'text-emerald-400' },
                  { Icon: Zap,          label: 'Intermediate', value: stats.intermediate, cls: 'text-yellow-400'  },
                  { Icon: CheckCircle2, label: 'Solved',       value: stats.solved,       cls: 'text-primary'    },
                ].map(({ Icon, label, value, cls }) => (
                  <div key={label} className='flex flex-col items-center gap-0.5'>
                    <div className='flex items-center gap-1.5'>
                      <Icon className={cn('h-4 w-4', cls)} />
                      <span className={cn('text-2xl font-black', cls)}>{value}</span>
                    </div>
                    <span className='text-[11px] text-muted-foreground uppercase tracking-wider'>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className='border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-30'>
          <div className='container mx-auto px-4 py-3 flex items-center gap-3 flex-wrap'>

            {/* Search */}
            <div className='relative flex-1 min-w-[180px] max-w-xs'>
              <Search className='absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search labs or skills...'
                className={
                  'w-full rounded-lg border border-border/60 bg-muted/40 ps-9 pe-3 py-1.5 ' +
                  'text-sm text-foreground placeholder:text-muted-foreground ' +
                  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all'
                }
              />
            </div>

            {/* Difficulty filters */}
            <div className='flex items-center gap-1.5'>
              <SlidersHorizontal className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
              {DIFF_FILTERS.map(({ v, label, activeClass }) => (
                <button
                  key={v}
                  onClick={() => setActiveDiff(v)}
                  className={cn(
                    'rounded-full border border-border/50 px-3 py-1 text-xs font-semibold transition-all',
                    'text-muted-foreground hover:text-foreground hover:border-border',
                    activeDiff === v
                      ? activeClass ?? 'border-primary/50 text-primary bg-primary/10'
                      : '',
                  )}>
                  {label}
                </button>
              ))}
            </div>

            {/* Count */}
            {!isLoading && (
              <span className='ms-auto text-xs text-muted-foreground hidden sm:flex items-center gap-1'>
                <Shield className='h-3 w-3' />
                <span className='font-bold text-foreground'>{totalFiltered}</span> labs
              </span>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className='container mx-auto px-4 py-10 space-y-12'>

          {/* Error */}
          {isError && (
            <div className='rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center text-sm text-destructive'>
              Failed to load labs. Please try again.
            </div>
          )}

          {/* Skeletons — 4-col compact grid */}
          {isLoading && (
            <div className='space-y-10'>
              {[1, 2].map((g) => (
                <div key={g} className='space-y-4'>
                  <Skeleton className='h-6 w-40 rounded-lg' />
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {Array.from({ length: SKELETON_COUNT / 2 }).map((_, i) => (
                      <div key={i} className='rounded-2xl border border-border/40 bg-card overflow-hidden'>
                        <Skeleton className='h-32 w-full' />
                        <div className='p-3 space-y-2'>
                          <div className='flex gap-1.5'>
                            {[1, 2].map((x) => <Skeleton key={x} className='h-4 w-12 rounded-full' />)}
                          </div>
                          <Skeleton className='h-4 w-3/4' />
                          <Skeleton className='h-8 w-full rounded-lg' />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Categories — 4-col compact grid */}
          {!isLoading && filtered.map((category) => (
            <section key={category.id} className='space-y-4'>
              <div className='flex items-center gap-3'>
                <h2 className='text-lg font-bold text-foreground'>
                  {lang === 'ar' ? category.ar_name : category.name}
                </h2>
                <span className='rounded-full bg-muted border border-border/40 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground'>
                  {category.labs.length}
                </span>
                <div className='flex-1 h-px bg-border/40' />
              </div>

              {/* compact=true → smaller cards, 4 columns on xl */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {category.labs.map((lab, i) => (
                  <LabCard key={lab.id} lab={lab} index={i} compact />
                ))}
              </div>
            </section>
          ))}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className='flex flex-col items-center justify-center py-28 gap-4 text-center'>
              <div className='h-14 w-14 rounded-2xl bg-muted flex items-center justify-center border border-border/40'>
                <Terminal className='h-7 w-7 text-muted-foreground' />
              </div>
              <p className='font-semibold text-foreground'>No labs match your filters</p>
              <p className='text-sm text-muted-foreground'>Try resetting or searching with different terms</p>
              <button
                onClick={() => { setSearch(''); setActiveDiff('all'); }}
                className='text-xs text-primary hover:underline underline-offset-2 flex items-center gap-1'>
                <SlidersHorizontal className='h-3 w-3' />
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
