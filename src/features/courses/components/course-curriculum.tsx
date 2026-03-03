import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Lock,
  Clock3,
  Sparkles,
  FlaskConical,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useCourseProgressStore } from '../store/course-progress.store';
import { useCurriculum } from '../hooks/use-curriculum';
import { useMarkTopicComplete } from '../hooks/use-topic';
import type { Course } from '../types/course.types';
import CourseElementRenderer from './CourseElementRenderer';
import type { CourseElement } from '@/core/types/curriculumCourses.types';
import { CourseCompletionModal } from './course-completion-modal';

// ── Types ─────────────────────────────────────────────────────────────
type TopicState = 'done' | 'active' | 'locked' | 'soon';

interface CurriculumTopic {
  id: string;
  title: { en: string; ar: string };
  elements: CourseElement[];
}

// ── Helpers ────────────────────────────────────────────────────────────
function getTopicState(
  idx: number,
  sectionId: string, // ✅ DB Section UUID
  courseId: string,
  isEnrolled: boolean,
  courseState: string,
  isTopicCompleted: (c: string, t: string) => boolean,
): TopicState {
  if (courseState === 'COMING_SOON') return 'soon';
  if (!isEnrolled && idx >= 2) return 'locked';
  if (isTopicCompleted(courseId, sectionId)) return 'done'; // ✅ UUID
  return 'active';
}

// ── TopicRow ──────────────────────────────────────────────────────────
function TopicRow({
  courseId,
  topic,
  sectionId,
  topicIndex,
  total,
  isEnrolled,
  courseState,
  isOpen,
  onToggle,
  onCourseComplete,
}: {
  courseId: string;
  topic: CurriculumTopic;
  sectionId: string; // ✅ DB Section UUID
  topicIndex: number;
  total: number;
  isEnrolled: boolean;
  courseState: string;
  isOpen: boolean;
  onToggle: () => void;
  onCourseComplete: () => void;
}) {
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const { isTopicCompleted, isCourseCompleted } = useCourseProgressStore();
  const { mutate: markComplete, isPending: marking } = useMarkTopicComplete();

  const state = getTopicState(
    topicIndex,
    sectionId,
    courseId,
    isEnrolled,
    courseState,
    isTopicCompleted,
  );
  const isDone = state === 'done';
  const isLast = topicIndex === total - 1;
  const title = topic.title[lang] ?? topic.title.en;
  const topicNum = String(topicIndex + 1).padStart(2, '0');

  const handleMarkComplete = () => {
    if (!sectionId) return;
    markComplete(
      { courseId, topicId: sectionId }, // ✅ DB UUID → backend يقبله
      {
        onSuccess: () => {
          setTimeout(() => {
            if (isCourseCompleted(courseId, total)) {
              onCourseComplete();
            }
          }, 150);
        },
      },
    );
  };

  // لو الـ section مش موجود في DB (topic من JSON بس) → active
  const isDisabled = state === 'locked' || state === 'soon' || !sectionId;

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: topicIndex * 0.04 }}
      className='relative'>
      <div className='flex gap-4'>
        {/* Timeline */}
        <div className='relative flex shrink-0 flex-col items-center'>
          <div
            className={cn(
              'relative z-10 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300',
              isDone
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-500'
                : state === 'active'
                  ? 'border-primary bg-primary/15 text-primary shadow-lg shadow-primary/20'
                  : state === 'locked'
                    ? 'border-border/40 bg-muted/50 text-muted-foreground/50'
                    : 'border-dashed border-border/40 bg-muted/30 text-muted-foreground/40',
            )}>
            {isDone ? (
              <CheckCircle2 className='h-5 w-5' />
            ) : state === 'locked' ? (
              <Lock className='h-4 w-4' />
            ) : state === 'soon' ? (
              <Clock3 className='h-4 w-4' />
            ) : (
              <span className='font-black'>{topicNum}</span>
            )}
          </div>
          {!isLast && (
            <div
              className={cn(
                'flex-1 w-px min-h-[16px] mt-1 transition-colors duration-300',
                isDone ? 'bg-emerald-500/40' : 'bg-border/30',
              )}
            />
          )}
        </div>

        {/* Card */}
        <div
          className={cn(
            'mb-2 flex-1 min-w-0 rounded-xl border bg-card transition-all duration-300',
            isDisabled
              ? 'border-border/25 opacity-60'
              : isDone
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-border/50 hover:border-border cursor-pointer',
            isOpen && !isDone && 'border-primary/30 shadow-sm',
            isOpen && isDone && 'border-emerald-500/40 shadow-sm',
          )}>
          {/* Header */}
          <button
            type='button'
            disabled={isDisabled}
            onClick={onToggle}
            aria-expanded={isOpen}
            className='flex w-full items-center gap-3 px-4 py-3.5 text-start'>
            <span
              className={cn(
                'flex shrink-0 items-center justify-center h-8 w-8 rounded-lg border transition-colors duration-300',
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                  : state === 'active'
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border bg-muted text-muted-foreground',
              )}>
              {isDone ? (
                <CheckCircle2 className='h-4 w-4' />
              ) : state === 'locked' ? (
                <Lock className='h-3.5 w-3.5' />
              ) : state === 'soon' ? (
                <Clock3 className='h-3.5 w-3.5' />
              ) : (
                <BookOpen className='h-4 w-4' />
              )}
            </span>

            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-1.5 mb-0.5'>
                <span
                  className={cn(
                    'inline-flex rounded-full border px-1.5 py-px text-[9px] font-bold uppercase tracking-wide',
                    isDone
                      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-500'
                      : state === 'active'
                        ? 'border-primary/25 bg-primary/10 text-primary'
                        : 'border-border bg-muted text-muted-foreground',
                  )}>
                  {t('curriculum.topic', 'TOPIC')} {topicNum}
                </span>
                {!isEnrolled && topicIndex < 2 && (
                  <Badge
                    variant='outline'
                    className='rounded-full border-emerald-500/25 bg-emerald-500/10 px-1.5 py-px text-[9px] font-bold text-emerald-400'>
                    FREE PREVIEW
                  </Badge>
                )}
                {state === 'soon' && (
                  <span className='inline-flex items-center gap-1 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-1.5 py-px text-[9px] font-bold uppercase text-zinc-400'>
                    <Sparkles className='h-2 w-2' />{' '}
                    {t('curriculum.soon', 'SOON')}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  'text-sm font-semibold leading-snug transition-colors duration-300',
                  isDone ? 'text-emerald-400/80' : 'text-foreground',
                )}>
                {title}
              </p>
            </div>

            <div className='flex shrink-0 items-center gap-1.5'>
              {isDone && (
                <span className='flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400'>
                  <CheckCheck className='h-3 w-3' />
                  {t('curriculum.completed', 'Completed')}
                </span>
              )}
              {!isDisabled && (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-200 ms-1',
                    isOpen && 'rotate-180',
                  )}
                />
              )}
            </div>
          </button>

          {/* Expanded */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key='body'
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='overflow-hidden'>
                <div className='border-t border-border/40 px-5 pb-5 pt-4 space-y-4'>
                  {topic.elements.length === 0 ? (
                    <p className='text-sm text-muted-foreground italic'>
                      {t('topic.noContent', 'Content coming soon...')}
                    </p>
                  ) : (
                    <CourseElementRenderer elements={topic.elements} />
                  )}

                  {/* Mark Complete */}
                  {isEnrolled && sectionId && (
                    <div className='flex justify-end pt-3 border-t border-border/30'>
                      {isDone ? (
                        <span className='flex items-center gap-2 text-sm font-semibold text-emerald-500'>
                          <CheckCircle2 className='h-5 w-5' />
                          {t('curriculum.topicDone', 'Topic completed!')}
                        </span>
                      ) : (
                        <Button
                          size='sm'
                          onClick={handleMarkComplete}
                          disabled={marking}
                          className='gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold'>
                          {marking ? (
                            <>
                              <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                              {t('curriculum.marking', 'Marking...')}
                            </>
                          ) : (
                            <>
                              <CheckCheck className='h-4 w-4' />
                              {t('curriculum.markComplete', 'Mark as Complete')}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────
function CurriculumSkeleton() {
  return (
    <div className='space-y-3'>
      {[1, 2, 3].map((i) => (
        <div key={i} className='flex gap-4'>
          <div className='h-[50px] w-[50px] shrink-0 rounded-full bg-muted animate-pulse' />
          <div className='flex-1 rounded-xl border border-border/30 bg-muted/20 h-16 animate-pulse' />
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
interface CourseCurriculumProps {
  course: Course;
  isEnrolled: boolean;
  hasLabs?: boolean;
}

export function CourseCurriculum({
  course,
  isEnrolled,
  hasLabs = false,
}: CourseCurriculumProps) {
  const { t, i18n } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const [openId, setOpenId] = useState<string | null>(null);
  const [celebrateOpen, setCelebrateOpen] = useState(false);
  const { getProgress, getCompletedCount } = useCourseProgressStore();

  const { data: curriculumData, isLoading } = useCurriculum(course.slug);
  const topics = (curriculumData?.topics ?? []) as CurriculumTopic[];
  // ✅ DB sections — نفس الترتيب زي topics (seeded معاهم)
  const sections = course.sections ?? [];

  const toggle = (id: string) => setOpenId((p) => (p === id ? null : id));
  const total = topics.length;
  const doneCount = getCompletedCount(course.id);
  const pct = getProgress(course.id, total);

  const courseTitle =
    lang === 'ar' ? (course.ar_title ?? course.title) : course.title;

  const handleScrollToLabs = () => {
    document
      .getElementById('course-labs-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section>
      {/* ✅ Celebration popup عند 100% */}
      <CourseCompletionModal
        open={celebrateOpen}
        courseTitle={courseTitle}
        onClose={() => setCelebrateOpen(false)}
      />

      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            {t('detail.curriculum', 'Course Curriculum')}
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {total} {t('detail.topics', 'Topics')} ·{' '}
            {t('detail.followOrder', 'Follow the order for best results')}
          </p>
        </div>

        <div className='flex shrink-0 items-center gap-4 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5'>
          <div className='text-right'>
            <p className='text-[11px] text-muted-foreground'>
              {t('detail.yourProgress', 'Your progress')} ({doneCount}/{total})
            </p>
            <p className='text-lg font-black leading-none'>{pct}%</p>
          </div>
          <Progress value={pct} className='h-2 w-24' />
          <div className='text-right'>
            <p className='text-[11px] text-muted-foreground'>
              {t('detail.estTime', 'est. time')}
            </p>
            <p className='text-lg font-black leading-none'>
              {course.estimatedHours}h
            </p>
          </div>
        </div>
      </div>

      {/* Topics */}
      {isLoading ? (
        <CurriculumSkeleton />
      ) : topics.length === 0 ? (
        <p className='text-sm text-muted-foreground italic py-4'>
          {t('curriculum.empty', 'Curriculum not available yet.')}
        </p>
      ) : (
        <div className='relative'>
          <div
            aria-hidden='true'
            className='absolute top-5 bottom-5 start-[25px] w-px bg-border/40'
          />
          <ol className='space-y-2'>
            {topics.map((topic, idx) => (
              <TopicRow
                key={topic.id}
                courseId={course.id}
                topic={topic}
                sectionId={sections[idx]?.id ?? ''} // ✅ DB UUID بالـ index
                topicIndex={idx}
                total={total}
                isEnrolled={isEnrolled}
                courseState={course.state}
                isOpen={openId === topic.id}
                onToggle={() => toggle(topic.id)}
                onCourseComplete={() => setCelebrateOpen(true)}
              />
            ))}
          </ol>
        </div>
      )}

      {/* زر اللابس */}
      {hasLabs && (
        <div className='flex justify-center pt-4'>
          <Button
            variant='outline'
            size='lg'
            onClick={handleScrollToLabs}
            className={cn(
              'gap-2.5 min-w-[220px] rounded-xl border-primary/40',
              'hover:bg-primary/10 hover:border-primary/60 hover:text-primary',
              'transition-all font-semibold cursor-pointer',
            )}>
            <FlaskConical className='h-5 w-5' />
            {t('curriculum.goToLabs', 'Go To Labs')}
            <ExternalLink className='h-3.5 w-3.5 opacity-70' />
          </Button>
        </div>
      )}
    </section>
  );
}
