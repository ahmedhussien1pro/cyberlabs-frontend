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
  FlaskConical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MainLayout from '@/shared/components/layout/main-layout';
import { DetailPageHero } from '@/shared/components/common/detail-page-hero';
import { Skeleton } from '@/components/ui/skeleton';
import { LabRowCard } from '../components/lab-row-card';
import { useLabs } from '../hooks/use-labs';

export default function LabListPage() {
  const { t, i18n } = useTranslation('labs');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const { data, isLoading, isError } = useLabs();

  const allLabs = useMemo(
    () => data?.categories.flatMap((c) => c.labs) ?? [],
    [data],
  );

  const [search, setSearch]         = useState('');
  const [activeDiff, setActiveDiff] = useState<string>('all');

  const DIFF_FILTERS = [
    { v: 'all',          label: t('filters.all', 'All') },
    { v: 'BEGINNER',     label: t('filters.beginner', 'Beginner'),     activeClass: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' },
    { v: 'INTERMEDIATE', label: t('filters.intermediate', 'Intermediate'), activeClass: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' },
    { v: 'ADVANCED',     label: t('filters.advanced', 'Advanced'),     activeClass: 'border-red-500/50 text-red-400 bg-red-500/10' },
  ];

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

        {/* Hero */}
        <DetailPageHero
          matrixColor='#10b981'
          stripeClass='bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500'
          bloomClass='bg-emerald-500'
          iconSlot={
            <div className='h-14 w-14 shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center ring-1 ring-white/10'>
              <FlaskConical className='h-7 w-7 text-emerald-400' />
            </div>
          }
          badgesSlot={
            <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider'>
              <Terminal className='h-3 w-3' />
              {t('list.eyebrow', 'Practice Labs')}
            </span>
          }
          titleSlot={
            <h1 className='text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl'>
              {t('list.titleStart', 'Hack.')}{' '}
              <span className='text-emerald-400'>{t('list.titleHighlight', 'Learn.')}</span>{' '}
              {t('list.titleEnd', 'Master.')}
            </h1>
          }
          descriptionSlot={
            <p className='mt-1 max-w-xl text-sm leading-relaxed text-white/60'>
              {t('list.subtitle', 'Real-world vulnerable environments — no setup needed. Attack, exploit, and submit the flag.')}
            </p>
          }
          statsSlot={
            !isLoading && data ? (
              <>
                {[
                  { Icon: Shield,       label: t('list.statsTotal', 'Total Labs'),   value: stats.total,        cls: 'text-white'       },
                  { Icon: TrendingUp,   label: t('list.statsBeginner', 'Beginner'),     value: stats.beginner,     cls: 'text-emerald-400' },
                  { Icon: Zap,          label: t('list.statsIntermediate', 'Intermediate'), value: stats.intermediate, cls: 'text-yellow-400'  },
                  { Icon: CheckCircle2, label: t('list.statsSolved', 'Solved'),       value: stats.solved,       cls: 'text-cyan-400'   },
                ].map(({ Icon, label, value, cls }) => (
                  <div key={label} className='flex items-center gap-1.5'>
                    <Icon className={cn('h-4 w-4', cls)} />
                    <span className={cn('font-black text-lg leading-none', cls)}>{value}</span>
                    <span className='text-[11px] text-white/40 uppercase tracking-wider'>{label}</span>
                  </div>
                ))}
              </>
            ) : null
          }
        />

        {/* Toolbar */}
        <div className='border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-30'>
          <div className='container mx-auto px-4 py-3 flex items-center gap-3 flex-wrap'>
            <div className='relative flex-1 min-w-[180px] max-w-xs'>
              <Search className='absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('filters.searchPlaceholder', 'Search labs or skills...')}
                className={
                  'w-full rounded-lg border border-border/60 bg-muted/40 ps-9 pe-3 py-1.5 ' +
                  'text-sm text-foreground placeholder:text-muted-foreground ' +
                  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all'
                }
              />
            </div>
            <div className='flex items-center gap-1.5'>
              <SlidersHorizontal className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
              {DIFF_FILTERS.map(({ v, label, activeClass }) => (
                <button
                  key={v}
                  onClick={() => setActiveDiff(v)}
                  className={cn(
                    'rounded-full border border-border/50 px-3 py-1 text-xs font-semibold transition-all',
                    'text-muted-foreground hover:text-foreground hover:border-border',
                    activeDiff === v ? activeClass ?? 'border-primary/50 text-primary bg-primary/10' : '',
                  )}>
                  {label}
                </button>
              ))}
            </div>
            {!isLoading && (
              <span className='ms-auto text-xs text-muted-foreground hidden sm:flex items-center gap-1'>
                <Shield className='h-3 w-3' />
                <span className='font-bold text-foreground'>{totalFiltered}</span> {t('filters.countLabel', 'labs')}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className='container mx-auto px-4 py-10 space-y-10'>

          {isError && (
            <div className='rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center text-sm text-destructive'>
              {t('list.error', 'Failed to load labs. Please try again.')}
            </div>
          )}

          {isLoading && (
            <div className='space-y-8'>
              {[1, 2].map((g) => (
                <div key={g} className='space-y-3'>
                  <Skeleton className='h-5 w-36 rounded-lg' />
                  <div className='space-y-2'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className='flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-card'>
                        <Skeleton className='h-9 w-9 rounded-lg shrink-0' />
                        <div className='flex-1 space-y-2'>
                          <Skeleton className='h-4 w-3/4' />
                          <div className='flex gap-2'>
                            <Skeleton className='h-4 w-20 rounded-full' />
                            <Skeleton className='h-4 w-12' />
                            <Skeleton className='h-4 w-14' />
                          </div>
                        </div>
                        <Skeleton className='h-4 w-4 rounded shrink-0' />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filtered.map((category) => (
            <section key={category.id} className='space-y-3'>
              <div className='flex items-center gap-3'>
                <h2 className='text-base font-bold text-foreground'>
                  {lang === 'ar' ? category.ar_name : category.name}
                </h2>
                <span className='rounded-full bg-muted border border-border/40 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground'>
                  {category.labs.length}
                </span>
                <div className='flex-1 h-px bg-border/40' />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {category.labs.map((lab, i) => (
                  <LabRowCard key={lab.id} lab={lab} index={i} />
                ))}
              </div>
            </section>
          ))}

          {!isLoading && filtered.length === 0 && (
            <div className='flex flex-col items-center justify-center py-28 gap-4 text-center'>
              <div className='h-14 w-14 rounded-2xl bg-muted flex items-center justify-center border border-border/40'>
                <Terminal className='h-7 w-7 text-muted-foreground' />
              </div>
              <p className='font-semibold text-foreground'>{t('list.empty', 'No labs match your filters')}</p>
              <p className='text-sm text-muted-foreground'>{t('list.emptyHint', 'Try resetting or searching with different terms')}</p>
              <button
                onClick={() => { setSearch(''); setActiveDiff('all'); }}
                className='text-xs text-primary hover:underline underline-offset-2 flex items-center gap-1'>
                <SlidersHorizontal className='h-3 w-3' />
                {t('list.clearFilters', 'Clear filters')}
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
