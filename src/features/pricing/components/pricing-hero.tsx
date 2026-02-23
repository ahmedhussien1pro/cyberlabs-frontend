import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LandingLayout } from '@/shared/components/common/landing/landing-layout';
import type { BillingCycle } from '../types/pricing.types';

const PRICING_IMAGE = '/assets/images/practice.png';

interface PricingHeroProps {
  cycle: BillingCycle;
  onCycle: (c: BillingCycle) => void;
}

export function PricingHero({ cycle, onCycle }: PricingHeroProps) {
  const { t } = useTranslation('pricing');

  return (
    <LandingLayout
      imageUrl={PRICING_IMAGE}
      imageAlt={t('pricing.heroImageAlt')}
      mobileImageSize={90}
      className='[&_.landing-image-wrapper]:lg:col-span-5 [&_.landing-content-wrapper]:lg:col-span-7'>
      {/* ── Desktop ───────────────────────────────────────────────── */}
      <div className='hidden lg:block'>
        <HeroContent t={t} cycle={cycle} onCycle={onCycle} />
      </div>

      {/* ── Mobile ────────────────────────────────────────────────── */}
      <div className='lg:hidden'>
        <div className='mb-3 flex items-center justify-between gap-3'>
          <div className='min-w-0 flex-1'>
            <EyebrowBadge label={t('pricing.eyebrow')} />
            <h1 className='mt-2 text-xl font-extrabold leading-tight text-primary'>
              {t('pricing.heroTitle')}
            </h1>
            <h2 className='mt-0.5 text-sm font-semibold leading-tight text-white/80'>
              {t('pricing.heroSubtitle')}
            </h2>
          </div>
          <div className='h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary shadow-lg shadow-primary/30'>
            <img
              src={PRICING_IMAGE}
              alt={t('pricing.heroImageAlt')}
              className='h-full w-full object-cover'
              loading='eager'
            />
          </div>
        </div>
        <BillingToggle t={t} cycle={cycle} onCycle={onCycle} />
      </div>
    </LandingLayout>
  );
}

// ── Sub-components ───────────────────────────────────────────────────

function HeroContent({
  t,
  cycle,
  onCycle,
}: {
  t: ReturnType<typeof useTranslation<'pricing'>>['t'];
  cycle: BillingCycle;
  onCycle: (c: BillingCycle) => void;
}) {
  return (
    <>
      <EyebrowBadge label={t('pricing.eyebrow')} />

      <h1 className='mt-3 text-2xl font-extrabold leading-tight text-primary md:text-3xl lg:text-4xl'>
        {t('pricing.heroTitle')}
      </h1>

      <h2 className='mb-3 mt-1 text-base font-semibold leading-tight text-white/80 md:text-lg'>
        {t('pricing.heroSubtitle')}
      </h2>

      <p className='mb-6 max-w-lg text-sm leading-relaxed text-white/60 md:text-base'>
        {t('pricing.heroDesc')}
      </p>

      <BillingToggle t={t} cycle={cycle} onCycle={onCycle} />

      {/* Trust micro-text */}
      <p className='mt-4 text-xs text-white/35'>{t('pricing.trust.inline')}</p>
    </>
  );
}

function EyebrowBadge({ label }: { label: string }) {
  return (
    <div className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary'>
      <CreditCard className='h-3 w-3' />
      {label}
    </div>
  );
}

function BillingToggle({
  t,
  cycle,
  onCycle,
}: {
  t: ReturnType<typeof useTranslation<'pricing'>>['t'];
  cycle: BillingCycle;
  onCycle: (c: BillingCycle) => void;
}) {
  return (
    <div className='inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1'>
      {(['monthly', 'annual'] as BillingCycle[]).map((c) => (
        <button
          key={c}
          onClick={() => onCycle(c)}
          className={cn(
            'rounded-full px-5 py-2 text-xs font-bold transition-all duration-200',
            cycle === c
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-white/50 hover:text-white/80',
          )}>
          {t(`pricing.cycle.${c}`)}
          {c === 'annual' && (
            <span
              className={cn(
                'ms-1.5 rounded-full px-1.5 py-px text-[9px] font-black transition-colors',
                cycle === 'annual'
                  ? 'bg-emerald-400/30 text-emerald-200'
                  : 'bg-white/10 text-white/40',
              )}>
              -35%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
