// src/features/courses/pages/course-detail-page.tsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/core/api/client';
import MainLayout from '@/shared/components/layout/main-layout';
import { CourseCurriculum } from '../components/course-curriculum';
import { CourseDetailHero } from '../components/course-detail-hero';
import { useCourse } from '../hooks/use-course';
import { useEnrollment } from '../hooks/use-enrollment';
import {
  useUserProgress,
  useFavoriteMutation,
  useResetProgress,
} from '../hooks/use-user-progress';
import { useIsPro } from '@/features/pricing/hooks/use-pricing';
import { ROUTES } from '@/shared/constants';
import { toast } from 'sonner';

export default function CourseDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();

  const { data: course, isLoading, isError } = useCourse(slug);
  const { mutate: enroll, isPending: enrolling } = useEnrollment();
  const { mutate: resetProgress, isPending: resetting } = useResetProgress();

  const { isEnrolled, getProgress, getCompletedCount, isFavorite } =
    useUserProgress();

  const favMutation = useFavoriteMutation();
  const isPro = useIsPro();

  const { data: labsData } = useQuery<{ labs: any[] }>({
    queryKey: ['courses', slug, 'labs'],
    queryFn: () =>
      apiClient.get(`/courses/${slug}/labs`).then((r: any) => r?.data ?? r),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
    placeholderData: { labs: [] },
  });
  const hasLabs = (labsData?.labs?.length ?? 0) > 0;

  if (isLoading)
    return (
      <MainLayout>
        <CourseDetailSkeleton />
      </MainLayout>
    );

  if (isError || !course) {
    return (
      <MainLayout>
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
          <Shield className='h-12 w-12 text-muted-foreground' />
          <p className='font-semibold'>
            {t('detail.notFound', 'Course not found')}
          </p>
          <Link to={ROUTES.COURSES.LIST}>
            <Button variant='outline' size='sm'>
              {t('detail.backToList', 'All Courses')}
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id);
  const done = getCompletedCount(course.id);
  const fav = isFavorite(course.id);
  const longDesc =
    lang === 'ar' ? course.ar_longDescription : course.longDescription;

  const canProAccess =
    isPro && (course.access === 'PRO' || course.access === 'FREE');

  const handleEnroll = () => {
    if (course.access === 'FREE' || canProAccess) {
      enroll(course.id);
    } else {
      window.location.href = ROUTES.PRICING;
    }
  };

  const handleToggleFav = () => {
    favMutation.mutate(
      { courseId: course.id, isFav: fav },
      {
        onSuccess: () =>
          toast(fav ? 'Removed from favorites' : 'Added to favorites', {
            duration: 1500,
          }),
        onError: () => toast.error('Failed to update favorites'),
      },
    );
  };

  const handleContinue = () => {
    const el = document.getElementById(`topic-row-${done}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else
      document
        .getElementById('course-curriculum')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReset = () => {
    resetProgress(course.id, {
      onSuccess: () =>
        toast.success(t('detail.resetSuccess', 'Progress reset successfully')),
      onError: () =>
        toast.error(t('detail.resetError', 'Failed to reset progress')),
    });
  };

  return (
    <MainLayout>
      <div className='min-h-screen bg-background'>
        <CourseDetailHero
          course={course}
          enrolled={enrolled}
          enrolling={enrolling || resetting}
          progress={progress}
          done={done}
          fav={fav}
          isPro={canProAccess}
          hasLabs={hasLabs}
          onEnroll={handleEnroll}
          onToggleFav={handleToggleFav}
          onReset={enrolled ? handleReset : undefined}
          onContinue={handleContinue}
          onGoToLabs={() => navigate(ROUTES.COURSES.LABS(slug))}
        />

        <div className='container mx-auto px-4 py-10'>
          {longDesc && (
            <div className='mb-8 p-5 rounded-xl border border-border/40 bg-muted/20'>
              <p className='text-sm text-foreground/70 leading-7'>{longDesc}</p>
            </div>
          )}
          <CourseCurriculum
            course={course}
            isEnrolled={enrolled}
            hasLabs={hasLabs}
          />
        </div>
      </div>
    </MainLayout>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className='container mx-auto px-4 py-10'>
      <Skeleton className='h-4 w-28 mb-8' />
      <div className='grid lg:grid-cols-[1fr_320px] gap-10'>
        <div className='space-y-4'>
          <div className='flex gap-2'>
            <Skeleton className='h-6 w-16 rounded-full' />
            <Skeleton className='h-6 w-20 rounded-full' />
          </div>
          <Skeleton className='h-12 w-3/4' />
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-5/6' />
          <div className='grid sm:grid-cols-2 gap-2 pt-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-5 w-full' />
            ))}
          </div>
        </div>
        <div className='rounded-2xl border border-border/40 overflow-hidden'>
          <Skeleton className='h-44 w-full' />
          <div className='p-5 space-y-3'>
            <Skeleton className='h-11 w-full rounded-xl' />
            <Skeleton className='h-9 w-full rounded-xl' />
            <div className='grid grid-cols-2 gap-2 pt-2'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-4 w-full' />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
