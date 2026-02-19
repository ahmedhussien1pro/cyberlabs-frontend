// src/features/landing/components/testimonials-section.tsx
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/shared/components/common';
import { cn } from '@/shared/utils';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_CONFIDENCE_THRESHOLD = 10000;

export function TestimonialsSection() {
  const { t, i18n } = useTranslation('landing');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials: Testimonial[] = t('testimonials.items', {
    returnObjects: true,
  }) as Testimonial[];

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrent((prev) => {
        const next = prev + newDirection;
        if (next < 0) return testimonials.length - 1;
        if (next >= testimonials.length) return 0;
        return next;
      });
    },
    [testimonials.length],
  );

  // Auto-play
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      paginate(1);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, paginate]);

  const isRTL = i18n.dir() === 'rtl';

  // Swipe detection
  const swipeConfidenceFactor = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo,
  ) => {
    const swipe = swipeConfidenceFactor(offset.x, velocity.x);

    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(isRTL ? -1 : 1);
    } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(isRTL ? 1 : -1);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (isRTL ? -500 : 500) : isRTL ? 500 : -500,
      opacity: 0,
      rotateY: dir > 0 ? -15 : 15,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? (isRTL ? 500 : -500) : isRTL ? -500 : 500,
      opacity: 0,
      rotateY: dir > 0 ? 15 : -15,
    }),
  };

  return (
    <section className='relative overflow-hidden py-6 md:py-10'>
      {/* Background */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent' />
        <div className='absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent' />
        {/* Radial gradient */}
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/[0.02] blur-3xl' />
      </div>

      <div className='container'>
        <SectionHeader
          title={t('testimonials.title')}
          subtitle={t('testimonials.subtitle')}
        />

        <div
          className='relative mx-auto max-w-4xl'
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}>
          {/* Large Quote Background */}
          <div className='absolute -top-10 start-6 z-0 opacity-[0.06] pointer-events-none'>
            <Quote className='h-40 w-40 text-primary' fill='currentColor' />
          </div>

          {/* Carousel with drag */}
          <div className='relative min-h-[260px] perspective-1000'>
            <AnimatePresence initial={false} custom={direction} mode='wait'>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial='enter'
                animate='center'
                exit='exit'
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  rotateY: { duration: 0.3 },
                }}
                drag='x'
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className='cursor-grab active:cursor-grabbing'>
                <Card className='border-white/5 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow duration-300'>
                  <CardContent className='relative p-8 md:p-12'>
                    {/* Top accent line */}
                    <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent' />

                    {/* Stars */}
                    <div className='mb-6 flex gap-1'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-5 w-5 transition-all duration-300',
                            i < testimonials[current].rating
                              ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                              : 'fill-muted/30 text-muted/30',
                          )}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <blockquote className='relative mb-8 text-base leading-relaxed text-foreground/90 md:text-lg before:content-["""] after:content-["""] before:text-primary/30 after:text-primary/30 before:text-3xl after:text-3xl before:absolute before:-left-2 before:-top-2 after:absolute after:-bottom-8 after:-right-2'>
                      <span className='relative z-10'>
                        {testimonials[current].content}
                      </span>
                    </blockquote>

                    {/* Author */}
                    <div className='flex items-center gap-4'>
                      {/* Avatar with gradient ring */}
                      <div className='relative flex-shrink-0'>
                        <div className='absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary/40 blur-sm' />
                        <div className='relative flex h-14 w-14 items-center justify-center rounded-full bg-card ring-2 ring-primary/30'>
                          <span className='text-lg font-bold text-primary'>
                            {testimonials[current].name.charAt(0)}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className='min-w-0 flex-1'>
                        <h4 className='font-semibold text-base text-foreground'>
                          {testimonials[current].name}
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                          <span className='font-medium'>
                            {testimonials[current].role}
                          </span>
                          {' • '}
                          <span className='text-primary/70'>
                            {testimonials[current].company}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom decorative element */}
                    <div className='absolute bottom-0 right-6 h-16 w-16 rounded-tl-full bg-primary/5' />
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className='mt-10 flex items-center justify-center gap-5'>
            {/* Prev Button */}
            <Button
              variant='outline'
              size='icon'
              className='h-11 w-11 rounded-full border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 transition-all'
              onClick={() => paginate(-1)}
              aria-label='Previous'>
              <ChevronLeft className='h-5 w-5 rtl:rotate-180' />
            </Button>

            {/* Dots with progress */}
            <div className='flex gap-2.5'>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className='relative group'
                  aria-label={`Testimonial ${i + 1}`}>
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      i === current
                        ? 'w-10 bg-primary shadow-sm shadow-primary/50'
                        : 'w-2 bg-muted group-hover:bg-muted-foreground/60 group-hover:w-3',
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant='outline'
              size='icon'
              className='h-11 w-11 rounded-full border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 transition-all'
              onClick={() => paginate(1)}
              aria-label='Next'>
              <ChevronRight className='h-5 w-5 rtl:rotate-180' />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
