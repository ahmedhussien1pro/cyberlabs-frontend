// src/features/pricing/pages/pricing-page.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { SectionHeader } from '@/shared/components/common/section-header';
import { SectionCta } from '@/shared/components/common/section-cta';
import { PricingHero } from '../components/pricing-hero';
import { PlanCard } from '../components/plan-card';
import { FeatureTable } from '../components/feature-table';
import { PricingFaq } from '../components/pricing-faq';
import { PLANS } from '../data/plans.data';
import { usePlans, useMySubscription, useCheckout } from '../hooks/use-pricing';
import type { BillingCycle } from '../types/pricing.types';

// ── BillingToggle ────────────────────────────────────────────────────
function BillingToggle({
  cycle,
  onCycle,
}: {
  cycle: BillingCycle;
  onCycle: (c: BillingCycle) => void;
}) {
  const { t } = useTranslation('pricing');
  return (
    <div className='inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/30 p-1'>
      {(['monthly', 'annual'] as BillingCycle[]).map((c) => (
        <button
          key={c}
          onClick={() => onCycle(c)}
          className={cn(
            'rounded-full px-5 py-2 text-xs font-bold transition-all duration-200',
            cycle === c
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}>
          {t(`pricing.cycle.${c}`)}
          {c === 'annual' && (
            <span
              className={cn(
                'ms-1.5 rounded-full px-1.5 py-px text-[9px] font-black transition-colors',
                cycle === 'annual'
                  ? 'bg-emerald-400/30 text-emerald-600 dark:text-emerald-200'
                  : 'bg-muted text-muted-foreground',
              )}>
              -35%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function PricingPage() {
  const { t } = useTranslation('pricing');
  const [cycle, setCycle] = useState<BillingCycle>('annual');

  const { data: plans = PLANS } = usePlans();
  const { data: sub } = useMySubscription();
  const checkout = useCheckout();

  return (
    <MainLayout>
      {/* ① HERO */}
      <PricingHero />

      {/* ② PLAN CARDS */}
      <section className='border-t border-border/30 bg-muted/5 py-6 md:py-10'>
        <div className='container mx-auto px-4'>
          <SectionHeader
            title={t('pricing.plansTitle')}
            subtitle={t('pricing.plansLabel')}
            className='pb-0'
          />
          <div className='mb-8 flex justify-center'>
            <BillingToggle cycle={cycle} onCycle={setCycle} />
          </div>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                cycle={cycle}
                currentPlan={sub?.planId}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ③ FEATURE TABLE */}
      <div className='border-t border-border/30'>
        <FeatureTable />
      </div>

      {/* ④ FAQ */}
      <div className='border-t border-border/30'>
        <PricingFaq />
      </div>

      {/* ⑤ BOTTOM CTA — shared component */}
      <SectionCta
        eyebrow={t('pricing.cta.eyebrow')}
        title={t('pricing.cta.title')}
        desc={t('pricing.cta.desc')}
        trustNote={t('pricing.trust.inline')}
        primaryLabel={t('pricing.cta.upgradeCta')}
        secondaryLabel={t('pricing.cta.freeCta')}
        secondaryHref='/auth'
        onPrimary={() => checkout.mutate({ planId: 'pro', cycle })}
        primaryLoading={checkout.isPending}
      />
    </MainLayout>
  );
}
