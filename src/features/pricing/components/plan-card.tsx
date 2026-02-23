import { motion } from 'framer-motion';
import { Check, Zap, Clock3, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCheckout } from '../hooks/use-pricing';
import type { Plan, BillingCycle, PlanId } from '../types/pricing.types';

// ── Per-color tokens ─────────────────────────────────────────────────
const C = {
  zinc: {
    outer: 'border-border/50 bg-card dark:bg-card',
    name: 'text-muted-foreground',
    price: 'text-foreground',
    check: 'text-muted-foreground',
    btn: 'variant-outline' as const,
    badge: '',
  },
  blue: {
    outer:
      'border-blue-500/50 bg-card dark:bg-card shadow-2xl shadow-blue-500/10',
    name: 'text-blue-500',
    price: 'text-blue-500',
    check: 'text-blue-500',
    btn: 'variant-default' as const,
    badge: 'bg-blue-600 text-white shadow-blue-500/30',
  },
  violet: {
    outer: 'border-violet-500/30 bg-card dark:bg-card',
    name: 'text-violet-500',
    price: 'text-violet-500',
    check: 'text-violet-500',
    btn: 'variant-outline' as const,
    badge: '',
  },
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
  const c = C[plan.color];
  const price = cycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const isCurrent = currentPlan === plan.id;
  const savePct =
    plan.monthlyPrice > 0
      ? Math.round((1 - plan.annualPrice / plan.monthlyPrice) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.09 }}
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 transition-all duration-300',
        c.outer,
        plan.comingSoon && 'opacity-70',
      )}>
      {/* Popular pill */}
      {plan.badge && !plan.comingSoon && (
        <div className='absolute -top-3.5 left-1/2 -translate-x-1/2'>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1',
              'text-[11px] font-bold shadow-lg',
              c.badge,
            )}>
            <Zap className='h-2.5 w-2.5' />
            {t(plan.badge)}
          </span>
        </div>
      )}

      {/* Coming Soon pill */}
      {plan.comingSoon && (
        <div className='absolute -top-3.5 left-1/2 -translate-x-1/2'>
          <span className='inline-flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-1 text-[11px] font-bold text-muted-foreground'>
            <Clock3 className='h-2.5 w-2.5' />
            {t('pricing.comingSoon')}
          </span>
        </div>
      )}

      {/* Plan name */}
      <p
        className={cn(
          'text-[11px] font-black uppercase tracking-widest',
          c.name,
        )}>
        {t(plan.nameKey)}
      </p>
      <p className='mt-0.5 text-xs text-muted-foreground'>{t(plan.descKey)}</p>

      {/* Price */}
      <div className='my-5 flex items-end gap-1.5'>
        <span
          className={cn(
            'text-5xl font-black tracking-tight leading-none',
            c.price,
          )}>
          ${price}
        </span>
        <div className='mb-1 flex flex-col'>
          <span className='text-xs text-muted-foreground'>
            / {t('pricing.perMonth')}
          </span>
          {cycle === 'annual' && savePct > 0 && (
            <span className='rounded-full bg-emerald-500/15 px-1.5 py-px text-[10px] font-bold text-emerald-500'>
              -{savePct}%
            </span>
          )}
        </div>
      </div>

      {/* Annual note */}
      {cycle === 'annual' && plan.annualPrice > 0 && (
        <p className='mb-4 -mt-2 text-[11px] text-muted-foreground'>
          {t('pricing.billedAnnually', { total: plan.annualPrice * 12 })}
        </p>
      )}

      {/* Divider */}
      <div className='mb-4 h-px bg-border/50' />

      {/* Highlights */}
      <ul className='mb-6 flex-1 space-y-2.5'>
        {plan.highlights.map((hKey) => (
          <li key={hKey} className='flex items-start gap-2 text-sm'>
            <Check className={cn('mt-0.5 h-4 w-4 shrink-0', c.check)} />
            <span className='text-foreground/80'>{t(hKey)}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {plan.comingSoon ? (
        <div className='flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/30 py-2.5 text-sm font-semibold text-muted-foreground'>
          <Clock3 className='h-4 w-4' />
          {t('pricing.notifyMe')}
        </div>
      ) : isCurrent ? (
        <div className='flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-muted/20 py-2.5 text-sm font-semibold text-muted-foreground'>
          <Check className='h-4 w-4' />
          {t('pricing.currentPlan')}
        </div>
      ) : plan.id === 'free' ? (
        <Button variant='outline' className='w-full font-semibold' asChild>
          <a href='/auth'>{t(plan.ctaKey)}</a>
        </Button>
      ) : (
        <Button
          className={cn('w-full gap-2 font-semibold')}
          disabled={checkout.isPending}
          onClick={() => checkout.mutate({ planId: plan.id, cycle })}>
          {t(plan.ctaKey)}
          <ArrowRight className='h-4 w-4' />
        </Button>
      )}
    </motion.div>
  );
}
