// src/features/courses/components/course-info-dialog.tsx
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  BookOpen,
  Zap,
  ChevronRight,
  Clock,
  Users,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../types/course.types';

const ACCESS_STYLE: Record<string, string> = {
  FREE: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  PRO: 'border-blue-500/40    text-blue-400    bg-blue-500/10',
  PREMIUM: 'border-violet-500/40  text-violet-400  bg-violet-500/10',
  // fallback للـ lowercase القديم في حال وجد في الـ cache
  free: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  pro: 'border-blue-500/40    text-blue-400    bg-blue-500/10',
  premium: 'border-violet-500/40  text-violet-400  bg-violet-500/10',
};

interface CourseInfoDialogProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
}

export function CourseInfoDialog({
  course,
  open,
  onClose,
}: CourseInfoDialogProps) {
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();

  if (!course) return null;

  const title = lang === 'ar' ? course.ar_title : course.title;
  const desc = lang === 'ar' ? course.ar_description : course.description;
  const longDesc =
    lang === 'ar' ? course.ar_longDescription : course.longDescription;
  const skills = lang === 'ar' ? course.ar_skills : course.skills;
  const prereqs =
    lang === 'ar' ? course.ar_prerequisites : course.prerequisites;
  const topics = lang === 'ar' ? course.ar_topics : course.topics;
  const difficulty = lang === 'ar' ? course.ar_difficulty : course.difficulty;
  const category = lang === 'ar' ? course.ar_category : course.category;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-xl max-h-[85vh] overflow-y-auto bg-card border-border/60'>
        <DialogHeader>
          <div className='flex items-start gap-3'>
            {/* Thumbnail */}
            <div className='h-14 w-14 rounded-lg overflow-hidden shrink-0 border border-border/40'>
              {course.image ? (
                <img
                  src={course.image}
                  alt={title ?? ''}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-muted flex items-center justify-center'>
                  <BookOpen className='h-6 w-6 text-muted-foreground' />
                </div>
              )}
            </div>
            <div className='min-w-0'>
              <DialogTitle className='text-base font-bold leading-snug mb-1'>
                {title}
              </DialogTitle>
              <div className='flex flex-wrap gap-1.5'>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-[10px] font-bold',
                    ACCESS_STYLE[course.access],
                  )}>
                  {course.access}
                </Badge>
                <Badge variant='secondary' className='text-[10px]'>
                  {category}
                </Badge>
                <Badge variant='secondary' className='text-[10px]'>
                  {difficulty}
                </Badge>
              </div>
            </div>
          </div>
          <DialogDescription className='mt-3 text-sm text-muted-foreground leading-relaxed'>
            {longDesc || desc}
          </DialogDescription>
        </DialogHeader>

        {/* Stats row */}
        <div className='flex flex-wrap gap-3 text-sm py-2 border-y border-border/40'>
          <span className='flex items-center gap-1.5 text-muted-foreground'>
            <BookOpen className='h-4 w-4' /> {course.totalTopics}{' '}
            {t('detail.topics', 'Topics')}
          </span>
          <span className='flex items-center gap-1.5 text-muted-foreground'>
            <Clock className='h-4 w-4' /> {course.estimatedHours}h
          </span>
          {/* ✅ fix: enrolledCount → enrollmentCount */}
          {(course.enrollmentCount ?? 0) > 0 && (
            <span className='flex items-center gap-1.5 text-muted-foreground'>
              <Users className='h-4 w-4' />{' '}
              {course.enrollmentCount.toLocaleString()}
            </span>
          )}
          {/* ✅ fix: rating → averageRating */}
          {(course.averageRating ?? 0) > 0 && (
            <span className='flex items-center gap-1.5 text-yellow-500'>
              <Star className='h-4 w-4 fill-yellow-500' />{' '}
              {course.averageRating}
            </span>
          )}
        </div>

        {/* What you'll learn */}
        {topics.length > 0 && (
          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2'>
              {t('dialog.whatYoullLearn', "What You'll Learn")}
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5'>
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className='flex items-start gap-2 text-sm text-foreground/80'>
                  <Zap className='h-3.5 w-3.5 mt-0.5 shrink-0 text-primary' />
                  {topic}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2'>
              {t('dialog.skills', "Skills You'll Gain")}
            </p>
            <div className='flex flex-wrap gap-1.5'>
              {skills.map((s, i) => (
                <span
                  key={i}
                  className='text-xs px-2.5 py-1 rounded-full border border-border/50 bg-muted/50 text-muted-foreground'>
                  <CheckCircle2 className='inline h-3 w-3 me-1 text-emerald-500' />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {prereqs.length > 0 && (
          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2'>
              {t('dialog.prerequisites', 'Prerequisites')}
            </p>
            <ul className='space-y-1.5'>
              {prereqs.map((p, i) => (
                <li
                  key={i}
                  className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <ChevronRight className='h-3.5 w-3.5 shrink-0 text-muted-foreground/60' />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className='flex gap-2 pt-1'>
          <Button
            className='flex-1'
            onClick={() => {
              onClose();
              navigate(ROUTES.COURSES.DETAIL(course.slug));
            }}>
            {t('card.startLearning', 'Start Learning')}
          </Button>
          <Button variant='outline' onClick={onClose} className='flex-1'>
            {t('dialog.close', 'Close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
