/**
 * Learn Landing Component
 * Hero section for learning/courses overview page
 * @module shared/components/landing
 */

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LandingLayout } from './landing-layout';
import { cn } from '@/lib/utils';
import type { LearnLandingProps } from './types';

// Default image - can be overridden via props
const DEFAULT_IMAGE = '/images/learning.png';

export function LearnLanding({ onStartLearning }: LearnLandingProps = {}) {
  const { t } = useTranslation('website');

  return (
    <LandingLayout
      imageUrl={DEFAULT_IMAGE}
      imageAlt={t('landing.learn.title')}
      mobileImageSize={100}>
      {/* Title */}
      <h1
        className={cn(
          'text-2xl md:text-3xl lg:text-4xl font-extrabold',
          'text-primary leading-tight mb-1',
        )}>
        {t('landing.learn.title')}
      </h1>

      {/* Subtitle */}
      <h2
        className={cn(
          'text-base md:text-lg lg:text-xl font-semibold',
          'text-white/80 dark:text-foreground mb-3 leading-tight',
        )}>
        {t('landing.learn.subtitle')}
      </h2>

      {/* Description */}
      <p
        className={cn(
          'text-white/80 text-sm md:text-base',
          'leading-relaxed max-w-2xl mb-4',
        )}>
        {t('landing.learn.description')}
      </p>

      {/* CTA Button */}
      <Button
        size='default'
        onClick={onStartLearning}
        className={cn(
          'px-6 py-2 text-sm font-semibold shadow-md',
          'hover:shadow-lg transition-shadow',
          'rounded-md',
        )}>
        {t('landing.learn.cta')}
      </Button>
    </LandingLayout>
  );
}
