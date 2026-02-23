import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ShieldCheck,
  Terminal,
  BookOpen,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon per FAQ item — adds personality
const FAQ_ICONS = [Terminal, BookOpen, ShieldCheck, Award, ShieldCheck];

// Keys must match JSON exactly
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;
type FaqKey = (typeof FAQ_KEYS)[number];

export function PricingFaq() {
  const { t } = useTranslation('pricing');
  const [open, setOpen] = useState<FaqKey | null>('q1');

  return (
    <section className='bg-background py-20'>
      <div className='container mx-auto max-w-6xl px-4'>
        {/* ── Two-col layout ──────────────────────────────────────── */}
        <div className='grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:items-start'>
          {/* LEFT col */}
          <div>
            {/* Eyebrow */}
            <p className='mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-primary'>
              {t('pricing.faq.eyebrow')}
            </p>

            <h2 className='mb-5 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl'>
              {t('pricing.faq.title')}
            </h2>

            <p className='mb-8 text-sm leading-relaxed text-muted-foreground'>
              {t('pricing.faq.subtitle')}
            </p>

            {/* Stats grid */}
            <div className='grid grid-cols-2 gap-3'>
              {(['stat1', 'stat2', 'stat3', 'stat4'] as const).map((k) => (
                <div
                  key={k}
                  className='rounded-xl border border-border/40 bg-muted/20 p-4'>
                  <p className='text-2xl font-black text-primary'>
                    {t(`pricing.faq.${k}.value`)}
                  </p>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {t(`pricing.faq.${k}.label`)}
                  </p>
                </div>
              ))}
            </div>

            {/* Platform trust badge */}
            <div className='mt-6 flex items-center gap-2 rounded-xl border border-border/30 bg-muted/10 px-4 py-3'>
              <ShieldCheck className='h-4 w-4 shrink-0 text-primary' />
              <p className='text-xs font-semibold text-muted-foreground'>
                {t('pricing.faq.platformCaption')}
              </p>
            </div>
          </div>

          {/* RIGHT col — numbered accordion */}
          <div>
            {/* Sub label */}
            <div className='mb-5 flex items-center gap-3'>
              <div className='h-px flex-1 bg-border/30' />
              <p className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60'>
                {t('pricing.faq.subLabel')}
              </p>
              <div className='h-px flex-1 bg-border/30' />
            </div>

            <div className='space-y-2'>
              {FAQ_KEYS.map((k, i) => {
                const isOpen = open === k;
                const Icon = FAQ_ICONS[i];

                return (
                  <div
                    key={k}
                    className={cn(
                      'overflow-hidden rounded-xl border transition-all duration-200',
                      isOpen
                        ? 'border-primary/30 bg-primary/5 shadow-sm shadow-primary/5'
                        : 'border-border/40 bg-card hover:border-border/70',
                    )}>
                    {/* Trigger */}
                    <button
                      onClick={() => setOpen(isOpen ? null : k)}
                      className='flex w-full items-center gap-4 px-4 py-4 text-start'>
                      {/* Number + Icon */}
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                          isOpen
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}>
                        <span className='text-[11px] font-black'>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <span
                        className={cn(
                          'flex-1 text-sm font-semibold',
                          isOpen ? 'text-foreground' : 'text-foreground/80',
                        )}>
                        {t(`pricing.faq.${k}.q`)}
                      </span>

                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isOpen
                              ? 'text-primary'
                              : 'text-muted-foreground/50',
                          )}
                        />
                      </motion.div>
                    </button>

                    {/* Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key='content'
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}>
                          <p className='border-t border-primary/10 px-4 pb-4 pt-3 ps-16 text-sm leading-relaxed text-muted-foreground'>
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
