import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface SectionCtaProps {
  eyebrow?: string;
  title: string;
  desc?: string;
  trustNote?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  onPrimary?: () => void;
  primaryLoading?: boolean;
  className?: string;
}

export function SectionCta({
  eyebrow,
  title,
  desc,
  trustNote,
  primaryLabel,
  secondaryLabel,
  secondaryHref = '/auth',
  onPrimary,
  primaryLoading,
  className,
}: SectionCtaProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-t border-border/30 py-24',
        className,
      )}>
      {/* Dark overlay */}
      <div className='absolute inset-0 z-[1] bg-gradient-to-b from-background/80 via-background/60 to-background/80' />

      <div className='container relative z-[2] mx-auto max-w-2xl px-4 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          {eyebrow && (
            <p className='mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary'>
              <Zap className='h-3 w-3' />
              {eyebrow}
            </p>
          )}

          <h2 className='mb-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl'>
            {title}
          </h2>

          {desc && (
            <p className='mb-8 text-base text-muted-foreground'>{desc}</p>
          )}

          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Button
              size='lg'
              className='gap-2 px-8 font-bold shadow-xl shadow-primary/25'
              disabled={primaryLoading}
              onClick={onPrimary}>
              <Zap className='h-4 w-4' />
              {primaryLabel}
            </Button>

            {secondaryLabel && (
              <Button variant='outline' size='lg' className='px-8' asChild>
                <a href={secondaryHref}>{secondaryLabel}</a>
              </Button>
            )}
          </div>

          {trustNote && (
            <p className='mt-6 text-xs text-muted-foreground/50'>{trustNote}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
