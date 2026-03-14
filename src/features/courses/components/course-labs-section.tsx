// src/features/courses/components/course-labs-section.tsx
// Simplified: show only a "Go to Labs" CTA button — no inline lab cards.
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/core/api/client';
import { FlaskConical, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';

interface CourseLab {
  id: string;
  slug: string;
  title: string;
}

interface Props {
  courseSlug: string;
  courseId: string;
}

export function CourseLabsSection({ courseSlug }: Props) {
  const { t } = useTranslation('courses');
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

  // Hide section if no labs and not loading
  if (!isLoading && labs.length === 0) return null;

  return (
    <section id='course-labs-section' className='mt-10'>
      <button
        onClick={() => navigate(ROUTES.COURSES.LABS(courseSlug))}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl',
          'border border-emerald-500/25 bg-emerald-500/5',
          'hover:bg-emerald-500/10 hover:border-emerald-500/40',
          'transition-all duration-200 group',
        )}
      >
        <div className='flex items-center gap-3'>
          <div className='h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0'>
            <FlaskConical className='h-4.5 w-4.5 text-emerald-500' />
          </div>
          <div className='text-start'>
            <p className='text-sm font-bold text-foreground leading-none'>
              {t('detail.labs', 'Hands-on Labs')}
            </p>
            {!isLoading && labs.length > 0 && (
              <p className='text-xs text-muted-foreground mt-0.5'>
                {labs.length} {t('detail.labsCount', 'labs in this course')}
              </p>
            )}
          </div>
        </div>
        <ArrowRight className='h-4 w-4 text-emerald-500 group-hover:translate-x-1 transition-transform shrink-0 rtl:rotate-180' />
      </button>
    </section>
  );
}
