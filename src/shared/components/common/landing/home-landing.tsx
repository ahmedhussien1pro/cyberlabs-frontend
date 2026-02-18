import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LandingLayout } from './landing-layout';
import { cn } from '@/lib/utils';
import type { HomeLandingProps } from './types';

// Default hero image
const DEFAULT_IMAGE = '/images/hero-hacker.svg';

export function HomeLanding({
  onDiscoverCourses,
  onWatchDemo,
}: HomeLandingProps = {}) {
  const { t } = useTranslation('website');

  return (
    <LandingLayout
      imageUrl={DEFAULT_IMAGE}
      imageAlt={t('landing.home.title')}
      mobileImageSize={120}
      className='min-h-[70vh]'>
      {/* Italic Header with Line */}
      <div className='flex items-center gap-4 mb-3'>
        <div className='h-[2px] w-6 bg-current flex-shrink-0' />
        <h3
          className={cn(
            'text-2xl md:text-3xl font-medium',
            'text-foreground/90 dark:text-foreground/90',
            'italic leading-tight',
            'font-dancing', // We'll add this font
          )}>
          {t('landing.home.header')}
        </h3>
      </div>

      {/* Main Gradient Title */}
      <h1
        className={cn(
          'text-2xl md:text-3xl lg:text-4xl font-extrabold',
          'bg-gradient-to-r from-primary via-cyan-500 to-blue-400',
          'bg-clip-text text-transparent',
          'leading-tight mb-4 capitalize',
        )}>
        {t('landing.home.title')}
      </h1>

      {/* Description */}
      <p
        className={cn(
          'text-muted-foreground text-sm md:text-base',
          'leading-relaxed max-w-2xl mb-6',
        )}>
        {t('landing.home.description')}
      </p>

      {/* CTA Buttons */}
      <div className='flex flex-wrap items-center gap-4'>
        {/* Primary Button */}
        <Button
          size='lg'
          onClick={onDiscoverCourses}
          className={cn(
            'px-6 py-3 text-sm font-semibold shadow-lg',
            'hover:shadow-xl transition-all',
            'rounded-full',
          )}>
          {t('landing.home.cta.discover')}
        </Button>

        {/* Watch Demo Button */}
        <Button
          variant='ghost'
          size='lg'
          onClick={onWatchDemo}
          className={cn(
            'gap-2 px-6 py-3 text-sm font-bold',
            'text-foreground hover:text-primary',
            'transition-colors',
          )}>
          <Play className='h-4 w-4 fill-current' />
          {t('landing.home.cta.watch')}
        </Button>
      </div>
    </LandingLayout>
  );
}
