// src/features/courses/components/course-labs-section.tsx
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/core/api/client';
import { FlaskConical, Clock, Zap, ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';

interface CourseLab {
  id: string;
  slug: string;
  title: string;
  ar_title?: string | null;
  difficulty: string;
  duration?: number;
  xpReward?: number;
  category?: string;
}

interface Props {
  courseSlug: string;
  courseId: string;
}

const DIFF_BADGE: Record<string, string> = {
  BEGINNER:     'border-emerald-500/25 bg-emerald-500/10 text-emerald-400',
  INTERMEDIATE: 'border-amber-500/25   bg-amber-500/10   text-amber-400',
  ADVANCED:     'border-red-500/25     bg-red-500/10     text-red-400',
};

export function CourseLabsSection({ courseSlug }: Props) {
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{ labs: CourseLab[] }>({
    queryKey: ['courses', courseSlug, 'labs'],
    queryFn: () =>
      apiClient
        .get(`/courses/${courseSlug}/labs`)
        .then((r: any) => r?.data ?? r),
    staleTime: 1000 * 60 * 10,
    placeholderData: { labs: [] },
  });

  const labs = data?.labs ?? [];

  // Show nothing if no labs
  if (!isLoading && labs.length === 0) return null;

  // Preview: show max 4 labs inline, rest on the full page
  const PREVIEW_COUNT = 4;
  const previewLabs = labs.slice(0, PREVIEW_COUNT);
  const hasMore = labs.length > PREVIEW_COUNT;

  return (
    <section id='course-labs-section' className='mt-10'>

      {/* Header */}
      <div className='flex items-center gap-2 mb-5'>
        <div className='h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center'>
          <FlaskConical className='h-4 w-4 text-emerald-500' />
        </div>
        <div className='flex-1'>
          <h2 className='text-lg font-bold text-foreground leading-none'>
            {t('detail.labs', 'Hands-on Labs')}
          </h2>
          {!isLoading && (
            <p className='text-xs text-muted-foreground mt-0.5'>
              {labs.length} {t('detail.labsCount', 'labs in this course')}
            </p>
          )}
        </div>
        {/* View all button */}
        {!isLoading && labs.length > 0 && (
          <button
            onClick={() => navigate(ROUTES.COURSES.LABS(courseSlug))}
            className='flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-2 shrink-0'>
            View all
            <ArrowRight className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      {/* Skeletons */}
      {isLoading && (
        <div className='grid sm:grid-cols-2 gap-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-20 w-full rounded-xl' />
          ))}
        </div>
      )}

      {/* Preview list */}
      {!isLoading && (
        <div className='grid sm:grid-cols-2 gap-3'>
          {previewLabs.map((lab) => {
            const title = lang === 'ar' && lab.ar_title ? lab.ar_title : lab.title;
            const diffBadge =
              DIFF_BADGE[lab.difficulty?.toUpperCase() ?? ''] ?? DIFF_BADGE.BEGINNER;

            return (
              <button
                key={lab.id}
                type='button'
                onClick={() => navigate(ROUTES.LABS.DETAIL(lab.slug))}
                className={cn(
                  'group flex items-center gap-3 p-3.5 rounded-xl text-start w-full',
                  'border border-border/50 bg-card hover:border-emerald-500/30',
                  'hover:bg-emerald-500/5 transition-all duration-200',
                )}>
                <div className='shrink-0 h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center'>
                  <FlaskConical className='h-5 w-5 text-emerald-500' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-foreground truncate leading-snug'>
                    {title}
                  </p>
                  <div className='flex items-center gap-2 mt-1 flex-wrap'>
                    <Badge
                      variant='outline'
                      className={cn('text-[10px] px-1.5 py-px rounded-full', diffBadge)}>
                      {lab.difficulty}
                    </Badge>
                    {lab.duration && (
                      <span className='flex items-center gap-1 text-[11px] text-muted-foreground'>
                        <Clock className='h-3 w-3' />
                        {lab.duration}m
                      </span>
                    )}
                    {lab.xpReward && (
                      <span className='flex items-center gap-1 text-[11px] text-amber-500'>
                        <Zap className='h-3 w-3' />
                        {lab.xpReward} XP
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className='h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors shrink-0 rtl:rotate-180' />
              </button>
            );
          })}
        </div>
      )}

      {/* Show more CTA */}
      {!isLoading && hasMore && (
        <button
          onClick={() => navigate(ROUTES.COURSES.LABS(courseSlug))}
          className={cn(
            'mt-4 w-full flex items-center justify-center gap-2',
            'rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3',
            'text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors',
          )}>
          <FlaskConical className='h-4 w-4' />
          View {labs.length - PREVIEW_COUNT} more labs
          <ArrowRight className='h-4 w-4' />
        </button>
      )}
    </section>
  );
}
