/**
 * Landing Layout Component
 * Shared layout wrapper for all landing pages with Matrix background
 * @module shared/components/landing
 */

import { MatrixRain } from './matrix-rain';
import { LandingImage } from './components/landing-image';
import { cn } from '@/lib/utils';
import type { LandingLayoutProps } from './types';

export function LandingLayout({
  children,
  imageUrl,
  imageAlt = 'Course Image',
  imageSide = 'right',
  showMobileImage = true,
  mobileImageSize = 80,
  className,
}: LandingLayoutProps) {
  return (
    <div className='relative min-h-[40vh] flex items-center overflow-hidden py-6 md:py-8'>
      {/* Matrix Background */}
      <MatrixRain opacity={0.15} />

      {/* Content Container */}
      <div className={cn('container relative z-[2] mx-auto ', className)}>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center'>
          {/* Left Side Content (or full width on mobile) */}
          <div
            className={cn(
              'lg:col-span-8',
              imageSide === 'left' && 'lg:order-2',
            )}>
            {children}
          </div>

          {/* Right Side Image (Desktop Only) */}
          {imageUrl && (
            <div
              className={cn(
                'hidden lg:block lg:col-span-4',
                imageSide === 'left' && 'lg:order-1',
              )}>
              <LandingImage src={imageUrl} alt={imageAlt} />
            </div>
          )}
        </div>

        {/* Mobile Image (if enabled) */}
        {imageUrl && showMobileImage && (
          <div className='flex justify-center mt-5 lg:hidden'>
            <div
              className='relative rounded-full overflow-hidden border-3 border-primary shadow-lg shadow-primary/30'
              style={{
                width: `${mobileImageSize}px`,
                height: `${mobileImageSize}px`,
              }}>
              <img
                src={imageUrl}
                alt={imageAlt}
                className='w-full h-full object-cover'
                loading='lazy'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
