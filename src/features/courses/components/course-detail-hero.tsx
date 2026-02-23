import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import type { Course } from '../types/course.types';

const ACCESS_BADGE: Record<string, string> = {
  free: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
  pro: 'border-blue-500/30  bg-blue-500/10  text-blue-600  dark:text-blue-400',
  premium:
    'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
};
const DIFF_BADGE: Record<string, string> = {
  Beginner:
    'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-400',
  Intermediate:
    'border-blue-500/25  bg-blue-500/10  text-blue-700  dark:text-blue-400',
  Advanced:
    'border-red-500/25   bg-red-500/10   text-red-700   dark:text-red-400',
};

interface Props {
  course: Course;
}

export function CourseDetailHero({ course }: Props) {
  const { t, i18n } = useTranslation('courses');
  const isAr = i18n.language === 'ar';
  const data = isAr ? course.ar_data : course.en_data;
  const isLocked = course.access !== 'free';

  return (
    <div className='border-b border-border/40 bg-card/60 backdrop-blur-sm'>
      <div className='container mx-auto px-4 py-10'>
        {/* Breadcrumb */}
        <Link
          to={ROUTES.COURSES?.LIST ?? '/courses'}
          className='mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit'>
          <ArrowLeft className='h-3.5 w-3.5' />
          {t('detail.backToCourses', 'All Courses')}
        </Link>

        <div className='grid gap-8 lg:grid-cols-[1fr_360px]'>
          {/* Left */}
          <div className='flex flex-col gap-4'>
            {/* Category + badges */}
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
                {data.category}
              </span>
              <Badge
                variant='outline'
                className={cn(
                  'rounded-full border px-2 py-px text-[10px] font-semibold',
                  DIFF_BADGE[course.en_data.difficulty],
                )}>
                {data.difficulty}
              </Badge>
              <Badge
                variant='outline'
                className={cn(
                  'rounded-full border px-2 py-px text-[10px] font-semibold capitalize',
                  ACCESS_BADGE[course.access],
                )}>
                {isLocked && <Lock className='me-1 h-2.5 w-2.5' />}
                {t(`access.${course.access}`, course.access)}
              </Badge>
              {course.isNew && (
                <Badge className='rounded-full bg-amber-500 px-2 py-px text-[10px] font-bold text-white'>
                  {t('card.new', 'New')}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className='text-3xl font-black tracking-tight md:text-4xl'>
              {data.title}
            </h1>

            {/* Description */}
            <p className='max-w-2xl text-base text-muted-foreground leading-relaxed'>
              {data.longDescription || data.description}
            </p>

            {/* Rating + stats */}
            <div className='flex flex-wrap items-center gap-4 text-sm'>
              {course.rating > 0 && (
                <span className='flex items-center gap-1 font-semibold text-amber-500'>
                  <Star className='h-4 w-4 fill-amber-500' />
                  {course.rating.toFixed(1)}
                  <span className='font-normal text-muted-foreground'>
                    ({course.reviewCount.toLocaleString()})
                  </span>
                </span>
              )}
              <span className='flex items-center gap-1.5 text-muted-foreground'>
                <Users className='h-4 w-4' />
                {course.enrolledCount.toLocaleString()}{' '}
                {t('detail.students', 'students')}
              </span>
              <span className='flex items-center gap-1.5 text-muted-foreground'>
                <Clock className='h-4 w-4' />
                {course.estimatedHours}h
              </span>
              <span className='flex items-center gap-1.5 text-muted-foreground'>
                <BookOpen className='h-4 w-4' />
                {course.totalLessons} {t('detail.lessons', 'lessons')}
              </span>
            </div>

            {/* Instructor */}
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <div className='h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary'>
                {course.instructor.name[0]}
              </div>
              <span>
                {t('detail.by', 'By')}{' '}
                <strong className='text-foreground'>
                  {course.instructor.name}
                </strong>{' '}
                · {course.instructor.title}
              </span>
            </div>

            {/* Skills */}
            {data.skills.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {data.skills.map((s) => (
                  <span
                    key={s}
                    className='flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs text-primary'>
                    <CheckCircle2 className='h-3 w-3' />
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right — course image */}
          <div className='relative overflow-hidden rounded-2xl border border-border/50 bg-muted aspect-video lg:aspect-auto'>
            <img
              src={course.image}
              alt={data.title}
              className='h-full w-full object-cover'
            />
            {course.status === 'coming_soon' && (
              <div className='absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm'>
                <span className='rounded-full bg-zinc-700 px-4 py-1.5 text-sm font-bold text-white'>
                  {t('card.comingSoon', 'Coming Soon')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar (enrolled) */}
        {course.enrolled && typeof course.progress === 'number' && (
          <div className='mt-6 max-w-lg space-y-1'>
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>{t('detail.yourProgress', 'Your Progress')}</span>
              <span className='font-semibold text-foreground'>
                {course.progress}%
              </span>
            </div>
            <Progress value={course.progress} className='h-2' />
          </div>
        )}
      </div>
    </div>
  );
}
