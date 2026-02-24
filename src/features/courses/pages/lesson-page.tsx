// src/features/courses/pages/lesson-page.tsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { TopicSidebar } from '../components/topic-sidebar';
import { PaywallOverlay } from '../components/paywall-overlay';
import CourseElementRenderer from '../components/CourseElementRenderer';
import { useCourse } from '../hooks/use-course';
import { useTopic, useMarkTopicComplete } from '../hooks/use-topic';
import { useCourseProgressStore } from '../store/course-progress.store';
// import { useNavigate as useNav } from 'react-router-dom';

export default function LessonPage() {
  const { slug = '', topicId = '' } = useParams<{
    slug: string;
    topicId: string;
  }>();
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Data ─────────────────────────────────────────────
  const { data: course, isLoading: courseLoading } = useCourse(slug);
  const { data: topic, isLoading: topicLoading } = useTopic(slug, topicId);
  const { mutate: markComplete, isPending: marking } = useMarkTopicComplete();
  const { isEnrolled, isTopicCompleted } = useCourseProgressStore();

  const isLoading = courseLoading || topicLoading;
  const enrolled = course ? isEnrolled(course.id) : false;
  const isCompleted = course ? isTopicCompleted(course.id, topicId) : false;

  // ── Navigation between topics ─────────────────────────
  const sections = course?.sections ?? [];
  const currentIdx = sections.findIndex((s) => s.id === topicId);
  const prevSection = sections[currentIdx - 1];
  const nextSection = sections[currentIdx + 1];

  const navigate_topic = (id: string) => {
    navigate(ROUTES.COURSES.TOPIC(slug, id));
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  const handleMarkComplete = () => {
    if (!course) return;
    markComplete(
      { courseId: course.id, topicId },
      {
        onSuccess: () => {
          // Auto-advance to next topic
          if (nextSection) {
            setTimeout(() => navigate_topic(nextSection.id), 600);
          }
        },
      },
    );
  };

  // ── Access check: is this topic locked? ──────────────
  const isLocked =
    course && !enrolled && course.access !== 'free' && currentIdx > 0; // first topic always free

  // ── Topic title ──────────────────────────────────────
  const topicTitle =
    (lang === 'ar'
      ? sections[currentIdx]?.ar_title
      : sections[currentIdx]?.title) ??
    topic?.title?.[lang === 'ar' ? 'ar' : 'en'] ??
    '';

  return (
    <div className='flex h-[calc(100vh-56px)] overflow-hidden bg-background'>
      {/* ── Sidebar (desktop always visible, mobile drawer) ── */}
      {/* Backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-30 w-72 border-e border-border/50 bg-card flex flex-col',
          'transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto',
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full rtl:translate-x-full',
        )}>
        {/* Sidebar header */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-border/50 shrink-0'>
          <Link
            to={ROUTES.COURSES.DETAIL(slug)}
            className='text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors'>
            {lang === 'ar' ? course?.ar_title : course?.title}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden text-muted-foreground hover:text-foreground transition-colors'>
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Sidebar content */}
        <div className='flex-1 overflow-hidden'>
          {course && (
            <TopicSidebar
              courseSlug={slug}
              courseId={course.id}
              sections={course.sections}
              access={course.access}
              isEnrolled={enrolled}
            />
          )}
        </div>
      </aside>

      {/* ── Main content area ─────────────────────────── */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        {/* Top bar */}
        <div className='flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-card shrink-0'>
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className='lg:hidden text-muted-foreground hover:text-foreground transition-colors'>
            <Menu className='h-5 w-5' />
          </button>

          {/* Breadcrumb */}
          <div className='flex-1 flex items-center gap-1.5 text-sm text-muted-foreground min-w-0'>
            <Link
              to={ROUTES.COURSES.LIST}
              className='hover:text-foreground transition-colors shrink-0'>
              {t('topbar.courses', 'Courses')}
            </Link>
            <ChevronRight className='h-3.5 w-3.5 shrink-0 rtl:rotate-180' />
            <Link
              to={ROUTES.COURSES.DETAIL(slug)}
              className='hover:text-foreground transition-colors truncate max-w-[120px]'>
              {lang === 'ar' ? course?.ar_title : course?.title}
            </Link>
            <ChevronRight className='h-3.5 w-3.5 shrink-0 rtl:rotate-180' />
            <span className='text-foreground truncate'>{topicTitle}</span>
          </div>

          {/* Prev / Next */}
          <div className='flex items-center gap-1 shrink-0'>
            <Button
              variant='ghost'
              size='sm'
              disabled={!prevSection}
              onClick={() => prevSection && navigate_topic(prevSection.id)}
              className='h-8 px-2 text-xs'>
              <ChevronLeft className='h-4 w-4 rtl:rotate-180' />
              <span className='hidden sm:inline ms-1'>
                {t('nav.prev', 'Prev')}
              </span>
            </Button>
            <span className='text-xs text-muted-foreground'>
              {currentIdx + 1}/{sections.length}
            </span>
            <Button
              variant='ghost'
              size='sm'
              disabled={!nextSection}
              onClick={() => nextSection && navigate_topic(nextSection.id)}
              className='h-8 px-2 text-xs'>
              <span className='hidden sm:inline me-1'>
                {t('nav.next', 'Next')}
              </span>
              <ChevronRight className='h-4 w-4 rtl:rotate-180' />
            </Button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className='flex-1 overflow-y-auto'>
          <div className='max-w-3xl mx-auto px-4 py-8'>
            {/* Loading */}
            {isLoading && <TopicSkeleton />}

            {/* Locked */}
            {!isLoading && isLocked && course && (
              <PaywallOverlay
                access={course.access}
                courseTitle={lang === 'ar' ? course.ar_title : course.title}
                onUpgrade={() => navigate(ROUTES.PRICING ?? '/pricing')}
              />
            )}

            {/* Error */}
            {!isLoading && !topic && !isLocked && (
              <div className='flex flex-col items-center justify-center py-24 gap-4'>
                <AlertTriangle className='h-10 w-10 text-muted-foreground' />
                <p className='text-muted-foreground text-sm'>
                  {t('topic.notFound', 'Topic content not found')}
                </p>
              </div>
            )}

            {/* Topic title */}
            {!isLoading && !isLocked && topic && (
              <>
                <h1 className='text-2xl md:text-3xl font-black text-foreground mb-8 leading-tight'>
                  {topicTitle}
                </h1>

                {/* Render elements */}
                <CourseElementRenderer elements={topic.elements} />

                {/* ── Bottom Actions ──────────────────── */}
                <div className='mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4'>
                  {/* Prev */}
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={!prevSection}
                    onClick={() =>
                      prevSection && navigate_topic(prevSection.id)
                    }>
                    <ChevronLeft className='h-4 w-4 me-1 rtl:rotate-180' />
                    {t('nav.prev', 'Previous')}
                  </Button>

                  {/* Mark complete / Next */}
                  <div className='flex gap-2'>
                    {!isCompleted ? (
                      <Button
                        onClick={handleMarkComplete}
                        disabled={marking}
                        className='min-w-[180px]'>
                        {marking ? (
                          <Loader2 className='h-4 w-4 me-2 animate-spin' />
                        ) : (
                          <CheckCircle className='h-4 w-4 me-2' />
                        )}
                        {t('topic.markComplete', 'Mark as Complete')}
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        className='min-w-[180px] text-emerald-500 border-emerald-500/30'
                        disabled>
                        <CheckCircle className='h-4 w-4 me-2' />
                        {t('topic.completed', 'Completed!')}
                      </Button>
                    )}

                    {nextSection && (
                      <Button
                        variant='default'
                        onClick={() => navigate_topic(nextSection.id)}>
                        {t('nav.next', 'Next')}
                        <ChevronRight className='h-4 w-4 ms-1 rtl:rotate-180' />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────
function TopicSkeleton() {
  return (
    <div className='space-y-5 animate-pulse'>
      <Skeleton className='h-9 w-3/4' />
      <div className='space-y-3'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
      </div>
      <Skeleton className='h-48 w-full rounded-xl' />
      <div className='space-y-3'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-4/5' />
      </div>
    </div>
  );
}
