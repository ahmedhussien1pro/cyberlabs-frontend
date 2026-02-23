// src/features/pricing/pages/pricing-page.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { SectionCta } from '@/shared/components/common/section-cta';
import { PricingHero } from '../components/pricing-hero';
import { PricingPlansSectionV07 } from '../components/plan-card';

import { FeatureTable } from '../components/feature-table';
import { PricingFaq } from '../components/pricing-faq';
import { PLANS } from '../data/plans.data';
import { usePlans, useMySubscription, useCheckout } from '../hooks/use-pricing';
import type { BillingCycle } from '../types/pricing.types';

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

      {/* ② PLAN CARDS
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
              
            ))}
          </div>
        </div>
      </section> */}
      <PricingPlansSectionV07
        plans={plans}
        cycle={cycle}
        onCycle={setCycle}
        currentPlan={sub?.planId}
      />

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
