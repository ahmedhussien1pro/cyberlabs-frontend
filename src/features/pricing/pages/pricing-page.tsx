// src/features/pricing/pages/pricing-page.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: plans = PLANS } = usePlans();
  const { data: sub } = useMySubscription();
  const checkout = useCheckout();

  // ── Handle Stripe redirect result ───────────────────────────────────
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success(
        t(
          'pricing.paymentSuccess',
          '🎉 Subscription activated! Welcome aboard.',
        ),
        {
          duration: 6000,
        },
      );
      // Invalidate subscription cache to reflect new plan immediately
      queryClient.invalidateQueries({ queryKey: ['pricing', 'subscription'] });
      navigate('/pricing', { replace: true });
    }

    if (searchParams.get('canceled') === 'true') {
      toast.info(
        t('pricing.paymentCanceled', 'Payment canceled. No charges were made.'),
      );
      navigate('/pricing', { replace: true });
    }
  }, []);

  return (
    <MainLayout>
      {/* ① HERO */}
      <PricingHero />

      {/* ② PLAN CARDS */}
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

      {/* ⑤ BOTTOM CTA */}
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
