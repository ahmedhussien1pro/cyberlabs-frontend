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
  Clock,
  FlaskConical,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ImageLightbox } from './image-lightbox';
import CourseElementRenderer from './CourseElementRenderer';
import { useTopic, useMarkTopicComplete } from '../hooks/use-topic';
import { useCourseProgressStore } from '../store/course-progress.store';
import type { Course } from '../types/course.types';

// ── Types ────────────────────────────────────────────────────────────
type TopicState = 'done' | 'active' | 'locked' | 'soon';

function getState(
  idx: number,
  sectionId: string,
  courseId: string,
  isEnrolled: boolean,
  access: string,
  status: string,
  isTopicCompleted: (c: string, t: string) => boolean,
): TopicState {
  if (status === 'coming_soon') return 'soon';
  if (!isEnrolled && access !== 'free' && idx > 0) return 'locked';
  if (isTopicCompleted(courseId, sectionId)) return 'done';
  return 'active';
}

// ── Topic row (inner) ─────────────────────────────────────────────────
function TopicRow({
  courseSlug,
  courseId,
  section,
  sectionIndex,
  total,
  isEnrolled,
  access,
  status,
  isOpen,
  onToggle,
}: {
  courseSlug: string;
  courseId: string;
  section: Course['sections'][0];
  sectionIndex: number;
  total: number;
  isEnrolled: boolean;
  access: string;
  status: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt?: string;
  } | null>(null);

  const { isTopicCompleted } = useCourseProgressStore();
  const { mutate: markComplete, isPending: marking } = useMarkTopicComplete();

  const state = getState(
    sectionIndex,
    section.id,
    courseId,
    isEnrolled,
    access,
    status,
    isTopicCompleted,
  );

  // Load topic content lazily only when open
  const { data: topic, isLoading } = useTopic(
    isOpen ? courseSlug : '',
    isOpen ? section.id : '',
  );

  const isLast = sectionIndex === total - 1;
  const title = lang === 'ar' ? section.ar_title : section.title;
  const topicNum = String(sectionIndex + 1).padStart(2, '0');

  // Estimated duration from lessons
  const totalMin = section.lessons.reduce((s, l) => s + l.durationMin, 0);
  const hours =
    totalMin >= 60 ? `${Math.round(totalMin / 60)}h` : `${totalMin}m`;

  const handleMarkComplete = () => {
    markComplete({ courseId, topicId: section.id });
  };

  return (
    <>
      <motion.li
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: sectionIndex * 0.04 }}
        className='relative'>
        <div className='flex gap-4'>
          {/* ── Timeline dot ─────────────────────────── */}
          <div className='relative flex shrink-0 flex-col items-center'>
            <div
              className={cn(
                'relative z-10 flex h-[50px] w-[50px] shrink-0 items-center justify-center',
                'rounded-full border-2 text-sm font-bold transition-all',
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

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'flex-1 w-px min-h-[16px] mt-1',
                  state === 'done' ? 'bg-emerald-500/40' : 'bg-border/30',
                )}
              />
            )}
          </div>

          {/* ── Card ─────────────────────────────────── */}
          <div
            className={cn(
              'mb-2 flex-1 min-w-0 rounded-xl border bg-card transition-all duration-200',
              state === 'locked' || state === 'soon'
                ? 'border-border/25 opacity-60'
                : 'border-border/50 hover:border-border cursor-pointer',
              isOpen && 'border-primary/30 shadow-sm',
            )}>
            {/* Card header (always visible — the clickable trigger) */}
            <button
              type='button'
              disabled={state === 'locked' || state === 'soon'}
              onClick={onToggle}
              aria-expanded={isOpen}
              className='flex w-full items-center gap-3 px-4 py-3.5 text-start'>
              {/* Type icon pill */}
              <span
                className={cn(
                  'flex shrink-0 items-center justify-center h-8 w-8 rounded-lg border transition-colors',
                  state === 'done' &&
                    'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
                  state === 'active' &&
                    'border-primary/30 bg-primary/10 text-primary',
                  state === 'locked' &&
                    'border-border bg-muted text-muted-foreground',
                  state === 'soon' &&
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

              {/* Title + badges */}
              <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center gap-1.5 mb-0.5'>
                  {/* TOPIC badge */}
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-1.5 py-px text-[9px] font-bold uppercase tracking-wide',
                      state === 'done'
                        ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-500'
                        : state === 'active'
                          ? 'border-primary/25 bg-primary/10 text-primary'
                          : 'border-border bg-muted text-muted-foreground',
                    )}>
                    TOPIC {topicNum}
                  </span>

                  {/* Done badge */}
                  {state === 'done' && (
                    <Badge
                      variant='outline'
                      className='rounded-full border-emerald-500/25 bg-emerald-500/10 px-1.5 py-px text-[9px] font-bold uppercase text-emerald-500'>
                      ✓ DONE
                    </Badge>
                  )}

                  {/* Coming soon */}
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

              {/* Right: duration + chevron */}
              <div className='flex shrink-0 items-center gap-2 text-xs text-muted-foreground'>
                {totalMin > 0 && (
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

            {/* ── Expanded content ──────────────────────── */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key='body'
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className='overflow-hidden'>
                  <div className='border-t border-border/40 px-5 pb-6 pt-4'>
                    {/* Loading */}
                    {isLoading && (
                      <div className='space-y-3 animate-pulse'>
                        <div className='h-4 rounded bg-muted w-3/4' />
                        <div className='h-4 rounded bg-muted w-full' />
                        <div className='h-4 rounded bg-muted w-5/6' />
                        <div className='h-32 rounded-xl bg-muted w-full mt-4' />
                      </div>
                    )}

                    {/* Content */}
                    {!isLoading && topic && (
                      <CourseElementRenderer elements={topic.elements} />
                    )}

                    {/* No content */}
                    {!isLoading && !topic && (
                      <p className='text-sm text-muted-foreground italic'>
                        {t('topic.noContent', 'Content coming soon...')}
                      </p>
                    )}

                    {/* Mark complete button */}
                    {!isLoading && isEnrolled && (
                      <div className='mt-6 pt-4 border-t border-border/40'>
                        {state !== 'done' ? (
                          <Button
                            size='sm'
                            onClick={handleMarkComplete}
                            disabled={marking}
                            className='gap-2'>
                            {marking ? (
                              <span className='animate-pulse'>...</span>
                            ) : (
                              <CheckCircle2 className='h-4 w-4' />
                            )}
                            {t('topic.markComplete', 'Mark as Complete')}
                          </Button>
                        ) : (
                          <span className='inline-flex items-center gap-2 text-sm text-emerald-500 font-semibold'>
                            <CheckCircle2 className='h-4 w-4' />
                            {t('topic.completed', 'Completed!')}
                          </span>
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

      {/* Lightbox */}
      <ImageLightbox
        src={lightbox?.src ?? ''}
        alt={lightbox?.alt}
        isOpen={!!lightbox}
        onClose={() => setLightbox(null)}
      />
    </>
  );
}

// ── Main Curriculum component ─────────────────────────────────────────
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

  const toggle = (id: string) => setOpenId((p) => (p === id ? null : id));

  const total = course.sections.length;
  // `done` was previously defined but unused. It represents the count of completed items.
  const doneCount = getCompletedCount(course.id);
  const pct = getProgress(course.id, total);
  const totalHours = course.estimatedHours;

  return (
    <section className='space-y-6'>
      {/* ── Header ───────────────────────────────────────── */}
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

        {/* Progress summary */}
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

      {/* ── Topic list ───────────────────────────────────── */}
      <div className='relative'>
        {/* Vertical timeline backbone */}
        <div
          aria-hidden='true'
          className='absolute top-5 bottom-5 start-[25px] w-px bg-border/40'
        />
        <ol className='space-y-2'>
          {course.sections.map((section, idx) => (
            <TopicRow
              key={section.id}
              courseSlug={course.slug}
              courseId={course.id}
              section={section}
              sectionIndex={idx}
              total={total}
              isEnrolled={isEnrolled}
              access={course.access}
              status={course.status}
              isOpen={openId === section.id}
              onToggle={() => toggle(section.id)}
            />
          ))}
        </ol>
      </div>

      {/* ── Go To Labs button ────────────────────────────── */}
      {course.labsLink && (
        <div className='flex justify-center pt-4'>
          <Button
            variant='outline'
            size='lg'
            className={cn(
              'gap-2.5 min-w-[220px] rounded-xl border-primary/40',
              'hover:bg-primary/10 hover:border-primary/60 hover:text-primary',
              'transition-all font-semibold',
            )}
            asChild>
            <a href={course.labsLink} target='_blank' rel='noopener noreferrer'>
              <FlaskConical className='h-5 w-5' />
              {t('curriculum.goToLabs', 'Go To Labs')}
              <ExternalLink className='h-3.5 w-3.5 opacity-70' />
            </a>
          </Button>
        </div>
      )}
    </section>
  );
}
