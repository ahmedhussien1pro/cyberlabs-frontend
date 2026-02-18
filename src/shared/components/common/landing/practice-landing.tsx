/**
 * Practice Landing Component
 * Hero section for labs/practice page
 * @module shared/components/landing
 */

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LandingLayout } from './landing-layout';
import { cn } from '@/lib/utils';
import type { PracticeLandingProps } from './types';

// Default image - can be overridden via props
const DEFAULT_IMAGE = '/images/practice.png';

export function PracticeLanding({ onTryLab }: PracticeLandingProps = {}) {
  const { t } = useTranslation('website');

  return (
    <LandingLayout
      imageUrl={DEFAULT_IMAGE}
      imageAlt={t('landing.practice.title')}
      mobileImageSize={100}>
      {/* Desktop Layout */}
      <div className='hidden lg:block'>
        <h1
          className={cn(
            'text-2xl md:text-3xl lg:text-4xl font-extrabold',
            'text-primary leading-tight mb-1',
          )}>
          {t('landing.practice.title')}
        </h1>

        <h2
          className={cn(
            'text-base md:text-lg lg:text-xl font-semibold',
            'text-white/80 dark:text-foreground mb-3 leading-tight',
          )}>
          {t('landing.practice.subtitle')}
        </h2>
      </div>

      {/* Mobile Layout */}
      <div className='lg:hidden'>
        <div className='flex justify-between items-center gap-3 mb-2'>
          <div className='flex-grow min-w-0'>
            <h1
              className={cn(
                'text-xl font-extrabold text-primary leading-tight mb-1',
              )}>
              {t('landing.practice.title')}
            </h1>

            <h2
              className={cn(
                'text-sm font-semibold text-foreground/80 dark:text-foreground leading-tight',
              )}>
              {t('landing.practice.subtitle')}
            </h2>
          </div>

          {/* Mobile Inline Image */}
          <div className='flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-3 border-primary shadow-lg'>
            <img
              src={DEFAULT_IMAGE}
              alt={t('landing.practice.title')}
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <p
        className={cn(
          'text-white/80 text-sm md:text-base',
          'leading-relaxed max-w-2xl mb-4',
        )}>
        {t('landing.practice.description')}
      </p>

      {/* CTA Button */}
      <Button
        size='default'
        onClick={onTryLab}
        className={cn(
          'px-6 py-2 text-sm font-semibold shadow-md',
          'hover:shadow-lg transition-shadow',
          'rounded-md',
        )}>
        {t('landing.practice.cta')}
      </Button>
    </LandingLayout>
  );
}
