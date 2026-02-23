import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Clock,
  BookOpen,
  FlaskConical,
  Lock,
  ChevronRight,
  Sparkles,
  Clock3,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { resolvePathIcon } from '../utils/path-icon';
import type { LearningPath } from '../types/path.types';
import { getPathColors } from '../utils/path-color';

const DIFF_BADGE: Record<string, string> = {
  Beginner:
    'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-400',
  Intermediate:
    'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Advanced: 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-400',
  'All Levels': 'border-border bg-muted text-muted-foreground',
};

interface PathCardProps {
  path: LearningPath;
  index: number;
}

export function PathCard({ path, index }: PathCardProps) {
  const { t, i18n } = useTranslation('paths');
  const isAr = i18n.language === 'ar';
  const c = getPathColors(path.color);
  const title = isAr ? path.ar_title : path.title;
  const desc = isAr ? path.ar_description : path.description;
  const tags = isAr ? path.ar_tags : path.tags;
  const hasLock = path.modules.some((m) => m.isLocked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
      className='h-full'>
      <Link
        to={path.isComingSoon ? '#' : ROUTES.PATHS.DETAIL(path.slug)}
        onClick={path.isComingSoon ? (e) => e.preventDefault() : undefined}
        aria-disabled={path.isComingSoon}
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card',
          'transition-all duration-300 hover:shadow-xl',
          !path.isComingSoon && 'hover:-translate-y-1',
          path.isComingSoon && 'cursor-default opacity-80',
          c.border,
          !path.isComingSoon && c.hover,
        )}>
        {/* Color stripe */}
        <div className={cn('h-[3px] w-full', c.stripe)} />

        {/* Status badges — top-end corner */}
        <div className='absolute end-3 top-4 flex flex-col items-end gap-1'>
          {path.isComingSoon && (
            <span className='flex items-center gap-1 rounded-full bg-zinc-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm'>
              <Clock3 className='h-2.5 w-2.5' />
              {t('card.comingSoon')}
            </span>
          )}
          {!path.isComingSoon && path.isNew && (
            <span className='flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm'>
              <Sparkles className='h-2.5 w-2.5' />
              {t('card.new')}
            </span>
          )}
          {!path.isComingSoon && !path.isNew && path.isFeatured && (
            <span className='rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm'>
              {t('card.popular')}
            </span>
          )}
        </div>

        <div className='flex flex-1 flex-col gap-4 p-5'>
          {/* Icon + Title */}
          <div className='flex items-start gap-3'>
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                c.icon,
              )}>
              {resolvePathIcon(path.iconName, 'h-6 w-6')}
            </div>
            <div className='min-w-0 flex-1'>
              <h3 className='line-clamp-1 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary'>
                {title}
              </h3>
              <Badge
                variant='outline'
                className={cn(
                  'mt-1.5 rounded-full border px-2 py-px text-[10px] font-semibold',
                  DIFF_BADGE[path.difficulty],
                )}>
                {path.difficulty}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className='line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground'>
            {desc}
          </p>

          {/* Tags */}
          <div className='flex flex-wrap gap-1'>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                  c.badge,
                )}>
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className='rounded-full border border-border/40 px-2 py-0.5 text-[10px] text-muted-foreground'>
                +{tags.length - 3}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className='flex items-center gap-4 text-[11px] text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <BookOpen className='h-3 w-3' />
              {path.totalCourses} {t('card.courses')}
            </span>
            <span className='flex items-center gap-1'>
              <FlaskConical className='h-3 w-3' />
              {path.totalLabs} {t('card.labs')}
            </span>
            <span className='flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              {path.estimatedHours}
              {t('card.hours')}
            </span>
          </div>

          {/* Progress */}
          {path.enrolled && typeof path.progress === 'number' && (
            <div className='space-y-1'>
              <div className='flex items-center justify-between text-[10px]'>
                <span className='text-muted-foreground'>
                  {t('card.progress')}
                </span>
                <span className='font-semibold text-foreground'>
                  {path.progress}%
                </span>
              </div>
              <Progress
                value={path.progress}
                className={cn('h-1.5 bg-muted', c.bar)}
              />
            </div>
          )}

          {/* CTA */}
          <div className='flex items-center justify-between border-t border-border/30 pt-3'>
            {path.isComingSoon ? (
              <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Clock3 className='h-3.5 w-3.5' />
                {t('card.comingSoon')}
              </span>
            ) : (
              <Button
                size='sm'
                variant='outline'
                className={cn('gap-1.5 h-8 text-xs', c.btn)}>
                {path.enrolled ? t('card.continue') : t('card.startPath')}
                <ChevronRight className='h-3 w-3' />
              </Button>
            )}
            {hasLock && !path.isComingSoon && (
              <span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                <Lock className='h-2.5 w-2.5' />
                {t('card.includesPro')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
