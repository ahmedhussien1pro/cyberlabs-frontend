// src/features/courses/components/course-curriculum.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlaskConical, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUserProgress } from '../hooks/use-user-progress';
import { useCurriculum } from '../hooks/use-curriculum';
import type { Course } from '../types/course.types';
import { CourseCompletionModal } from './course-completion-modal';
import { CurriculumSkeleton } from './curriculum/CurriculumSkeleton';
import { TopicRow } from './curriculum/TopicRow';
import type { CurriculumTopic } from './curriculum/TopicRow';
import { ROUTES } from '@/shared/constants';
import { useNavigate } from 'react-router-dom';

interface CourseCurriculumProps {
  course: Course;
  isEnrolled: boolean;
  hasLabs?: boolean;
}

export function CourseCurriculum({ course, isEnrolled, hasLabs = false }: CourseCurriculumProps) {
  const { t, i18n } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  const { getProgress, getCompletedCount } = useUserProgress();
  const { data: curriculumData, isLoading } = useCurriculum(course.slug);
  const topics = (curriculumData?.topics ?? []) as CurriculumTopic[];
  const sections = course.sections ?? [];

  const toggle = (id: string) => setOpenId((p) => (p === id ? null : id));
  const total     = topics.length;
  const doneCount = getCompletedCount(course.id);
  const pct       = getProgress(course.id);
  const isCompleted = pct >= 100;
  const courseTitle = lang === 'ar' ? (course.ar_title ?? course.title) : course.title;

  /** Go To Labs button handler */
  const handleLabsClick = () => {
    if (!hasLabs) return;
    if (!isCompleted) {
      toast.warning(
        t('detail.completeFirst', 'Finish the course first to unlock the labs! 🔒'),
        { duration: 3500, icon: '🔒' },
      );
      return;
    }
    setCompletionModalOpen(true);
  };

  return (
    <section id='course-curriculum' className='space-y-6'>
      {/* Completion modal */}
      <CourseCompletionModal
        open={completionModalOpen}
        courseTitle={courseTitle}
        onClose={() => setCompletionModalOpen(false)}
        onGoToLabs={hasLabs ? () => navigate(ROUTES.COURSES.LABS(course.slug)) : undefined}
      />

      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            {t('detail.curriculum', 'Course Curriculum')}
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {total} {t('detail.topics', 'Topics')} · {t('detail.followOrder', 'Follow the order for best results')}
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
            <p className='text-[11px] text-muted-foreground'>{t('detail.estTime', 'est. time')}</p>
            <p className='text-lg font-black leading-none'>{course.estimatedHours}h</p>
          </div>
        </div>
      </div>

      {/* Topics list */}
      {isLoading ? (
        <CurriculumSkeleton />
      ) : topics.length === 0 ? (
        <p className='text-sm text-muted-foreground italic py-4'>
          {t('curriculum.empty', 'Curriculum not available yet.')}
        </p>
      ) : (
        <div className='relative'>
          <div aria-hidden='true' className='absolute top-5 bottom-5 start-[25px] w-px bg-border/40' />
          <ol className='space-y-2'>
            {topics.map((topic, idx) => (
              <TopicRow
                key={topic.id}
                courseId={course.id}
                topic={topic}
                sectionId={sections[idx]?.id ?? ''}
                topicIndex={idx}
                total={total}
                isEnrolled={isEnrolled}
                courseState={course.state}
                isOpen={openId === topic.id}
                onToggle={() => toggle(topic.id)}
                onCourseComplete={() => setCompletionModalOpen(true)}
              />
            ))}
          </ol>
        </div>
      )}

      {/* ── Go To Labs button ── */}
      <div className='flex justify-center pt-4'>
        {hasLabs ? (
          <Button
            variant='outline'
            size='lg'
            onClick={handleLabsClick}
            className={cn(
              'gap-2.5 min-w-[220px] rounded-xl font-semibold transition-all',
              isCompleted
                ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 cursor-pointer'
                : 'border-white/15 bg-white/5 text-white/40 hover:border-white/25 hover:text-white/60 cursor-pointer',
            )}>
            {isCompleted
              ? <FlaskConical className='h-5 w-5' />
              : <Lock className='h-4.5 w-4.5' />
            }
            {t('curriculum.goToLabs', 'Go To Labs')}
          </Button>
        ) : (
          <span className={cn(
            'inline-flex items-center gap-2.5 min-w-[220px] justify-center',
            'rounded-xl border border-white/10 bg-white/5 px-5 py-2.5',
            'text-sm font-semibold text-white/30',
          )}>
            <FlaskConical className='h-5 w-5' />
            {t('curriculum.labsComingSoon', 'Labs Coming Soon')}
          </span>
        )}
      </div>
    </section>
  );
}
