import { motion } from 'framer-motion';
import { Check, Clock3, ArrowRight, Shield, Star, Crown, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCheckout } from '../hooks/use-pricing';
import type { Plan, BillingCycle, PlanId } from '../types/pricing.types';

// ── Visual config per plan ────────────────────────────────────────────
const CFG: Record<
  PlanId,
  {
    card: string;
    glow: string;
    badge: string;
    nameColor: string;
    priceColor: string;
    checkBg: string;
    checkIcon: string;
    divider: string;
    btnVariant: 'outline' | 'default';
    btnClass: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  free: {
    card: 'border-border/40 bg-card',
    glow: '',
    badge: '',
    nameColor: 'text-muted-foreground',
    priceColor: 'text-foreground',
    checkBg: 'bg-muted/60',
    checkIcon: 'text-muted-foreground',
    divider: 'bg-border/40',
    btnVariant: 'outline' as const,
    btnClass: '',
    iconBg: 'bg-muted/60',
    iconColor: 'text-muted-foreground',
  },
  pro: {
    card: [
      'border-primary/60',
      'bg-gradient-to-b from-primary/[0.11] via-card to-card',
      'shadow-2xl shadow-primary/20',
      'ring-1 ring-primary/25',
    ].join(' '),
    // Animated glow via CSS pseudo — implemented via wrapper div
    glow: 'after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:bg-primary/8 after:blur-2xl',
    badge: 'bg-primary text-primary-foreground shadow-lg shadow-primary/40',
    nameColor: 'text-primary',
    priceColor: 'text-primary',
    checkBg: 'bg-primary/15',
    checkIcon: 'text-primary',
    divider: 'bg-primary/20',
    btnVariant: 'default' as const,
    btnClass:
      'bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 font-black text-base',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
  },
  team: {
    card: 'border-violet-500/30 bg-card opacity-85',
    glow: '',
    badge: 'bg-muted text-muted-foreground',
    nameColor: 'text-violet-400',
    priceColor: 'text-violet-400',
    checkBg: 'bg-violet-500/15',
    checkIcon: 'text-violet-400',
    divider: 'bg-violet-500/20',
    btnVariant: 'outline' as const,
    btnClass: 'border-violet-500/35 text-violet-400 hover:bg-violet-500/10',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
  },
  enterprise: {
    card: 'border-cyan-500/30 bg-card opacity-85',
    glow: '',
    badge: 'bg-muted text-muted-foreground',
    nameColor: 'text-cyan-400',
    priceColor: 'text-cyan-400',
    checkBg: 'bg-cyan-500/15',
    checkIcon: 'text-cyan-400',
    divider: 'bg-cyan-500/20',
    btnVariant: 'outline' as const,
    btnClass: 'border-cyan-500/35 text-cyan-400 hover:bg-cyan-500/10',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
  }
};

const PLAN_ICON = {
  free: Shield,
  pro: Star,
  team: Crown,
  enterprise: Building2
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
  const Icon = PLAN_ICON[plan.id];

  const price = cycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const savePct =
    plan.monthlyPrice > 0
      ? Math.round((1 - plan.annualPrice / plan.monthlyPrice) * 100)
      : 0;
  const isCurrent = currentPlan === plan.id;
  const isPopular = !!plan.badge && !plan.comingSoon;
  const isPro = plan.id === 'pro';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.48,
        delay: index * 0.1,
        ease: [0.22, 0.68, 0, 1.2],
      }}
      className={cn(
        'relative flex flex-col rounded-2xl border p-0 transition-all duration-300',
        c.card,
        c.glow,
        isPro && 'hover:-translate-y-2 hover:shadow-3xl',
        !isPro && 'hover:-translate-y-0.5',
      )}>
      {/* ── Gradient mesh overlay (Pro only) ─────────────────── */}
      {isPro && (
        <div
          className='pointer-events-none absolute inset-0 rounded-2xl opacity-50'
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, hsl(var(--primary)/0.18) 0%, transparent 65%)',
          }}
        />
      )}

      {/* ── Popular pill ──────────────────────────────────────── */}
      {isPopular && (
        <div className='absolute -top-4 left-1/2 z-10 -translate-x-1/2'>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-black',
              c.badge,
            )}>
            {/* Pulse dot */}
            <span className='relative flex h-1.5 w-1.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60' />
              <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-white' />
            </span>
            {t(plan.badge!)}
          </span>
        </div>
      )}

      {/* ── Coming Soon pill ──────────────────────────────────── */}
      {plan.comingSoon && (
        <div className='absolute -top-4 left-1/2 z-10 -translate-x-1/2'>
          <span className='inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground'>
            <Clock3 className='h-3 w-3' />
            {t('pricing.comingSoon')}
          </span>
        </div>
      )}

      {/* ── Card body ─────────────────────────────────────────── */}
      <div className='flex flex-1 flex-col p-6'>
        {/* Header row */}
        <div className='mb-5 flex items-center gap-3'>
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              c.iconBg,
              c.iconColor,
            )}>
            <Icon className='h-5 w-5' />
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

        {/* Price block */}
        <div className='mb-1 flex items-end gap-2'>
          <span
            className={cn(
              'text-5xl font-black leading-none tracking-tighter',
              c.priceColor,
            )}>
            ${price}
          </span>
          <div className='mb-1 flex flex-col gap-0.5 pb-0.5'>
            <span className='text-xs text-muted-foreground'>
              / {t('pricing.perMonth')}
            </span>
            {cycle === 'annual' && savePct > 0 && (
              <span className='rounded-full bg-emerald-500/15 px-2 py-px text-[10px] font-bold text-emerald-500'>
                −{savePct}%
              </span>
            )}
          </div>
        </div>

        {/* Billed annually note */}
        {cycle === 'annual' && plan.annualPrice > 0 && (
          <p className='mb-5 text-[11px] text-muted-foreground/60'>
            {t('pricing.billedAnnually', { total: plan.annualPrice * 12 })}
          </p>
        )}
        {plan.annualPrice === 0 && <div className='mb-5' />}

        {/* Divider */}
        <div className={cn('mb-5 h-px w-full', c.divider)} />

        {/* Features list */}
        <ul className='mb-6 flex-1 space-y-2.5'>
          {plan.highlights.map((hKey) => (
            <li key={hKey} className='flex items-start gap-2.5 text-sm'>
              <span
                className={cn(
                  'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full',
                  c.checkBg,
                )}>
                <Check className={cn('h-2.5 w-2.5', c.checkIcon)} />
              </span>
              <span className='leading-snug text-foreground/75'>{t(hKey)}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {plan.comingSoon ? (
          <div className='flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/20 py-3 text-sm font-semibold text-muted-foreground'>
            <Clock3 className='h-4 w-4' />
            {t('pricing.notifyMe')}
          </div>
        ) : isCurrent ? (
          <div className='flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/20 py-3 text-sm font-semibold text-muted-foreground'>
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
            className={cn('w-full gap-2', c.btnClass)}
            disabled={checkout.isPending}
            onClick={() => checkout.mutate({ planId: plan.id, cycle })}>
            {t(plan.ctaKey)}
            <ArrowRight className='h-4 w-4' />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
