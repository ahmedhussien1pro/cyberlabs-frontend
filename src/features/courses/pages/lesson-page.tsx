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
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { TopicSidebar } from '../components/topic-sidebar';
import { PaywallOverlay } from '../components/paywall-overlay';
import CourseElementRenderer from '../components/CourseElementRenderer';
import { CourseCompletionModal } from '../components/course-completion-modal';
import { useCourse } from '../hooks/use-course';
import { useCourseContent, useMarkTopicComplete } from '../hooks/use-topic';
import { useUserProgress, useResetProgress } from '../hooks/use-user-progress';

export default function LessonPage() {
  const { slug = '', topicId = '' } = useParams<{
    slug: string;
    topicId: string;
  }>();
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // ✅ ref على الـ scrollable container
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ كل ما يتغير الـ topicId يسكرول للأول — يغطي كل طرق التنقل
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [topicId]);

  const { data: course, isLoading: courseLoading } = useCourse(slug);
  const { data: content, isLoading: contentLoading } = useCourseContent(slug);
  const { mutate: markComplete, isPending: marking } = useMarkTopicComplete();
  const { mutate: resetProgress } = useResetProgress();

  const { isEnrolled, isTopicCompleted } = useUserProgress();

  const isLoading = courseLoading || contentLoading;
  const enrolled = course ? isEnrolled(course.id) : false;
  const isCompleted = course ? isTopicCompleted(course.id, topicId) : false;

  const sections = course?.sections ?? [];
  const currentIdx = sections.findIndex((s) => s.id === topicId);
  const prevSection = currentIdx > 0 ? sections[currentIdx - 1] : null;
  const nextSection =
    currentIdx < sections.length - 1 ? sections[currentIdx + 1] : null;
  const topicContent = content?.topics?.[currentIdx] ?? null;

  const topicTitle =
    lang === 'ar'
      ? (sections[currentIdx]?.ar_title ??
        sections[currentIdx]?.title ??
        topicContent?.title?.ar ??
        '')
      : (sections[currentIdx]?.title ?? topicContent?.title?.en ?? '');

  const courseDisplayTitle =
    lang === 'ar'
      ? (course?.ar_title ?? course?.title ?? '')
      : (course?.title ?? '');

  const navigate_topic = (id: string) => {
    navigate(ROUTES.COURSES.TOPIC(slug, id));
    setSidebarOpen(false);
    // ✅ لا حاجة لـ window.scrollTo — الـ useEffect بيتكفل بيه
  };

  const handleMarkComplete = () => {
    if (!course) return;
    markComplete(
      { courseId: course.id, topicId },
      {
        onSuccess: () => {
          if (!nextSection) {
            setShowCompletionModal(true);
          } else {
            setTimeout(() => navigate_topic(nextSection.id), 600);
          }
        },
      },
    );
  };

  const handleReset = () => {
    if (!course) return;
    resetProgress(course.id, {
      onSuccess: () => {
        setShowCompletionModal(false);
        if (sections.length > 0) {
          navigate_topic(sections[0].id);
        }
      },
    });
  };

  const isLocked =
    !!course &&
    !enrolled &&
    course.access !== 'FREE' &&
    course.access !== ('free' as any) &&
    currentIdx > 0;

  return (
    <div className='flex h-[calc(100vh-56px)] overflow-hidden bg-background'>
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
        <div className='flex items-center justify-between px-4 py-3 border-b border-border/50 shrink-0'>
          <Link
            to={ROUTES.COURSES.DETAIL(slug)}
            className='text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors'>
            {courseDisplayTitle}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden text-muted-foreground hover:text-foreground transition-colors'>
            <X className='h-4 w-4' />
          </button>
        </div>
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

      <main className='flex-1 flex flex-col overflow-hidden'>
        <div className='flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-card shrink-0'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='lg:hidden text-muted-foreground hover:text-foreground transition-colors'>
            <Menu className='h-5 w-5' />
          </button>
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
              {courseDisplayTitle}
            </Link>
            <ChevronRight className='h-3.5 w-3.5 shrink-0 rtl:rotate-180' />
            <span className='text-foreground truncate'>{topicTitle}</span>
          </div>
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

        {/* ✅ scrollRef هنا — ده الـ container الفعلي اللي بيتسكرول */}
        <div ref={scrollRef} className='flex-1 overflow-y-auto'>
          <div className='max-w-3xl mx-auto px-4 py-8'>
            {isLoading && <TopicSkeleton />}
            {!isLoading && isLocked && course && (
              <PaywallOverlay
                access={course.access}
                courseTitle={courseDisplayTitle}
                onUpgrade={() => navigate('/pricing')}
              />
            )}
            {!isLoading && !topicContent && !isLocked && (
              <div className='flex flex-col items-center justify-center py-24 gap-4'>
                <AlertTriangle className='h-10 w-10 text-muted-foreground' />
                <p className='text-muted-foreground text-sm'>
                  {t('topic.notFound', 'Topic content not found')}
                </p>
              </div>
            )}
            {!isLoading && !isLocked && topicContent && (
              <>
                <h1 className='text-2xl md:text-3xl font-black text-foreground mb-8 leading-tight'>
                  {topicTitle}
                </h1>
                <CourseElementRenderer elements={topicContent.elements} />
                <div className='mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4'>
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
                  <div className='flex gap-2'>
                    {!isCompleted ? (
                      <Button
                        onClick={handleMarkComplete}
                        disabled={marking || !enrolled}
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

      <CourseCompletionModal
        open={showCompletionModal}
        courseTitle={courseDisplayTitle}
        onClose={() => setShowCompletionModal(false)}
        onReset={enrolled ? handleReset : undefined}
      />
    </div>
  );
}

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
