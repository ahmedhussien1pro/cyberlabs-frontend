import { motion } from 'framer-motion';
import { Check, Zap, Clock3, ArrowRight, Shield, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCheckout } from '../hooks/use-pricing';
import type { Plan, BillingCycle, PlanId } from '../types/pricing.types';

// ── Visual config per plan ────────────────────────────────────────────
const CFG = {
  free: {
    // Subtle neutral card
    wrapper: 'border-border/40 bg-card',
    glow: '',
    nameColor: 'text-muted-foreground',
    priceColor: 'text-foreground',
    checkColor: 'text-muted-foreground',
    divider: 'bg-border/40',
    btnVariant: 'outline' as const,
    btnClass: '',
    iconBg: 'bg-muted/60 text-muted-foreground',
  },
  pro: {
    // Elevated blue — the star of the show
    wrapper: [
      'border-primary/50',
      'bg-gradient-to-b from-primary/[0.08] via-card to-card',
      'shadow-2xl shadow-primary/15',
      'ring-1 ring-primary/20',
    ].join(' '),
    glow: 'before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:blur-2xl before:bg-primary/10',
    nameColor: 'text-primary',
    priceColor: 'text-primary',
    checkColor: 'text-primary',
    divider: 'bg-primary/20',
    btnVariant: 'default' as const,
    btnClass: 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25',
    iconBg: 'bg-primary/15 text-primary',
  },
  team: {
    // Muted violet — coming soon, lower visual weight
    wrapper: 'border-violet-500/25 bg-card opacity-80',
    glow: '',
    nameColor: 'text-violet-400',
    priceColor: 'text-violet-400',
    checkColor: 'text-violet-400',
    divider: 'bg-violet-500/20',
    btnVariant: 'outline' as const,
    btnClass: 'border-violet-500/30 text-violet-400 hover:bg-violet-500/10',
    iconBg: 'bg-violet-500/15 text-violet-400',
  },
} satisfies Record<
  string,
  {
    wrapper: string;
    glow: string;
    nameColor: string;
    priceColor: string;
    checkColor: string;
    divider: string;
    btnVariant: 'outline' | 'default';
    btnClass: string;
    iconBg: string;
  }
>;

// ── Icons per plan ────────────────────────────────────────────────────
const PLAN_ICON = {
  free: <Shield className='h-5 w-5' />,
  pro: <Star className='h-5 w-5' />,
  team: <Zap className='h-5 w-5' />,
};

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
        c.wrapper,
        c.glow,
        // Pro card lifts on hover
        plan.id === 'pro' && 'hover:-translate-y-1',
      )}>
      {/* ── Popular pill ──────────────────────────────────────────── */}
      {isPopular && (
        <div className='absolute -top-3.5 left-1/2 -translate-x-1/2 z-10'>
          <span className='inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-black text-primary-foreground shadow-lg shadow-primary/30'>
            <Zap className='h-2.5 w-2.5' />
            {t(plan.badge!)}
          </span>
        </div>
      )}

      {/* ── Coming Soon pill ──────────────────────────────────────── */}
      {plan.comingSoon && (
        <div className='absolute -top-3.5 left-1/2 -translate-x-1/2 z-10'>
          <span className='inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold text-muted-foreground'>
            <Clock3 className='h-2.5 w-2.5' />
            {t('pricing.comingSoon')}
          </span>
        </div>
      )}

      {/* ── Header row: icon + plan name ──────────────────────────── */}
      <div className='mb-4 flex items-center gap-3'>
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl',
            c.iconBg,
          )}>
          {PLAN_ICON[plan.id]}
        </div>
        <div>
          <p
            className={cn(
              'text-xs font-black uppercase tracking-widest',
              c.nameColor,
            )}>
            {t(plan.nameKey)}
          </p>
          <p className='text-xs text-muted-foreground'>{t(plan.descKey)}</p>
        </div>
      </div>

      {/* ── Price block ───────────────────────────────────────────── */}
      <div className='mb-1 flex items-end gap-1.5'>
        <span
          className={cn(
            'text-5xl font-black leading-none tracking-tight',
            c.priceColor,
          )}>
          ${price}
        </span>
        <div className='mb-1 flex flex-col gap-0.5'>
          <span className='text-xs text-muted-foreground'>
            / {t('pricing.perMonth')}
          </span>
          {cycle === 'annual' && savePct > 0 && (
            <span className='rounded-full bg-emerald-500/15 px-1.5 py-px text-[10px] font-bold leading-none text-emerald-500'>
              −{savePct}%
            </span>
          )}
        </div>
      </div>

      {/* Annual billing note */}
      {cycle === 'annual' && plan.annualPrice > 0 && (
        <p className='mb-4 text-[11px] text-muted-foreground/70'>
          {t('pricing.billedAnnually', { total: plan.annualPrice * 12 })}
        </p>
      )}
      {plan.annualPrice === 0 && <div className='mb-4' />}

      {/* ── Thin divider ──────────────────────────────────────────── */}
      <div className={cn('mb-5 h-px', c.divider)} />

      {/* ── Features list ─────────────────────────────────────────── */}
      <ul className='mb-6 flex-1 space-y-3'>
        {plan.highlights.map((hKey) => (
          <li key={hKey} className='flex items-start gap-2.5 text-sm'>
            <span
              className={cn(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                plan.id === 'pro' ? 'bg-primary/15' : 'bg-muted/50',
              )}>
              <Check className={cn('h-2.5 w-2.5', c.checkColor)} />
            </span>
            <span className='leading-snug text-foreground/75'>{t(hKey)}</span>
          </li>
        ))}
      </ul>

      {/* ── CTA button ────────────────────────────────────────────── */}
      {plan.comingSoon ? (
        <div className='flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/20 py-2.5 text-sm font-semibold text-muted-foreground'>
          <Clock3 className='h-4 w-4' />
          {t('pricing.notifyMe')}
        </div>
      ) : isCurrent ? (
        <div className='flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/20 py-2.5 text-sm font-semibold text-muted-foreground'>
          <Check className='h-4 w-4' />
          {t('pricing.currentPlan')}
        </div>
      ) : plan.id === 'free' ? (
        <Button variant='outline' className='w-full font-semibold' asChild>
          <a href='/auth'>{t(plan.ctaKey)}</a>
        </Button>
      ) : (
        <Button
          variant={c.btnVariant}
          className={cn('w-full gap-2 font-bold', c.btnClass)}
          disabled={checkout.isPending}
          onClick={() => checkout.mutate({ planId: plan.id, cycle })}>
          {t(plan.ctaKey)}
          <ArrowRight className='h-4 w-4' />
        </Button>
      )}
    </motion.div>
  );
}
