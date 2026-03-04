// src/shared/components/common/detail-page-hero.tsx
import type { ReactNode } from 'react';
import { MatrixRain } from '@/shared/components/common/landing/matrix-rain';
import { cn } from '@/lib/utils';

export interface DetailPageHeroProps {
  // Color theming
  color?: string; // e.g. 'emerald' | 'blue' | 'violet' ...
  matrixColor?: string; // hex — optional, fallback to default
  stripeClass?: string; // tailwind class for top color stripe
  bloomClass?: string; // tailwind class for bloom bg

  // Layout slots
  breadcrumb?: ReactNode;
  iconSlot?: ReactNode; // path icon box أو course thumbnail
  titleSlot: ReactNode; // h1
  badgesSlot?: ReactNode;
  descriptionSlot?: ReactNode;
  statsSlot?: ReactNode;
  progressSlot?: ReactNode; // progress bar (path) أو داخل sidebar (course)
  sidebarSlot?: ReactNode; // topics sidebar (course فقط)
  ctaSlot?: ReactNode;
  bottomBarSlot?: ReactNode; // bottom bar كامل (path فقط)

  className?: string;
}

export function DetailPageHero({
  matrixColor,
  stripeClass,
  bloomClass,
  breadcrumb,
  iconSlot,
  titleSlot,
  badgesSlot,
  descriptionSlot,
  statsSlot,
  progressSlot,
  sidebarSlot,
  ctaSlot,
  bottomBarSlot,
  className,
}: DetailPageHeroProps) {
  const hasSidebar = !!sidebarSlot;

  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-white/8 bg-zinc-950',
        className,
      )}>
      {/* ── Color stripe ── */}
      {stripeClass && (
        <div
          className={cn('absolute inset-x-0 top-0 z-[3] h-[3px]', stripeClass)}
        />
      )}

      {/* ── Matrix Rain ── */}
      <MatrixRain color={matrixColor} opacity={0.07} speed={6} />

      {/* ── Bloom ── */}
      {bloomClass && (
        <div
          aria-hidden='true'
          className={cn(
            'pointer-events-none absolute -start-20 -top-10 z-[1]',
            'h-56 w-56 rounded-full blur-3xl opacity-[0.12]',
            bloomClass,
          )}
        />
      )}

      {/* ── Content ── */}
      <div className='container relative z-[2] mx-auto px-4'>
        <div className='py-6'>
          {/* Breadcrumb */}
          {breadcrumb && (
            <nav className='mb-4 flex items-center gap-1 text-[11px] text-white/35'>
              {breadcrumb}
            </nav>
          )}

          {/* Main row: icon + text */}
          <div
            className={cn(
              'gap-6 items-start',
              hasSidebar ? 'grid lg:grid-cols-[1fr_260px]' : 'flex flex-col',
            )}>
            {/* Left: icon + text + cta */}
            <div className='flex flex-col gap-5 min-w-0'>
              <div className='flex items-start gap-4'>
                {/* Icon / Thumbnail */}
                {iconSlot && (
                  <div className='hidden sm:block shrink-0'>{iconSlot}</div>
                )}

                {/* Text block */}
                <div className='min-w-0 flex-1 space-y-2'>
                  {badgesSlot && (
                    <div className='flex flex-wrap items-center gap-1.5'>
                      {badgesSlot}
                    </div>
                  )}
                  {titleSlot}
                  {descriptionSlot}
                  {statsSlot && (
                    <div className='flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60'>
                      {statsSlot}
                    </div>
                  )}
                  {progressSlot}
                </div>
              </div>

              {/* CTA box */}
              {ctaSlot}
            </div>

            {/* Right: topics sidebar */}
            {sidebarSlot && (
              <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3 self-stretch'>
                {sidebarSlot}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar (path only) */}
        {bottomBarSlot && (
          <div
            className={cn(
              'flex flex-wrap items-center justify-between gap-x-6 gap-y-3',
              'border-t border-white/10 py-3',
            )}>
            {bottomBarSlot}
          </div>
        )}
      </div>
    </section>
  );
}
