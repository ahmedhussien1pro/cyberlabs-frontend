import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/shared/constants';
import { useCourse } from '../hooks/use-course';
import { CourseDetailHero } from '../components/course-detail-hero';
import { CourseCurriculum } from '../components/course-curriculum';

function DetailSkeleton() {
  return (
    <div className='space-y-6 p-6'>
      <Skeleton className='h-6 w-48' />
      <Skeleton className='h-12 w-3/4' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-5/6' />
      <div className='grid gap-4 pt-4 lg:grid-cols-[1fr_360px]'>
        <Skeleton className='h-64 rounded-2xl' />
        <Skeleton className='h-64 rounded-2xl' />
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('courses');
  const { data: course, isLoading, isError } = useCourse(slug ?? '');

  if (isLoading) return <DetailSkeleton />;

  if (isError || !course) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 py-32'>
        <AlertCircle className='h-10 w-10 text-destructive/50' />
        <p className='text-muted-foreground'>
          {t('detail.notFound', 'Course not found.')}
        </p>
        <Link
          to={ROUTES.COURSES?.LIST ?? '/courses'}
          className='flex items-center gap-1.5 text-sm text-primary hover:underline'>
          <ArrowLeft className='h-3.5 w-3.5' />
          {t('detail.backToCourses', 'Back to Courses')}
        </Link>
      </div>
    );
  }

  const isLocked = course.access !== 'free';
  const data = course.en_data; // useCourse ممكن تضيف i18n بعدين

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <CourseDetailHero course={course} />

      {/* Body */}
      <div className='container mx-auto px-4 py-10'>
        <div className='grid gap-8 lg:grid-cols-[1fr_320px]'>
          {/* LEFT — curriculum + description */}
          <div className='flex flex-col gap-8'>
            {/* What you'll learn */}
            {data.skills.length > 0 && (
              <div className='rounded-2xl border border-border/50 bg-card p-5'>
                <h2 className='mb-4 text-base font-bold'>
                  {t('detail.whatYouLearn', "What You'll Learn")}
                </h2>
                <ul className='grid gap-2 sm:grid-cols-2'>
                  {data.skills.map((s) => (
                    <li
                      key={s}
                      className='flex items-start gap-2 text-sm text-muted-foreground'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prerequisites */}
            {data.prerequisites.length > 0 && (
              <div className='rounded-2xl border border-border/50 bg-card p-5'>
                <h2 className='mb-3 text-base font-bold'>
                  {t('detail.prerequisites', 'Prerequisites')}
                </h2>
                <ul className='flex flex-col gap-1.5'>
                  {data.prerequisites.map((p) => (
                    <li
                      key={p}
                      className='flex items-start gap-2 text-sm text-muted-foreground'>
                      <BookOpen className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60' />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Curriculum */}
            {course.sections && course.sections.length > 0 ? (
              <CourseCurriculum
                sections={course.sections}
                enrolled={course.enrolled}
              />
            ) : (
              <div className='rounded-2xl border border-dashed border-border/50 p-10 text-center text-sm text-muted-foreground'>
                {t('detail.curriculumSoon', 'Curriculum coming soon.')}
              </div>
            )}
          </div>

          {/* RIGHT — sticky CTA */}
          <div className='lg:sticky lg:top-24 h-fit'>
            <div className='rounded-2xl border border-border/50 bg-card p-5 shadow-lg'>
              <div className='mb-4 text-2xl font-black'>
                {course.access === 'free' ? (
                  t('detail.free', 'Free')
                ) : (
                  <span className='capitalize'>{course.access}</span>
                )}
              </div>

              {course.enrolled ? (
                <Button className='w-full' size='lg'>
                  {t('detail.continueLearning', 'Continue Learning')}
                </Button>
              ) : (
                <Button
                  className='w-full'
                  size='lg'
                  variant={isLocked ? 'outline' : 'default'}>
                  {isLocked ? (
                    <>
                      <Lock className='me-2 h-4 w-4' />
                      {t('detail.unlock', 'Unlock Course')}
                    </>
                  ) : (
                    t('detail.enroll', 'Enroll for Free')
                  )}
                </Button>
              )}

              {/* Includes */}
              <ul className='mt-5 flex flex-col gap-2 border-t border-border/40 pt-4 text-xs text-muted-foreground'>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
                  {course.totalLessons} {t('detail.lessons', 'lessons')}
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
                  {course.estimatedHours}h{' '}
                  {t('detail.totalContent', 'of content')}
                </li>
                {course.sections?.some((s) =>
                  s.lessons.some((l) => l.type === 'lab'),
                ) && (
                  <li className='flex items-center gap-2'>
                    <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
                    {t('detail.handsOnLabs', 'Hands-on labs')}
                  </li>
                )}
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
                  {t('detail.certificate', 'Certificate of completion')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
