// src/features/pricing/pages/pricing-page.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Users, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { PricingHero } from '../components/pricing-hero';
import { PricingPlansSection } from '../components/pricing-plans-section';
import { PlanCard } from '../components/plan-card';
import { FeatureTable } from '../components/feature-table';
import { PricingFaq } from '../components/pricing-faq';
import { PLANS } from '../data/plans.data';
import { usePlans, useMySubscription, useCheckout } from '../hooks/use-pricing';
import type { BillingCycle } from '../types/pricing.types';

// ── Trust strip items ─────────────────────────────────────────────────
const TRUST = [
  'pricing.trust.noContract',
  'pricing.trust.cancelAnytime',
  'pricing.trust.securePayment',
  'pricing.trust.moneyBack',
] as const;

// ── Social proof logos (text-based, no images needed) ─────────────────
const STAT_ITEMS = [
  {
    icon: Users,
    valueKey: 'pricing.stats.users',
    labelKey: 'pricing.stats.usersLabel',
  },
  {
    icon: BookOpen,
    valueKey: 'pricing.stats.labs',
    labelKey: 'pricing.stats.labsLabel',
  },
  {
    icon: Award,
    valueKey: 'pricing.stats.certs',
    labelKey: 'pricing.stats.certsLabel',
  },
  {
    icon: Shield,
    valueKey: 'pricing.stats.uptime',
    labelKey: 'pricing.stats.uptimeLabel',
  },
] as const;

export default function PricingPage() {
  const { t } = useTranslation('pricing');
  const [cycle, setCycle] = useState<BillingCycle>('annual');

  const { data: plans = PLANS } = usePlans();
  const { data: sub } = useMySubscription();
  const checkout = useCheckout();

  return (
    <MainLayout>
      {/* ① HERO */}
      <PricingHero cycle={cycle} onCycle={setCycle} />

      {/* ② TRUST STRIP */}
      <div className='border-y border-border/40 bg-muted/20 py-3.5'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-wrap items-center justify-center gap-x-7 gap-y-2'>
            {TRUST.map((k) => (
              <span
                key={k}
                className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Shield className='h-3 w-3 text-emerald-500' />
                {t(k)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ③ SOCIAL PROOF STATS */}
      <div className='bg-background py-10'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {STAT_ITEMS.map(({ icon: Icon, valueKey, labelKey }) => (
              <div
                key={valueKey}
                className='flex flex-col items-center gap-1.5 rounded-2xl border border-border/30 bg-muted/10 py-5 text-center'>
                <Icon className='h-5 w-5 text-primary' />
                <p className='text-2xl font-black text-foreground'>
                  {t(valueKey)}
                </p>
                <p className='text-xs text-muted-foreground'>{t(labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ④ PLAN CARDS */}
      <div className='border-t border-border/30 bg-muted/5 py-14'>
        <div className='container mx-auto px-4'>
          <div className='mb-8 text-center'>
            <p className='text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground'>
              {t('pricing.plansLabel')}
            </p>
            <h2 className='mt-2 text-2xl font-black tracking-tight sm:text-3xl'>
              {t('pricing.plansTitle')}
            </h2>
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
      </div>

      {/* ⑤ FEATURE TABLE */}
      <div className='border-t border-border/30'>
        <FeatureTable />
      </div>

      {/* ⑥ FAQ */}
      <div className='border-t border-border/30'>
        <PricingFaq />
      </div>

      {/* ⑦ BOTTOM CTA */}
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
