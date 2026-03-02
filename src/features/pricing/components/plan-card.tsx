import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Clock3,
  ArrowRight,
  Shield,
  Star,
  Crown,
  Group,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/shared/components/common/section-header';
import { useCheckout } from '../hooks/use-pricing';
import type { Plan, BillingCycle, PlanId } from '../types/pricing.types';

// ── Right panel visual tokens ─────────────────────────────────────────
const PANEL_CFG = {
  free: {
    panel: 'bg-muted/20 border-border/40',
    accent: 'text-foreground',
    iconBg: 'bg-muted/50 text-muted-foreground',
    check: 'text-muted-foreground',
    btn: 'outline' as const,
    btnCls: '',
  },
  pro: {
    panel: 'bg-primary/8 border-primary/35',
    accent: 'text-primary',
    iconBg: 'bg-primary/15 text-primary',
    check: 'text-primary',
    btn: 'default' as const,
    btnCls:
      'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-black',
  },
  team: {
    panel: 'bg-violet-500/8 border-violet-500/25',
    accent: 'text-violet-400',
    iconBg: 'bg-violet-500/15 text-violet-400',
    check: 'text-violet-400',
    btn: 'outline' as const,
    btnCls: 'border-violet-500/35 text-violet-400 hover:bg-violet-500/10',
  },
  enterprise: {
    panel: 'bg-cyan-500/8 border-cyan-500/25',
    accent: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    check: 'text-cyan-400',
    btn: 'outline' as const,
    btnCls: 'border-cyan-500/35 text-cyan-400 hover:bg-cyan-500/10',
  },
} satisfies Record<
  string,
  {
    panel: string;
    accent: string;
    iconBg: string;
    check: string;
    btn: 'outline' | 'default';
    btnCls: string;
  }
>;

const PLAN_ICON = { free: Shield, pro: Star, team: Crown, enterprise: Group };

interface Props {
  plans: Plan[];
  cycle: BillingCycle;
  onCycle: (c: BillingCycle) => void;
  currentPlan?: PlanId;
}

// ── Local BillingToggle ───────────────────────────────────────────────
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
                  ? 'bg-emerald-400/80 text-emerald-700 dark:text-emerald-700 dark:bg-emerald-300/80'
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

// ── Main component ────────────────────────────────────────────────────
export function PricingPlansSectionV07({
  plans,
  cycle,
  onCycle,
  currentPlan,
}: Props) {
  const { t } = useTranslation('pricing');
  const checkout = useCheckout();
  const [selectedId, setSelectedId] = useState<string>('pro');

  const selected = plans.find((p) => p.id === selectedId) ?? plans[0];
  const pc = PANEL_CFG[selected.id];
  const Icon = PLAN_ICON[selected.id];
  const price =
    cycle === 'annual' ? selected.annualPrice : selected.monthlyPrice;
  const savePct =
    selected.monthlyPrice > 0
      ? Math.round((1 - selected.annualPrice / selected.monthlyPrice) * 100)
      : 0;
  const isCurrent = currentPlan === selected.id;

  return (
    <section className='border-t border-border/30  overflow-hidden py-6 md:py-10'>
      <div className='container mx-auto px-4 '>
        <SectionHeader
          title={t('pricing.plansTitle')}
          subtitle={t('pricing.plansLabel')}
          className='pb-0'
        />

        {/* BillingToggle */}
        <div className='mb-8 flex justify-center'>
          <BillingToggle cycle={cycle} onCycle={onCycle} />
        </div>

        {/* ── Split card ─────────────────────────────────────────── */}
        <div className=' mx-auto overflow-hidden rounded-2xl border border-border/40'>
          <div className='grid gap-4 grid-cols-1 md:grid-cols-[1fr_1.5fr] '>
            {/* LEFT: Plan list */}
            <div className='border-b border-border/40 md:border-b-0 md:border-e md:border-border/40'>
              <RadioGroup
                value={selectedId}
                onValueChange={setSelectedId}
                className='divide-y divide-border/30'>
                {plans.map((plan) => {
                  const PlanIcon = PLAN_ICON[plan.id];
                  const planPrice =
                    cycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
                  const isActive = selectedId === plan.id;

                  return (
                    <Label
                      key={plan.id}
                      htmlFor={`plan-${plan.id}`}
                      className={cn(
                        'flex cursor-pointer items-center justify-between gap-4 px-5 py-4 transition-colors duration-200',
                        isActive ? 'bg-primary/6' : 'hover:bg-muted/25',
                      )}>
                      <div className='flex items-center gap-3'>
                        <RadioGroupItem
                          value={plan.id}
                          id={`plan-${plan.id}`}
                          className={cn(
                            isActive && 'border-primary text-primary',
                          )}
                        />
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                            isActive
                              ? plan.id === 'pro'
                                ? 'bg-primary/15 text-primary'
                                : plan.id === 'team'
                                  ? 'bg-violet-500/15 text-violet-400'
                                  : plan.id === 'enterprise'
                                    ? 'bg-cyan-500/15 text-cyan-400'
                                    : 'bg-muted/50 text-muted-foreground'
                              : 'bg-muted/40 text-muted-foreground',
                          )}>
                          <PlanIcon className='h-3.5 w-3.5' />
                        </div>
                        <div>
                          <p className='text-sm font-bold text-foreground'>
                            {t(plan.nameKey)}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {t(plan.descKey)}
                          </p>
                        </div>
                      </div>

                      <div className='text-end'>
                        <p className='text-sm font-black text-foreground'>
                          {plan.id !== 'free' && planPrice === 0
                            ? '—'
                            : `$${planPrice}`}
                          <span className='text-[10px] font-normal text-muted-foreground'>
                            /{t('pricing.perMonth')}
                          </span>
                        </p>
                        {plan.comingSoon && (
                          <p className='text-[10px] text-muted-foreground'>
                            {t('pricing.comingSoon')}
                          </p>
                        )}
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            {/* RIGHT: Active plan detail panel */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className={cn('flex flex-col border p-7', pc.panel)}>
                {/* Plan header */}
                <div className='mb-4 flex items-start justify-between gap-3'>
                  <div>
                    <p className={cn('text-xl font-black', pc.accent)}>
                      {t(selected.nameKey)}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {t(selected.descKey)}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
                      pc.iconBg,
                    )}>
                    <Icon className='h-5 w-5' />
                  </div>
                </div>

                {/* Price */}
                <div className='mb-1 flex items-end gap-1.5'>
                  <span
                    className={cn(
                      'text-4xl font-black leading-none tracking-tighter',
                      pc.accent,
                    )}>
                    ${price}
                  </span>
                  <span className='mb-1 text-xs text-muted-foreground'>
                    /{t('pricing.perMonth')}
                  </span>
                  {cycle === 'annual' && savePct > 0 && (
                    <span className='mb-1 rounded-full bg-emerald-500/15 px-2 py-px text-[10px] font-bold text-emerald-500'>
                      −{savePct}%
                    </span>
                  )}
                </div>

                {/* Billed note */}
                <p className='mb-5 min-h-[16px] text-[11px] text-muted-foreground/60'>
                  {cycle === 'annual' && selected.annualPrice > 0
                    ? t('pricing.billedAnnually', {
                        total: selected.annualPrice * 12,
                      })
                    : ''}
                </p>

                {/* Features */}
                <ul className='mb-6 flex-1 space-y-2.5'>
                  {selected.highlights.map((hKey) => (
                    <li key={hKey} className='flex items-start gap-2.5 text-sm'>
                      <Check
                        className={cn('mt-0.5 h-4 w-4 shrink-0', pc.check)}
                      />
                      <span className='leading-snug text-foreground/75'>
                        {t(hKey)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {selected.comingSoon ? (
                  <div className='flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/20 py-3 text-sm font-semibold text-muted-foreground'>
                    <Clock3 className='h-4 w-4' />
                    {t('pricing.notifyMe')}
                  </div>
                ) : isCurrent ? (
                  <div className='flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/20 py-3 text-sm font-semibold text-muted-foreground'>
                    <Check className='h-4 w-4' />
                    {t('pricing.currentPlan')}
                  </div>
                ) : selected.id === 'free' ? (
                  <Button
                    variant='outline'
                    className='w-full font-semibold'
                    asChild>
                    <a href='/auth'>{t(selected.ctaKey)}</a>
                  </Button>
                ) : (
                  <Button
                    variant={pc.btn}
                    className={cn('w-full gap-2 font-bold', pc.btnCls)}
                    disabled={checkout.isPending}
                    onClick={() =>
                      checkout.mutate({ planId: selected.id, cycle })
                    }>
                    {t(selected.ctaKey)}
                    <ArrowRight className='h-4 w-4' />
                  </Button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
