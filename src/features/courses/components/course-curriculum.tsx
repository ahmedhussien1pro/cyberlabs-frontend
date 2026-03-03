import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Lock,
  Clock3,
  Sparkles,
  Clock,
  FlaskConical,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useMarkLessonComplete } from '../hooks/use-mark-complete';
import { useCourseProgressStore } from '../store/course-progress.store';
import type { Course, CourseLesson } from '../types/course.types';
import { useEntitlement } from '@/features/pricing/hooks/use-entitlement';

// ── Helpers ────────────────────────────────────────────────────────────
type SectionState = 'done' | 'active' | 'locked' | 'soon';

function getSectionState(
  idx: number,
  sectionId: string,
  courseId: string,
  isEnrolled: boolean,
  access: string,
  state: string,
  isTopicCompleted: (c: string, t: string) => boolean,
): SectionState {
  if (state === 'COMING_SOON') return 'soon';
  if (!isEnrolled && access !== 'FREE' && idx > 0) return 'locked';
  if (isTopicCompleted(courseId, sectionId)) return 'done';
  return 'active';
}

const LESSON_TYPE_ICON: Record<string, React.ElementType> = {
  VIDEO: Video,
  ARTICLE: FileText,
  QUIZ: HelpCircle,
};

function LessonRow({
  lesson,
  isEnrolled,
  courseId,
}: {
  lesson: CourseLesson;
  isEnrolled: boolean;
  courseId: string;
}) {
  const { isTopicCompleted } = useCourseProgressStore();
  const { mutate: markComplete, isPending: marking } = useMarkLessonComplete();
  const isDone = isTopicCompleted(courseId, lesson.id);
  const Icon = LESSON_TYPE_ICON[lesson.type] ?? BookOpen;
  const hours =
    lesson.duration >= 60
      ? `${Math.round(lesson.duration / 60)}h`
      : lesson.duration > 0
        ? `${lesson.duration}m`
        : null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors',
        isDone
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : 'border-border/30 bg-background/40 hover:border-border/60',
      )}>
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border',
          isDone
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
            : 'border-border/40 bg-muted text-muted-foreground',
        )}>
        {isDone ? (
          <CheckCircle2 className='h-3.5 w-3.5' />
        ) : (
          <Icon className='h-3.5 w-3.5' />
        )}
      </span>

      <span
        className={cn(
          'flex-1 text-sm leading-snug',
          isDone
            ? 'text-muted-foreground line-through decoration-muted-foreground/40'
            : 'text-foreground/80',
        )}>
        {lesson.title}
      </span>

      <div className='flex items-center gap-2 shrink-0'>
        {lesson.isPreview && !isDone && (
          <Badge
            variant='outline'
            className='text-[9px] border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-1.5 py-0'>
            FREE
          </Badge>
        )}
        {hours && (
          <span className='text-[11px] text-muted-foreground flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {hours}
          </span>
        )}
        {isEnrolled && !isDone && (
          <button
            onClick={() => markComplete({ courseId, lessonId: lesson.id })}
            disabled={marking}
            className='text-[10px] text-muted-foreground hover:text-primary transition-colors disabled:opacity-50'>
            {marking ? '...' : '✓'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Section row ────────────────────────────────────────────────────────
function SectionRow({
  courseId,
  section,
  sectionIndex,
  total,
  isEnrolled,
  access,
  courseState,
  isOpen,
  onToggle,
}: {
  courseId: string;
  section: Course['sections'][0];
  sectionIndex: number;
  total: number;
  isEnrolled: boolean;
  access: string;
  courseState: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const { isTopicCompleted } = useCourseProgressStore();

  const state = getSectionState(
    sectionIndex,
    section.id,
    courseId,
    isEnrolled,
    access,
    courseState,
    isTopicCompleted,
  );
  const isLast = sectionIndex === total - 1;
  const title = lang === 'ar' ? section.ar_title : section.title;
  const topicNum = String(sectionIndex + 1).padStart(2, '0');

  const totalMin = section.lessons.reduce((s, l) => s + (l.duration ?? 0), 0);
  const hours =
    totalMin >= 60
      ? `${Math.round(totalMin / 60)}h`
      : totalMin > 0
        ? `${totalMin}m`
        : null;

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: sectionIndex * 0.04 }}
      className='relative'>
      <div className='flex gap-4'>
        {/* Timeline dot */}
        <div className='relative flex shrink-0 flex-col items-center'>
          <div
            className={cn(
              'relative z-10 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all',
              state === 'done' &&
                'border-emerald-500 bg-emerald-500/15 text-emerald-500',
              state === 'active' &&
                'border-primary bg-primary/15 text-primary shadow-lg shadow-primary/20',
              state === 'locked' &&
                'border-border/40 bg-muted/50 text-muted-foreground/50',
              state === 'soon' &&
                'border-dashed border-border/40 bg-muted/30 text-muted-foreground/40',
            )}>
            {state === 'done' ? (
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
                'flex-1 w-px min-h-[16px] mt-1',
                state === 'done' ? 'bg-emerald-500/40' : 'bg-border/30',
              )}
            />
          )}
        </div>

        {/* Card */}
        <div
          className={cn(
            'mb-2 flex-1 min-w-0 rounded-xl border bg-card transition-all duration-200',
            state === 'locked' || state === 'soon'
              ? 'border-border/25 opacity-60'
              : 'border-border/50 hover:border-border cursor-pointer',
            isOpen && 'border-primary/30 shadow-sm',
          )}>
          {/* Header */}
          <button
            type='button'
            disabled={state === 'locked' || state === 'soon'}
            onClick={onToggle}
            aria-expanded={isOpen}
            className='flex w-full items-center gap-3 px-4 py-3.5 text-start'>
            <span
              className={cn(
                'flex shrink-0 items-center justify-center h-8 w-8 rounded-lg border transition-colors',
                state === 'done' &&
                  'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
                state === 'active' &&
                  'border-primary/30 bg-primary/10 text-primary',
                (state === 'locked' || state === 'soon') &&
                  'border-border bg-muted text-muted-foreground',
              )}>
              {state === 'done' ? (
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
                    state === 'done'
                      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-500'
                      : state === 'active'
                        ? 'border-primary/25 bg-primary/10 text-primary'
                        : 'border-border bg-muted text-muted-foreground',
                  )}>
                  SECTION {topicNum}
                </span>
                {state === 'done' && (
                  <Badge
                    variant='outline'
                    className='rounded-full border-emerald-500/25 bg-emerald-500/10 px-1.5 py-px text-[9px] font-bold uppercase text-emerald-500'>
                    ✓ DONE
                  </Badge>
                )}
                {state === 'soon' && (
                  <span className='inline-flex items-center gap-1 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-1.5 py-px text-[9px] font-bold uppercase text-zinc-400'>
                    <Sparkles className='h-2 w-2' /> SOON
                  </span>
                )}
              </div>
              <p
                className={cn(
                  'text-sm font-semibold leading-snug',
                  state === 'done'
                    ? 'text-muted-foreground line-through decoration-muted-foreground/40'
                    : 'text-foreground',
                )}>
                {title}
              </p>
            </div>

            <div className='flex shrink-0 items-center gap-2 text-xs text-muted-foreground'>
              <span className='text-[11px]'>
                {section.lessons.length} {t('curriculum.lessons', 'lessons')}
              </span>
              {hours && (
                <span className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' /> {hours}
                </span>
              )}
              {state !== 'locked' && state !== 'soon' && (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                />
              )}
            </div>
          </button>

          {/* Expanded: lessons list */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key='body'
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className='overflow-hidden'>
                <div className='border-t border-border/40 px-4 pb-4 pt-3 space-y-2'>
                  {section.lessons.length === 0 ? (
                    <p className='text-sm text-muted-foreground italic'>
                      {t('topic.noContent', 'Content coming soon...')}
                    </p>
                  ) : (
                    section.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => (
                        <LessonRow
                          key={lesson.id}
                          lesson={lesson}
                          isEnrolled={isEnrolled}
                          courseId={courseId}
                        />
                      ))
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

// ── Main component ─────────────────────────────────────────────────────
interface CourseCurriculumProps {
  course: Course;
  isEnrolled: boolean;
}

export function CourseCurriculum({
  course,
  isEnrolled,
}: CourseCurriculumProps) {
  const { t } = useTranslation('courses');
  const [openId, setOpenId] = useState<string | null>(null);
  const { getProgress, getCompletedCount } = useCourseProgressStore();
  const { withEntitlement } = useEntitlement();

  const toggle = (id: string) => setOpenId((p) => (p === id ? null : id));
  const total = course.sections.length;
  const doneCount = getCompletedCount(course.id);
  const pct = getProgress(course.id, total);
  const totalHours = course.estimatedHours;

  const handleOpenLabs = withEntitlement(
    () => {
      if (course.labsLink)
        window.open(course.labsLink, '_blank', 'noopener,noreferrer');
    },
    {
      requiredPlan: course.access === 'FREE' ? 'free' : 'pro',
      featureKey: 'pricing.paywall.generic',
      returnTo: `/courses/${course.slug}`,
    },
  );

  return (
    <section className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            {t('detail.curriculum', 'Course Curriculum')}
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {total} {t('detail.topics', 'Sections')} ·{' '}
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
            <p className='text-lg font-black leading-none'>{totalHours}h</p>
          </div>
        </div>
      </div>

      {/* Section list */}
      <div className='relative'>
        <div
          aria-hidden='true'
          className='absolute top-5 bottom-5 start-[25px] w-px bg-border/40'
        />
        <ol className='space-y-2'>
          {course.sections.map((section, idx) => (
            <SectionRow
              key={section.id}
              courseId={course.id}
              section={section}
              sectionIndex={idx}
              total={total}
              isEnrolled={isEnrolled}
              access={course.access}
              courseState={course.state}
              isOpen={openId === section.id}
              onToggle={() => toggle(section.id)}
            />
          ))}
        </ol>
      </div>

      {/* Go To Labs */}
      {course.labsLink && (
        <div className='flex justify-center pt-4'>
          <Button
            variant='outline'
            size='lg'
            onClick={handleOpenLabs}
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
