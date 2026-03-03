// src/features/courses/pages/course-detail-page.tsx
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/core/api/client';
import MainLayout from '@/shared/components/layout/main-layout';
import { CourseCurriculum } from '../components/course-curriculum';
import { CourseDetailHero } from '../components/course-detail-hero';
import { CourseLabsSection } from '../components/course-labs-section';
import { useCourse } from '../hooks/use-course';
import { useEnrollment } from '../hooks/use-enrollment';
import { useCourseProgressStore } from '../store/course-progress.store';
import { ROUTES } from '@/shared/constants';

export default function CourseDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const { data: course, isLoading, isError } = useCourse(slug);
  const { mutate: enroll, isPending: enrolling } = useEnrollment();
  const {
    isEnrolled,
    getProgress,
    getCompletedCount,
    toggleFavorite,
    isFavorite,
  } = useCourseProgressStore();

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
  const progress = getProgress(course.id, course.totalTopics);
  const done = getCompletedCount(course.id);
  const fav = isFavorite(course.id);
  const longDesc =
    lang === 'ar' ? course.ar_longDescription : course.longDescription;

  const handleEnroll = () => {
    if (course.access !== 'FREE') {
      window.location.href = ROUTES.PRICING;
      return;
    }
    enroll(course.id);
  };

  return (
    <MainLayout>
      <div className='min-h-screen bg-background'>
        <CourseDetailHero
          course={course}
          enrolled={enrolled}
          enrolling={enrolling}
          progress={progress}
          done={done}
          fav={fav}
          onEnroll={handleEnroll}
          onToggleFav={() => toggleFavorite(course.id)}
        />
        <div className='container mx-auto px-4 py-10'>
          {longDesc && (
            <div className='mb-8 p-5 rounded-xl border border-border/40 bg-muted/20'>
              <p className='text-sm text-foreground/70 leading-7'>{longDesc}</p>
            </div>
          )}

          {/* ✅ بيمرر hasLabs للـ curriculum عشان يعرض زر اللابس */}
          <CourseCurriculum
            course={course}
            isEnrolled={enrolled}
            hasLabs={hasLabs}
          />

          <CourseLabsSection courseSlug={slug} courseId={course.id} />
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
            <Skeleton className='h-9  w-full rounded-xl' />
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
