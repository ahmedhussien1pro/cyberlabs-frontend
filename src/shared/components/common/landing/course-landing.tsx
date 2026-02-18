/**
 * Course Landing Component
 * Hero section for course detail pages
 * @module shared/components/landing
 */

import { UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LandingLayout } from './landing-layout';
import { StatsBar } from './components/stats-bar';
import { ActionButtons } from './components/action-buttons';
import { useLandingActions } from './hooks/use-landing-actions';
import { cn } from '@/lib/utils';
import type { CourseLandingProps } from './types';

export function CourseLanding({
  title,
  description,
  difficulty,
  duration,
  courseImage,
  instructor = 'CyberLabs',
  rating = 4.8,
  students = 2543,
  onStartLearning,
  onSave,
  onFavorite,
  isSaved = false,
  isFavorite = false,
}: CourseLandingProps) {
  const { t, i18n } = useTranslation('courses');
  const isRTL = i18n.language === 'ar';

  const { saved, favorite, handleSave, handleFavorite } = useLandingActions({
    initialSaved: isSaved,
    initialFavorite: isFavorite,
    onSave,
    onFavorite,
  });

  const displayTitle = isRTL ? title.ar : title.en;
  const displayDescription = isRTL ? description.ar : description.en;

  return (
    <LandingLayout imageUrl={courseImage} imageAlt={displayTitle}>
      {/* Desktop Header */}
      <div className='hidden lg:flex items-baseline gap-4 mb-2 flex-wrap'>
        <h1
          className={cn(
            'text-2xl md:text-3xl lg:text-4xl font-extrabold',
            'text-primary leading-tight flex-grow-0',
          )}>
          {displayTitle}
        </h1>

        {/* Instructor Badge */}
        <Badge
          variant='outline'
          className={cn(
            'gap-2 px-3 py-1.5 text-sm font-semibold flex-shrink-1',
            'bg-primary/10 border-primary/30 backdrop-blur-sm',
            'dark:border-primary/20',
          )}>
          <UserCircle className='h-4 w-4 text-primary' aria-hidden='true' />
          <span className='text-muted-foreground'>
            {t('landing.by')} {instructor}
          </span>
        </Badge>
      </div>

      {/* Mobile Header */}
      <div className='lg:hidden'>
        <div className='flex justify-between items-start gap-3 mb-2'>
          <div className='flex-grow min-w-0'>
            <h1
              className={cn(
                'text-xl font-extrabold text-primary leading-tight mb-1',
              )}>
              {displayTitle}
            </h1>

            {/* Instructor Badge - Mobile */}
            <Badge
              variant='outline'
              className={cn(
                'gap-2 px-2.5 py-1 text-xs font-semibold',
                'bg-primary/10 border-primary/30 dark:border-primary/20',
              )}>
              <UserCircle className='h-3.5 w-3.5 text-primary' />
              <span className='text-muted-foreground'>
                {t('landing.by')} {instructor}
              </span>
            </Badge>
          </div>

          {/* Mobile Image */}
          {courseImage && (
            <div className='flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-3 border-primary shadow-lg'>
              <img
                src={courseImage}
                alt={displayTitle}
                className='w-full h-full object-cover'
              />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p
        className={cn(
          'text-white/80 text-sm md:text-base',
          'leading-relaxed max-w-2xl mb-3 line-clamp-3',
        )}>
        {displayDescription}
      </p>

      {/* Stats Bar */}
      <div className='mb-4'>
        <StatsBar
          rating={rating}
          difficulty={difficulty}
          duration={duration}
          students={students}
        />
      </div>

      {/* Action Buttons */}
      <div className='flex flex-wrap gap-3 items-center'>
        <Button
          size='default'
          onClick={onStartLearning}
          className={cn(
            'px-6 py-2 text-sm font-semibold shadow-md',
            'hover:shadow-lg transition-shadow',
          )}>
          {t('landing.startLearning')}
        </Button>

        <ActionButtons
          onSave={handleSave}
          onFavorite={handleFavorite}
          isSaved={saved}
          isFavorite={favorite}
        />
      </div>
    </LandingLayout>
  );
}
