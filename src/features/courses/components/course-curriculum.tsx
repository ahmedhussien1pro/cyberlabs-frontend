import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  Play,
  FileText,
  FlaskConical,
  HelpCircle,
  FolderKanban,
  Lock,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CourseSection, LessonType } from '../types/course.types';

const LESSON_ICON: Record<LessonType, React.ReactNode> = {
  video: <Play className='h-3.5 w-3.5' />,
  article: <FileText className='h-3.5 w-3.5' />,
  lab: <FlaskConical className='h-3.5 w-3.5' />,
  quiz: <HelpCircle className='h-3.5 w-3.5' />,
  project: <FolderKanban className='h-3.5 w-3.5' />,
};

interface Props {
  sections: CourseSection[];
  enrolled?: boolean;
}

export function CourseCurriculum({ sections, enrolled = false }: Props) {
  const { t, i18n } = useTranslation('courses');
  const isAr = i18n.language === 'ar';
  const [open, setOpen] = useState<Set<string>>(new Set([sections[0]?.id]));

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0);
  const totalMin = sections.reduce(
    (a, s) => a + s.lessons.reduce((b, l) => b + l.durationMin, 0),
    0,
  );

  return (
    <div className='rounded-2xl border border-border/50 bg-card'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-border/40 px-5 py-4'>
        <h2 className='text-base font-bold'>
          {t('detail.curriculum', 'Course Curriculum')}
        </h2>
        <span className='text-xs text-muted-foreground'>
          {sections.length} {t('detail.sections', 'sections')} · {totalLessons}{' '}
          {t('detail.lessons', 'lessons')} · {Math.round(totalMin / 60)}h{' '}
          {totalMin % 60}m
        </span>
      </div>

      {/* Sections */}
      <div className='divide-y divide-border/30'>
        {sections.map((section) => {
          const title = isAr ? section.ar_title : section.title;
          const isOpen = open.has(section.id);
          const secMin = section.lessons.reduce((a, l) => a + l.durationMin, 0);

          return (
            <div key={section.id}>
              {/* Section header */}
              <button
                onClick={() => toggle(section.id)}
                className='flex w-full items-center justify-between px-5 py-3.5 text-start hover:bg-muted/40 transition-colors'>
                <div className='flex items-center gap-3'>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                  <span className='text-sm font-semibold'>{title}</span>
                </div>
                <span className='text-xs text-muted-foreground shrink-0'>
                  {section.lessons.length} {t('detail.lessons', 'lessons')} ·{' '}
                  {secMin}m
                </span>
              </button>

              {/* Lessons */}
              {isOpen && (
                <div className='divide-y divide-border/20 bg-muted/20'>
                  {section.lessons.map((lesson) => {
                    const lessonTitle = isAr ? lesson.ar_title : lesson.title;
                    const isAccessible = lesson.isFree || enrolled;

                    return (
                      <div
                        key={lesson.id}
                        className={cn(
                          'flex items-center gap-3 px-8 py-3 text-sm',
                          isAccessible
                            ? 'cursor-pointer hover:bg-muted/40'
                            : 'opacity-60 cursor-not-allowed',
                        )}>
                        {/* Icon */}
                        <span
                          className={cn(
                            'text-muted-foreground',
                            lesson.type === 'lab' && 'text-cyan-500',
                            lesson.type === 'project' && 'text-amber-500',
                          )}>
                          {LESSON_ICON[lesson.type]}
                        </span>

                        {/* Title */}
                        <span className='flex-1 text-foreground'>
                          {lessonTitle}
                        </span>

                        {/* Tags */}
                        <div className='flex items-center gap-2 shrink-0'>
                          {lesson.isCompleted && (
                            <CheckCircle2 className='h-3.5 w-3.5 text-green-500' />
                          )}
                          {lesson.isFree && !enrolled && (
                            <span className='rounded-full bg-green-500/10 px-2 py-px text-[10px] font-semibold text-green-600'>
                              {t('detail.preview', 'Preview')}
                            </span>
                          )}
                          {!isAccessible && (
                            <Lock className='h-3 w-3 text-muted-foreground' />
                          )}
                          <span className='flex items-center gap-0.5 text-[11px] text-muted-foreground'>
                            <Clock className='h-3 w-3' />
                            {lesson.durationMin}m
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
