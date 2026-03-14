// src/features/courses/components/course-curriculum.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlaskConical, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useUserProgress } from '../hooks/use-user-progress';
import { useCurriculum } from '../hooks/use-curriculum';
import type { Course } from '../types/course.types';
import { CourseCompletionModal } from './course-completion-modal';
import { CurriculumSkeleton } from './curriculum/CurriculumSkeleton';
import { TopicRow } from './curriculum/TopicRow';
import type { CurriculumTopic } from './curriculum/TopicRow';

interface CourseCurriculumProps {
  course: Course;
  isEnrolled: boolean;
  hasLabs?: boolean;
}

export function CourseCurriculum({ course, isEnrolled, hasLabs = false }: CourseCurriculumProps) {
  const { t, i18n } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const [openId, setOpenId] = useState<string | null>(null);
  const [celebrateOpen, setCelebrateOpen] = useState(false);

  const { getProgress, getCompletedCount } = useUserProgress();
  const { data: curriculumData, isLoading } = useCurriculum(course.slug);
  const topics = (curriculumData?.topics ?? []) as CurriculumTopic[];
  const sections = course.sections ?? [];

  const toggle = (id: string) => setOpenId((p) => (p === id ? null : id));
  const total     = topics.length;
  const doneCount = getCompletedCount(course.id);
  const pct       = getProgress(course.id);
  const courseTitle = lang === 'ar' ? (course.ar_title ?? course.title) : course.title;

  const handleScrollToLabs = () => {
    document.getElementById('course-labs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id='course-curriculum' className='space-y-6'>
      <CourseCompletionModal
        open={celebrateOpen}
        courseTitle={courseTitle}
        onClose={() => setCelebrateOpen(false)}
        onReset={undefined}
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
                onCourseComplete={() => setCelebrateOpen(true)}
              />
            ))}
          </ol>
        </div>
      )}

      {/* Labs button */}
      <div className='flex justify-center pt-4'>
        <Button
          variant='outline'
          size='lg'
          onClick={hasLabs ? handleScrollToLabs : undefined}
          disabled={!hasLabs}
          className={cn(
            'gap-2.5 min-w-[220px] rounded-xl border-primary/40 font-semibold',
            hasLabs
              ? 'hover:bg-primary/10 hover:border-primary/60 hover:text-primary transition-all cursor-pointer'
              : 'opacity-50 cursor-not-allowed',
          )}>
          <FlaskConical className='h-5 w-5' />
          {hasLabs ? t('curriculum.goToLabs', 'Go To Labs') : t('curriculum.noLabs', 'No Labs Available')}
          {hasLabs && <ExternalLink className='h-3.5 w-3.5 opacity-70' />}
        </Button>
      </div>
    </section>
  );
}
