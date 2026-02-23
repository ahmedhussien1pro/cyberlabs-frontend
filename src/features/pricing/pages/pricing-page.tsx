// src/features/pricing/pages/pricing-page.tsx
// ✅ Section منفصلة ومرتبة بوضوح
// ✅ Hero → TrustStrip → Plans → Divider → FeatureTable → FAQ → BottomCTA
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { PricingHero } from '../components/pricing-hero';
import { PricingPlansSection } from '../components/pricing-plans-section';
import { FeatureTable } from '../components/feature-table';
import { PricingFaq } from '../components/pricing-faq';
import { PLANS } from '../data/plans.data';
import { usePlans, useMySubscription, useCheckout } from '../hooks/use-pricing';
import type { BillingCycle } from '../types/pricing.types';

const TRUST_KEYS = [
  'pricing.trust.noContract',
  'pricing.trust.cancelAnytime',
  'pricing.trust.securePayment',
  'pricing.trust.moneyBack',
] as const;

export default function PricingPage() {
  const { t } = useTranslation('pricing');
  const [cycle, setCycle] = useState<BillingCycle>('annual');

  const { data: plans = PLANS } = usePlans();
  const { data: sub } = useMySubscription();
  const checkout = useCheckout();

  return (
    <MainLayout>
      {/* 1 ── HERO (dark, MatrixRain, billing toggle inside) */}
      <PricingHero cycle={cycle} onCycle={setCycle} />

      {/* 2 ── TRUST STRIP */}
      <div className='border-y border-border/40 bg-muted/20 py-4'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-wrap items-center justify-center gap-x-8 gap-y-2'>
            {TRUST_KEYS.map((k) => (
              <span
                key={k}
                className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Shield className='h-3.5 w-3.5 text-emerald-500' />
                {t(k)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3 ── PLAN CARDS (separated from hero) */}
      <PricingPlansSection
        cycle={cycle}
        currentPlan={sub?.planId}
        plans={plans}
      />

      {/* 4 ── FEATURE TABLE (2 rows visible + expand) */}
      <div className='border-t border-border/30 bg-muted/5'>
        <FeatureTable />
      </div>

      {/* 5 ── FAQ (image + numbered accordion, nفس الـ landing design) */}
      <div className='border-t border-border/30'>
        <PricingFaq />
      </div>

      {/* 6 ── BOTTOM CTA */}
      <section className='border-t border-border/30 bg-muted/10 py-16'>
        <div className='container mx-auto px-4 text-center'>
          <p className='mb-1 text-xs font-bold uppercase tracking-widest text-primary'>
            {t('pricing.cta.eyebrow')}
          </p>
          <h2 className='mb-3 text-3xl font-black tracking-tight'>
            {t('pricing.cta.title')}
          </h2>
          <p className='mb-7 text-muted-foreground'>{t('pricing.cta.desc')}</p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Button
              size='lg'
              className='gap-2 px-8 font-bold'
              disabled={checkout.isPending}
              onClick={() => checkout.mutate({ planId: 'pro', cycle })}>
              <Zap className='h-4 w-4' />
              {t('pricing.cta.upgradeCta')}
            </Button>
            <Button variant='outline' size='lg' className='px-8' asChild>
              <a href='/auth'>{t('pricing.cta.freeCta')}</a>
            </Button>
          </div>
          <p className='mt-4 text-xs text-muted-foreground'>
            {t('pricing.trust.inline')}
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
