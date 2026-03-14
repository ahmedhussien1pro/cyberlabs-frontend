// src/features/courses/components/curriculum/TopicRow.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, ChevronDown, CheckCircle2, Lock,
  Clock3, Sparkles, CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useUserProgress } from '../../hooks/use-user-progress';
import { useMarkTopicComplete } from '../../hooks/use-topic';
import type { CourseElement } from '@/core/types/curriculumCourses.types';
import CourseElementRenderer from '../CourseElementRenderer';

type TopicState = 'done' | 'active' | 'locked' | 'soon';

export interface CurriculumTopic {
  id: string;
  title: { en: string; ar: string };
  elements: CourseElement[];
}

export function getTopicState(
  idx: number,
  sectionId: string,
  courseId: string,
  isEnrolled: boolean,
  courseState: string,
  isTopicCompleted: (c: string, t: string) => boolean,
): TopicState {
  if (courseState === 'COMING_SOON') return 'soon';
  if (!isEnrolled && idx >= 2) return 'locked';
  if (isTopicCompleted(courseId, sectionId)) return 'done';
  return 'active';
}

export function TopicRow({
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
  sectionId: string;
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
  const { isTopicCompleted, isCourseCompleted } = useUserProgress();
  const { mutate: markComplete, isPending: marking } = useMarkTopicComplete();

  const state = getTopicState(topicIndex, sectionId, courseId, isEnrolled, courseState, isTopicCompleted);
  const isDone = state === 'done';
  const isLast = topicIndex === total - 1;
  const title = topic.title[lang] ?? topic.title.en;
  const topicNum = String(topicIndex + 1).padStart(2, '0');
  const isDisabled = state === 'locked' || state === 'soon' || !sectionId;

  const handleMarkComplete = () => {
    if (!sectionId) return;
    markComplete(
      { courseId, topicId: sectionId },
      {
        onSuccess: () => {
          setTimeout(() => {
            if (isCourseCompleted(courseId, total)) onCourseComplete();
          }, 150);
        },
      },
    );
  };

  return (
    <motion.li
      id={`topic-row-${topicIndex}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: topicIndex * 0.04 }}
      className='relative'>
      <div className='flex gap-4'>
        {/* Timeline dot */}
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
            {isDone ? <CheckCircle2 className='h-5 w-5' />
              : state === 'locked' ? <Lock className='h-4 w-4' />
              : state === 'soon'   ? <Clock3 className='h-4 w-4' />
              : <span className='font-black'>{topicNum}</span>}
          </div>
          {!isLast && (
            <div className={cn('flex-1 w-px min-h-[16px] mt-1 transition-colors duration-300', isDone ? 'bg-emerald-500/40' : 'bg-border/30')} />
          )}
        </div>

        {/* Card */}
        <div
          className={cn(
            'mb-2 flex-1 min-w-0 rounded-xl border bg-card transition-all duration-300',
            isDisabled ? 'border-border/25 opacity-60'
              : isDone ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-border/50 hover:border-border cursor-pointer',
            isOpen && !isDone && 'border-primary/30 shadow-sm',
            isOpen && isDone  && 'border-emerald-500/40 shadow-sm',
          )}>
          <button
            type='button'
            disabled={isDisabled}
            onClick={onToggle}
            aria-expanded={isOpen}
            className='flex w-full items-center gap-3 px-4 py-3.5 text-start'>
            <span
              className={cn(
                'flex shrink-0 items-center justify-center h-8 w-8 rounded-lg border transition-colors',
                isDone ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                  : state === 'active' ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border bg-muted text-muted-foreground',
              )}>
              {isDone ? <CheckCircle2 className='h-4 w-4' />
                : state === 'locked' ? <Lock className='h-3.5 w-3.5' />
                : state === 'soon'   ? <Clock3 className='h-3.5 w-3.5' />
                : <BookOpen className='h-4 w-4' />}
            </span>

            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-1.5 mb-0.5'>
                <span
                  className={cn(
                    'inline-flex rounded-full border px-1.5 py-px text-[9px] font-bold uppercase tracking-wide',
                    isDone ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-500'
                      : state === 'active' ? 'border-primary/25 bg-primary/10 text-primary'
                      : 'border-border bg-muted text-muted-foreground',
                  )}>
                  {t('curriculum.topic', 'TOPIC')} {topicNum}
                </span>
                {!isEnrolled && topicIndex < 2 && (
                  <Badge variant='outline' className='rounded-full border-emerald-500/25 bg-emerald-500/10 px-1.5 py-px text-[9px] font-bold text-emerald-400'>
                    FREE PREVIEW
                  </Badge>
                )}
                {state === 'soon' && (
                  <span className='inline-flex items-center gap-1 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-1.5 py-px text-[9px] font-bold uppercase text-zinc-400'>
                    <Sparkles className='h-2 w-2' /> {t('curriculum.soon', 'SOON')}
                  </span>
                )}
              </div>
              <p className={cn('text-sm font-semibold leading-snug', isDone ? 'text-emerald-400/80' : 'text-foreground')}>
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
                <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200 ms-1', isOpen && 'rotate-180')} />
              )}
            </div>
          </button>

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
