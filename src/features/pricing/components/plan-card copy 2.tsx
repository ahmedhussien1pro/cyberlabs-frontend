// src/features/pricing/components/plan-card.tsx
// Style: pricing-06 → icon top-right circle, CTA before features, "For X:" label
import { motion } from 'framer-motion';
import { Check, Clock3, ArrowRight, Shield, Star, Crown, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCheckout } from '../hooks/use-pricing';
import type { Plan, BillingCycle, PlanId } from '../types/pricing.types';

// ── Per-plan visual tokens ────────────────────────────────────────────
const CFG: Record<
  PlanId,
  {
    card: string;
    glow: string;
    nameColor: string;
    priceColor: string;
    checkColor: string;
    iconBg: string;
    divider: string;
    btnVariant: 'outline' | 'default';
    btnClass: string;
  }
> = {
  free: {
    card: 'border-border/40 bg-card',
    glow: '',
    nameColor: 'text-muted-foreground',
    priceColor: 'text-foreground',
    checkColor: 'text-muted-foreground',
    iconBg: 'bg-muted/40 text-muted-foreground',
    divider: 'bg-border/40',
    btnVariant: 'outline' as const,
    btnClass: '',
  },
  pro: {
    card: [
      'border-primary/55',
      'bg-gradient-to-b from-primary/[0.10] via-card to-card',
      'shadow-2xl shadow-primary/15',
      'ring-1 ring-primary/20',
    ].join(' '),
    glow: 'before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:blur-xl before:bg-primary/8',
    nameColor: 'text-primary',
    priceColor: 'text-primary',
    checkColor: 'text-primary',
    iconBg: 'bg-primary/15 text-primary',
    divider: 'bg-primary/20',
    btnVariant: 'default' as const,
    btnClass:
      'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-black',
  },
  team: {
    card: 'border-violet-500/30 bg-card opacity-85',
    glow: '',
    nameColor: 'text-violet-400',
    priceColor: 'text-violet-400',
    checkColor: 'text-violet-400',
    iconBg: 'bg-violet-500/15 text-violet-400',
    divider: 'bg-violet-500/20',
    btnVariant: 'outline' as const,
    btnClass: 'border-violet-500/35 text-violet-400 hover:bg-violet-500/10',
  },
  enterprise: {
    card: 'border-cyan-500/30 bg-card opacity-85',
    glow: '',
    nameColor: 'text-cyan-400',
    priceColor: 'text-cyan-400',
    checkColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    divider: 'bg-cyan-500/20',
    btnVariant: 'outline' as const,
    btnClass: 'border-cyan-500/35 text-cyan-400 hover:bg-cyan-500/10',
  }
};

const PLAN_ICON = { free: Shield, pro: Star, team: Crown, enterprise: Building2 };

interface PlanCardProps {
  plan: Plan;
  cycle: BillingCycle;
  currentPlan?: PlanId;
  index: number;
}

export function PlanCard({ plan, cycle, currentPlan, index }: PlanCardProps) {
  const { t } = useTranslation('pricing');
  const checkout = useCheckout();
  const c = CFG[plan.id];
  const Icon = PLAN_ICON[plan.id];

  const price = cycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const savePct =
    plan.monthlyPrice > 0
      ? Math.round((1 - plan.annualPrice / plan.monthlyPrice) * 100)
      : 0;
  const isCurrent = currentPlan === plan.id;
  const isPopular = !!plan.badge && !plan.comingSoon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.1,
        ease: [0.22, 0.68, 0, 1.2],
      }}
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 transition-all duration-300',
        c.card,
        c.glow,
        plan.id === 'pro' && 'hover:-translate-y-1.5',
      )}>
      {/* ── Popular pill ──────────────────────────────── */}
      {isPopular && (
        <div className='absolute -top-3.5 left-1/2 z-10 -translate-x-1/2'>
          <span className='inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-black text-primary-foreground shadow-lg shadow-primary/35'>
            <span className='relative flex h-1.5 w-1.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60' />
              <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-white' />
            </span>
            {t(plan.badge!)}
          </span>
        </div>
      )}

      {/* ── Coming Soon pill ──────────────────────────── */}
      {plan.comingSoon && (
        <div className='absolute -top-3.5 left-1/2 z-10 -translate-x-1/2'>
          <span className='inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold text-muted-foreground'>
            <Clock3 className='h-2.5 w-2.5' />
            {t('pricing.comingSoon')}
          </span>
        </div>
      )}

      {/* ── Header: name left / icon circle right ─────── */}
      <div className='mb-5 flex items-start justify-between gap-3'>
        <div>
          <p
            className={cn(
              'text-xs font-black uppercase tracking-widest',
              c.nameColor,
            )}>
            {t(plan.nameKey)}
          </p>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            {t(plan.descKey)}
          </p>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
            c.iconBg,
          )}>
          <Icon className='h-5 w-5' />
        </div>
      </div>

      {/* ── Price ─────────────────────────────────────── */}
      <div className='mb-1 flex items-end gap-1.5'>
        <span
          className={cn(
            'text-5xl font-black leading-none tracking-tighter',
            c.priceColor,
          )}>
          ${price}
        </span>
        <div className='mb-1.5 flex flex-col items-start gap-0.5'>
          <span className='text-xs text-muted-foreground'>
            /{t('pricing.perMonth')}
          </span>
          {cycle === 'annual' && savePct > 0 && (
            <span className='rounded-full bg-emerald-500/15 px-2 py-px text-[10px] font-bold text-emerald-500'>
              −{savePct}%
            </span>
          )}
        </div>
      </div>

      {/* Billed annually note — placeholder keeps layout stable */}
      <p className='mb-5 min-h-[16px] text-[11px] text-muted-foreground/60'>
        {cycle === 'annual' && plan.annualPrice > 0
          ? t('pricing.billedAnnually', { total: plan.annualPrice * 12 })
          : ''}
      </p>

      {/* ── CTA (pricing-06: BEFORE features) ─────────── */}
      {plan.comingSoon ? (
        <div className='mb-5 flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/20 py-2.5 text-sm font-semibold text-muted-foreground'>
          <Clock3 className='h-4 w-4' />
          {t('pricing.notifyMe')}
        </div>
      ) : isCurrent ? (
        <div className='mb-5 flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/20 py-2.5 text-sm font-semibold text-muted-foreground'>
          <Check className='h-4 w-4' />
          {t('pricing.currentPlan')}
        </div>
      ) : plan.id === 'free' ? (
        <Button variant='outline' className='mb-5 w-full font-semibold' asChild>
          <a href='/auth'>{t(plan.ctaKey)}</a>
        </Button>
      ) : (
        <Button
          variant={c.btnVariant}
          className={cn('mb-5 w-full gap-2 font-bold', c.btnClass)}
          disabled={checkout.isPending}
          onClick={() => checkout.mutate({ planId: plan.id, cycle })}>
          {t(plan.ctaKey)}
          <ArrowRight className='h-4 w-4' />
        </Button>
      )}

      {/* ── Divider ───────────────────────────────────── */}
      <div className={cn('mb-4 h-px w-full', c.divider)} />

      {/* ── "For X:" label ────────────────────────────── */}
      <p className='mb-3 text-sm font-bold text-foreground/80'>
        {t(plan.descKey)}:
      </p>

      {/* ── Features ──────────────────────────────────── */}
      <ul className='flex-1 space-y-2.5'>
        {plan.highlights.map((hKey) => (
          <li key={hKey} className='flex items-start gap-2.5 text-sm'>
            <Check className={cn('mt-0.5 h-4 w-4 shrink-0', c.checkColor)} />
            <span className='leading-snug text-foreground/75'>{t(hKey)}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
