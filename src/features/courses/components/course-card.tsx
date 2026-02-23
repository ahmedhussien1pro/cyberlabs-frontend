import { Lock, Clock, FlaskConical, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Course } from '../types/course.types';

interface CourseCardProps {
  course: Course;
  className?: string;
}

const DIFF_STYLE: Record<string, string> = {
  Beginner: 'bg-green-500/10  text-green-500  border-green-500/20',
  Intermediate: 'bg-blue-500/10   text-blue-500   border-blue-500/20',
  Advanced: 'bg-red-500/10    text-red-500    border-red-500/20',
  مبتدئ: 'bg-green-500/10  text-green-500  border-green-500/20',
  متوسط: 'bg-blue-500/10   text-blue-500   border-blue-500/20',
  متقدم: 'bg-red-500/10    text-red-500    border-red-500/20',
};

export function CourseCard({ course, className }: CourseCardProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const data = isAr ? course.ar_data : course.en_data;
  const isPro = course.access === 'pro' || course.access === 'premium';

  return (
    <Link
      to={`/courses/${course.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border/40',
        'bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30',
        'hover:shadow-lg hover:shadow-primary/5',
        className,
      )}>
      {/* Thumbnail */}
      <div className='relative overflow-hidden'>
        <img
          src={course.image}
          alt={data.title}
          className='h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105'
          loading='lazy'
        />
        {/* Pro badge */}
        {isPro && (
          <div
            className='absolute left-3 top-3 rtl:left-auto rtl:right-3 flex items-center gap-1
                          rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-bold text-white'>
            <Lock className='h-3 w-3' />
            PRO
          </div>
        )}
        {/* Status overlay */}
        {course.status !== 'published' && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
            <span className='rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm'>
              {course.status === 'coming_soon' ? '🔜 Coming Soon' : '📝 Draft'}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className='flex flex-1 flex-col gap-3 p-4'>
        {/* Category + Difficulty */}
        <div className='flex items-center justify-between gap-2'>
          <span className='truncate text-xs font-medium text-muted-foreground'>
            {data.category}
          </span>
          <Badge
            variant='outline'
            className={cn(
              'shrink-0 rounded-full border px-2 py-0 text-[10px] font-semibold',
              DIFF_STYLE[data.difficulty] ?? DIFF_STYLE.Beginner,
            )}>
            {data.difficulty}
          </Badge>
        </div>

        {/* Title */}
        <h3
          className='line-clamp-2 text-sm font-bold leading-snug text-foreground
                       group-hover:text-primary transition-colors'>
          {data.title}
        </h3>

        {/* Description */}
        <p className='line-clamp-2 text-xs text-muted-foreground leading-relaxed'>
          {data.description}
        </p>

        {/* Topics pill list */}
        <div className='flex flex-wrap gap-1'>
          {data.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className='rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground'>
              {topic}
            </span>
          ))}
          {data.topics.length > 3 && (
            <span className='rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground'>
              +{data.topics.length - 3}
            </span>
          )}
        </div>

        {/* Footer stats */}
        <div
          className='mt-auto flex items-center gap-3 border-t border-border/30 pt-3
                        text-[11px] text-muted-foreground'>
          {course.estimatedHours && (
            <span className='flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              {course.estimatedHours}h
            </span>
          )}
          {course.totalLabs != null && (
            <span className='flex items-center gap-1'>
              <FlaskConical className='h-3 w-3' />
              {course.totalLabs} labs
            </span>
          )}
          {course.enrolledCount && (
            <span className='ms-auto flex items-center gap-1'>
              <Star className='h-3 w-3 fill-amber-400 text-amber-400' />
              {course.enrolledCount.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
