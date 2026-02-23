import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQ_IMAGE = '/assets/images/img1.png';

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

export function PricingFaq() {
  const { t, i18n } = useTranslation('pricing');
  const isAr = i18n.language === 'ar';
  const [open, setOpen] = useState<string>('q1');

  return (
    <section className='bg-background py-16'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-12 lg:grid-cols-2 lg:items-start'>
          {/* ── LEFT: label + image/platform card ─────────────────── */}
          <div className={cn(isAr && 'lg:order-2')}>
            {/* Eyebrow */}
            <div className='mb-2 flex items-center gap-3'>
              <div className='h-px flex-1 bg-primary/40' />
              <p className='text-[10px] font-black uppercase tracking-widest text-primary'>
                {t('pricing.faq.eyebrow')}
              </p>
              <div className='h-px flex-1 bg-primary/40' />
            </div>

            <h2 className='mb-8 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl'>
              {t('pricing.faq.title')}
            </h2>

            {/* Platform showcase card */}
            <div className='relative overflow-hidden rounded-2xl border border-border/50 bg-muted/10'>
              {/* Carousel-style image placeholder */}
              <div className='relative aspect-[4/3] overflow-hidden bg-zinc-900'>
                <img
                  src={FAQ_IMAGE}
                  alt='CyberLabs Platform'
                  className='h-full w-full object-cover opacity-80'
                />
                {/* Overlay gradient */}
                <div className='absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent' />

                {/* Nav arrows */}
                <div className='absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3'>
                  {['←', '→'].map((arrow, i) => (
                    <button
                      key={i}
                      className='flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-sm text-white/70 backdrop-blur-sm hover:bg-black/60'>
                      {arrow}
                    </button>
                  ))}
                </div>

                {/* Dots */}
                <div className='absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5'>
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        d === 1 ? 'w-4 bg-primary' : 'w-1.5 bg-white/30',
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Caption bar */}
              <div className='flex items-center gap-2 border-t border-border/30 bg-muted/20 px-4 py-2.5'>
                <ShieldCheck className='h-3.5 w-3.5 text-primary' />
                <p className='text-xs font-semibold text-muted-foreground'>
                  {t('pricing.faq.platformCaption')}
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: numbered accordion ─────────────────────────── */}
          <div className={cn(isAr && 'lg:order-1')}>
            {/* "Everything you need" label */}
            <div className='mb-5 flex items-center gap-3'>
              <div className='h-px flex-1 bg-border/40' />
              <p className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
                {t('pricing.faq.subLabel')}
              </p>
              <div className='h-px flex-1 bg-border/40' />
            </div>

            <div className='space-y-2'>
              {FAQ_KEYS.map((k, i) => {
                const isOpen = open === k;
                return (
                  <div
                    key={k}
                    className={cn(
                      'overflow-hidden rounded-xl border transition-all duration-200',
                      isOpen
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border/40 bg-card',
                    )}>
                    <button
                      onClick={() => setOpen(isOpen ? '' : k)}
                      className='flex w-full items-center gap-4 px-5 py-4 text-start'>
                      {/* Number badge */}
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-colors',
                          isOpen
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}>
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <span
                        className={cn(
                          'flex-1 text-sm font-semibold transition-colors',
                          isOpen ? 'text-foreground' : 'text-foreground/80',
                        )}>
                        {t(`pricing.faq.${k}.q`)}
                      </span>

                      {isOpen ? (
                        <ChevronUp className='h-4 w-4 shrink-0 text-primary' />
                      ) : (
                        <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground' />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key='body'
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}>
                          <p className='px-5 pb-4 ps-16 text-sm leading-relaxed text-muted-foreground'>
                            {t(`pricing.faq.${k}.a`)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
