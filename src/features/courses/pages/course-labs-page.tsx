// src/features/courses/pages/course-labs-page.tsx
import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/core/api/client';
import MainLayout from '@/shared/components/layout/main-layout';
import { DetailPageHero } from '@/shared/components/common/detail-page-hero';
import { LabCard } from '@/features/labs/components/lab-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronRight,
  FlaskConical,
  Terminal,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import type { Lab } from '@/features/labs/types';

interface CourseLabsResponse {
  labs: Lab[];
  course?: { title: string; ar_title?: string; slug: string; color?: string };
}

export default function CourseLabsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('labs');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const [search, setSearch]         = useState('');
  const [activeDiff, setActiveDiff] = useState('all');

  const DIFF_FILTERS = [
    { v: 'all',          label: t('filters.all', 'All') },
    { v: 'BEGINNER',     label: t('filters.beginner', 'Beginner'),     activeClass: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' },
    { v: 'INTERMEDIATE', label: t('filters.intermediate', 'Intermediate'), activeClass: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' },
    { v: 'ADVANCED',     label: t('filters.advanced', 'Advanced'),     activeClass: 'border-red-500/50 text-red-400 bg-red-500/10' },
  ];

  const { data, isLoading, isError } = useQuery<CourseLabsResponse>({
    queryKey: ['courses', slug, 'labs'],
    queryFn: () =>
      apiClient.get(`/courses/${slug}/labs`).then((r: any) => r?.data ?? r),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
    placeholderData: { labs: [] },
  });

  const allLabs = data?.labs ?? [];
  const courseTitle =
    lang === 'ar' && data?.course?.ar_title
      ? data.course.ar_title
      : (data?.course?.title ?? slug ?? '');

  const solved     = allLabs.filter((l) => l.usersProgress?.[0]?.flagSubmitted).length;
  const inProgress = allLabs.filter((l) => l.usersProgress?.[0] && !l.usersProgress[0].flagSubmitted).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allLabs.filter((lab) => {
      const matchDiff   = activeDiff === 'all' || lab.difficulty === activeDiff;
      const matchSearch =
        !q ||
        lab.title.toLowerCase().includes(q) ||
        lab.ar_title?.toLowerCase().includes(q) ||
        lab.skills?.some((s) => s.toLowerCase().includes(q));
      return matchDiff && matchSearch;
    });
  }, [allLabs, search, activeDiff]);

  return (
    <MainLayout>
      <div className='min-h-screen bg-background'>

        {/* Hero */}
        <DetailPageHero
          matrixColor='#10b981'
          stripeClass='bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500'
          bloomClass='bg-emerald-500'
          breadcrumb={
            <>
              <Link to={ROUTES.COURSES.LIST} className='transition-colors hover:text-white/70'>
                {t('courseLabs.breadcrumbCourses', 'Courses')}
              </Link>
              <ChevronRight className='h-3 w-3 shrink-0' />
              <Link
                to={ROUTES.COURSES.DETAIL(slug!)}
                className='transition-colors hover:text-white/70 truncate max-w-[160px]'>
                {courseTitle}
              </Link>
              <ChevronRight className='h-3 w-3 shrink-0' />
              <span className='text-white/65'>{t('courseLabs.breadcrumbLabs', 'Labs')}</span>
            </>
          }
          iconSlot={
            <div className='h-14 w-14 shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center ring-1 ring-white/10'>
              <FlaskConical className='h-7 w-7 text-emerald-400' />
            </div>
          }
          badgesSlot={
            <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider'>
              <Terminal className='h-3 w-3' />
              {t('courseLabs.eyebrow', 'Hands-on Labs')}
            </span>
          }
          titleSlot={
            <h1 className='text-xl font-black leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl'>
              {courseTitle} — <span className='text-emerald-400'>{t('courseLabs.titleSuffix', 'Labs')}</span>
            </h1>
          }
          descriptionSlot={
            <p className='mt-1 max-w-xl text-sm leading-relaxed text-white/60'>
              {t('courseLabs.subtitle', 'Real-world vulnerable environments for this course. Complete all labs to master the skills.')}
            </p>
          }
          statsSlot={
            !isLoading ? (
              <>
                <div className='flex items-center gap-1.5'>
                  <FlaskConical className='h-4 w-4 text-emerald-400' />
                  <span className='font-black text-lg leading-none text-white'>{allLabs.length}</span>
                  <span className='text-[11px] text-white/40 uppercase tracking-wider'>{t('courseLabs.statsTotal', 'Total')}</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-400' />
                  <span className='font-black text-lg leading-none text-emerald-400'>{solved}</span>
                  <span className='text-[11px] text-white/40 uppercase tracking-wider'>{t('courseLabs.statsSolved', 'Solved')}</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <Lock className='h-4 w-4 text-yellow-400' />
                  <span className='font-black text-lg leading-none text-yellow-400'>{inProgress}</span>
                  <span className='text-[11px] text-white/40 uppercase tracking-wider'>{t('courseLabs.statsInProgress', 'In Progress')}</span>
                </div>
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
                    activeDiff === v ? (activeClass ?? 'border-primary/50 text-primary bg-primary/10') : '',
                  )}>
                  {label}
                </button>
              ))}
            </div>
            {!isLoading && (
              <span className='ms-auto text-xs text-muted-foreground hidden sm:flex items-center gap-1'>
                <FlaskConical className='h-3 w-3' />
                <span className='font-bold text-foreground'>{filtered.length}</span> {t('courseLabs.countLabel', 'labs')}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className='container mx-auto px-4 py-10'>

          {isError && (
            <div className='rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center text-sm text-destructive'>
              {t('courseLabs.error', 'Failed to load labs for this course. Please try again.')}
            </div>
          )}

          {isLoading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='rounded-2xl border border-border/40 bg-card overflow-hidden'>
                  <Skeleton className='aspect-video w-full' />
                  <div className='p-4 space-y-3'>
                    <div className='flex gap-2'>
                      {[1, 2, 3].map((x) => <Skeleton key={x} className='h-5 w-16 rounded-full' />)}
                    </div>
                    <Skeleton className='h-5 w-3/4' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-9 w-full rounded-lg' />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
              {filtered.map((lab, i) => (
                <LabCard key={lab.id} lab={lab} index={i} />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className='flex flex-col items-center justify-center py-28 gap-4 text-center'>
              <div className='h-14 w-14 rounded-2xl bg-muted flex items-center justify-center border border-border/40'>
                <Terminal className='h-7 w-7 text-muted-foreground' />
              </div>
              <p className='font-semibold text-foreground'>{t('courseLabs.empty', 'No labs match your filters')}</p>
              <p className='text-sm text-muted-foreground'>
                {allLabs.length === 0
                  ? t('courseLabs.noLabs', 'This course has no labs yet.')
                  : t('courseLabs.emptyHint', 'Try resetting or adjusting your search.')}
              </p>
              {allLabs.length > 0 && (
                <button
                  onClick={() => { setSearch(''); setActiveDiff('all'); }}
                  className='text-xs text-primary hover:underline underline-offset-2 flex items-center gap-1'>
                  <SlidersHorizontal className='h-3 w-3' />
                  {t('courseLabs.clearFilters', 'Clear filters')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
