// src/features/pricing/pages/pricing-page.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { PricingHero } from '../components/pricing-hero';
import { PlanCard } from '../components/plan-card';
import { FeatureTable } from '../components/feature-table';
import { PricingFaq } from '../components/pricing-faq';
import { SectionHeader } from '@/shared/components/common/section-header';
import { PLANS } from '../data/plans.data';
import { usePlans, useMySubscription, useCheckout } from '../hooks/use-pricing';
import type { BillingCycle } from '../types/pricing.types';

// ── BillingToggle (standalone, above cards) ───────────────────────────
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
      <PricingHero />

      <section className='border-t border-border/30 bg-muted/5 py-14'>
        <div className='container mx-auto px-4'>
          <SectionHeader
            title={t('pricing.plansTitle')}
            subtitle={t('pricing.plansLabel')}
          />
          <div className='mb-8 flex justify-center'>
            <BillingToggle cycle={cycle} onCycle={setCycle} />
          </div>
          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
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

      {/* ⑤ BOTTOM CTA */}
      <section className='border-t border-border/30 py-20'>
        <div className='container mx-auto max-w-2xl px-4 text-center'>
          <p className='mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary'>
            {t('pricing.cta.eyebrow')}
          </p>
          <h2 className='mb-3 text-3xl font-black tracking-tight sm:text-4xl'>
            {t('pricing.cta.title')}
          </h2>
          <p className='mb-8 text-muted-foreground'>{t('pricing.cta.desc')}</p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Button
              size='lg'
              className='gap-2 px-8 font-bold shadow-lg shadow-primary/20'
              disabled={checkout.isPending}
              onClick={() => checkout.mutate({ planId: 'pro', cycle })}>
              <Zap className='h-4 w-4' />
              {t('pricing.cta.upgradeCta')}
            </Button>
            <Button variant='outline' size='lg' className='px-8' asChild>
              <a href='/auth'>{t('pricing.cta.freeCta')}</a>
            </Button>
          </div>
          <p className='mt-5 text-xs text-muted-foreground/60'>
            {t('pricing.trust.inline')}
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
