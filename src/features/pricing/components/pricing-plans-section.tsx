import { useTranslation } from 'react-i18next';
import { PlanCard } from './plan-card';
import { PLANS } from '../data/plans.data';
import type { BillingCycle, PlanId } from '../types/pricing.types';

interface PricingPlansSectionProps {
  cycle: BillingCycle;
  currentPlan?: PlanId;
  plans?: typeof PLANS;
}

export function PricingPlansSection({
  cycle,
  currentPlan,
  plans = PLANS,
}: PricingPlansSectionProps) {
  const { t } = useTranslation('pricing');

  return (
    <section className='bg-background py-14'>
      <div className='container mx-auto px-4'>
        {/* Section label */}
        <div className='mb-8 text-center'>
          <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
            {t('pricing.plansLabel')}
          </p>
        </div>

        {/* 3-column grid */}
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              cycle={cycle}
              currentPlan={currentPlan}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
