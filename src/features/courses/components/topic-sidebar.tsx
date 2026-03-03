import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { useCourseProgressStore } from '../store/course-progress.store';
import type { CourseSection, CourseAccess } from '../types/course.types';
import type { Language } from '@/core/types/common.types';

interface Props {
  courseSlug: string;
  courseId: string;
  sections: CourseSection[];
  access: CourseAccess;
  isEnrolled: boolean;
}

export function TopicSidebar({
  courseSlug,
  courseId,
  sections,
  access,
  isEnrolled,
}: Props) {
  const { topicId: activeId } = useParams<{ topicId: string }>();
  const { i18n, t } = useTranslation('courses');
  const lang: Language = i18n.language === 'ar' ? 'ar' : 'en';
  const { isTopicCompleted, getProgress, getCompletedCount } =
    useCourseProgressStore();
  const progress = getProgress(courseId, sections.length);
  const done = getCompletedCount(courseId);

  return (
    <aside className='flex flex-col h-full'>
      {/* Progress */}
      <div className='p-4 border-b border-border/50'>
        <div className='flex items-center justify-between text-xs mb-1.5'>
          <span className='text-muted-foreground'>
            {done}/{sections.length} {t('topic.completed', 'completed')}
          </span>
          <span className='font-bold text-primary'>{progress}%</span>
        </div>
        <div className='h-1.5 rounded-full bg-muted overflow-hidden'>
          <div
            className='h-full rounded-full bg-primary transition-all duration-500'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* List */}
      <nav className='flex-1 overflow-y-auto p-2 space-y-0.5'>
        {sections.map((section, idx) => {
          const isActive = section.id === activeId;
          const isCompleted = isTopicCompleted(courseId, section.id);
          const isLocked = !isEnrolled && access !== 'FREE' && idx > 0;
          const title = lang === 'ar' ? section.ar_title : section.title;

          if (isLocked) {
            return (
              <div
                key={section.id}
                className='flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-40 cursor-not-allowed select-none'>
                <Lock className='h-4 w-4 shrink-0 text-muted-foreground' />
                <span className='text-sm text-muted-foreground truncate flex-1'>
                  {title}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={section.id}
              to={ROUTES.COURSES.TOPIC(courseSlug, section.id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'hover:bg-muted/50 text-foreground/80 hover:text-foreground',
              )}>
              {isCompleted ? (
                <CheckCircle2 className='h-4 w-4 shrink-0 text-emerald-500' />
              ) : (
                <Circle
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
              )}
              <span className='text-sm truncate flex-1'>{title}</span>
              {isActive && (
                <ChevronRight className='h-3.5 w-3.5 shrink-0 rtl:rotate-180' />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
