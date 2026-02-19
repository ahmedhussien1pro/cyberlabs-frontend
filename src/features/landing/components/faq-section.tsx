// src/features/landing/components/faq-section.tsx
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/shared/components/common';
import { cn } from '@/shared/utils';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_IMAGES = [
  '/assets/images/img1.png',
  '/assets/images/img2.png',
  '/assets/images/img3.png',
  '/assets/images/img4.png',
];

const IMAGE_INTERVAL = 4000;

function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = useCallback((dir: number) => {
    setDirection(dir);
    setCurrent((prev) => {
      const next = prev + dir;
      if (next < 0) return FAQ_IMAGES.length - 1;
      if (next >= FAQ_IMAGES.length) return 0;
      return next;
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => paginate(1), IMAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, paginate]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div
      className='relative overflow-hidden rounded-2xl border border-white/5 bg-card shadow-xl'
      style={{ aspectRatio: '4/3' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode='sync'>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 35 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className='absolute inset-0'>
          <img
            src={FAQ_IMAGES[current]}
            alt={`Slide ${current + 1}`}
            className='h-full w-full object-cover'
          />
          {/* Overlay */}
          <div className='absolute inset-0 bg-gradient-to-tr from-background/70 via-background/20 to-transparent' />
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <button
        onClick={() => paginate(-1)}
        className='absolute start-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/60 text-foreground backdrop-blur-sm transition hover:bg-background/80 hover:border-primary/30'
        aria-label='Previous image'>
        <ChevronLeft className='h-4 w-4 rtl:rotate-180' />
      </button>

      <button
        onClick={() => paginate(1)}
        className='absolute end-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/60 text-foreground backdrop-blur-sm transition hover:bg-background/80 hover:border-primary/30'
        aria-label='Next image'>
        <ChevronRight className='h-4 w-4 rtl:rotate-180' />
      </button>

      {/* Dots */}
      <div className='absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5'>
        {FAQ_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === current
                ? 'w-6 bg-primary shadow-sm shadow-primary/50'
                : 'w-1.5 bg-white/40 hover:bg-white/60',
            )}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>

      {/* Badge */}
      <div className='absolute bottom-4 start-4 z-10 flex items-center gap-2 rounded-xl border border-primary/20 bg-background/70 px-3 py-2 backdrop-blur-sm'>
        <Shield className='h-4 w-4 text-primary' />
        <span className='text-xs font-semibold text-foreground'>
          Trusted Cybersecurity Platform
        </span>
      </div>

      {/* Progress bar */}
      {!isPaused && (
        <motion.div
          key={`progress-${current}`}
          className='absolute bottom-0 left-0 z-10 h-0.5 bg-primary'
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: IMAGE_INTERVAL / 1000, ease: 'linear' }}
        />
      )}
    </div>
  );
}

export function FaqSection() {
  const { t } = useTranslation('landing');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = t('faq.items', {
    returnObjects: true,
  }) as FaqItem[];

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className='relative overflow-hidden py-6 md:py-10'>
      {/* Background */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent' />
        <div className='absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent' />
        <div className='absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/[0.03] blur-3xl' />
        <div className='absolute -right-40 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/[0.02] blur-3xl' />
      </div>

      <div className='container'>
        <SectionHeader title={t('faq.label')} subtitle={t('faq.title')} />

        <div className='mt-2 grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
          {/* ── Left: Image Slider ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='relative hidden lg:block'>
            {/* Glow */}
            <div className='absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl' />

            <div className='relative'>
              <ImageSlider />

              {/* Decorative dots */}
              <div className='absolute -bottom-4 -end-4 grid grid-cols-4 gap-1.5 opacity-20'>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-1.5 w-1.5 rounded-full bg-primary'
                  />
                ))}
              </div>

              {/* Decorative dots top */}
              <div className='absolute -start-4 -top-4 grid grid-cols-3 gap-1.5 opacity-15'>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-1.5 w-1.5 rounded-full bg-primary'
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: Accordion ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='space-y-3'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='h-px flex-1 bg-primary/50' />
              <h5 className='text-sm font-semibold uppercase tracking-widest text-primary/80'>
                {t('faq.subtitle')}
              </h5>
              <div className='h-px flex-1 bg-primary/50' />
            </div>

            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={cn(
                  'group rounded-xl border transition-all duration-300',
                  openIndex === i
                    ? 'border-primary/30 bg-card shadow-md shadow-primary/5'
                    : 'border-black/10 dark:border-white/5 bg-card/50 hover:border-primary/15 hover:bg-card/80',
                )}>
                {/* Question */}
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={openIndex === i}
                  className='flex w-full items-center gap-4 px-5 py-4 text-start'>
                  {/* Number */}
                  <span
                    className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300',
                      openIndex === i
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                        : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
                    )}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Text */}
                  <span
                    className={cn(
                      'flex-1 text-sm font-semibold leading-snug transition-colors duration-300 md:text-base',
                      openIndex === i
                        ? 'text-foreground'
                        : 'text-foreground/80 group-hover:text-foreground',
                    )}>
                    {faq.question}
                  </span>

                  {/* Chevron */}
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 flex-shrink-0 text-muted-foreground transition-all duration-300',
                      openIndex === i && 'rotate-180 text-primary',
                    )}
                  />
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}>
                      <div className='border-t border-border/40 px-5 pb-5 pt-3'>
                        <div className='flex gap-4'>
                          <div className='w-8 flex-shrink-0' />
                          <p className='text-sm leading-relaxed text-muted-foreground'>
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
