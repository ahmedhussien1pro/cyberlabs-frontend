import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Zap, Shield, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { MatrixRain } from '@/shared/components/common/landing/matrix-rain';
import { PlanCard } from '../components/plan-card';
import { PLANS, FEATURE_ROWS } from '../data/plans.data';
import { usePlans, useMySubscription } from '../hooks/use-pricing';
import type { BillingCycle } from '../types/pricing.types';

// ── Trust items ──────────────────────────────────────────────────────
const TRUST_KEYS = [
  'pricing.trust.noContract',
  'pricing.trust.cancelAnytime',
  'pricing.trust.securePayment',
  'pricing.trust.moneyBack',
] as const;

export default function PricingPage() {
  const { t } = useTranslation('pricing');
  const [cycle, setCycle] = useState<BillingCycle>('annual');
  const [showTable, setShowTable] = useState(false);

  const { data: plans = PLANS } = usePlans();
  const { data: sub } = useMySubscription();

  return (
    <MainLayout>
      {/* ══════════════════════════════════════════════════════════
          HERO — dark always (MatrixRain bg)
      ══════════════════════════════════════════════════════════ */}
      <section className='relative overflow-hidden bg-zinc-950'>
        <MatrixRain opacity={0.06} speed={7} />

        <div className='container relative z-[2] mx-auto px-4 pt-20 pb-8 text-center'>
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-5 inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400'>
            <Zap className='h-3 w-3' />
            {t('pricing.eyebrow')}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className='text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl'>
            {t('pricing.heroTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className='mx-auto mt-4 max-w-lg text-base text-white/55'>
            {t('pricing.heroDesc')}
          </motion.p>

          {/* ── Billing toggle ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className='mt-8 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1'>
            {(['monthly', 'annual'] as BillingCycle[]).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={cn(
                  'relative rounded-full px-5 py-2 text-xs font-bold transition-all duration-200',
                  cycle === c
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-white/50 hover:text-white/80',
                )}>
                {t(`pricing.cycle.${c}`)}
                {c === 'annual' && (
                  <span
                    className={cn(
                      'ms-1.5 rounded-full px-1.5 py-px text-[9px] font-black transition-colors',
                      cycle === 'annual'
                        ? 'bg-emerald-400/30 text-emerald-300'
                        : 'bg-white/10 text-white/40',
                    )}>
                    -35%
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── Plan cards — overlap hero bottom ──────────────────── */}
        <div className='container relative z-[2] mx-auto px-4 pb-16'>
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

      {/* ══════════════════════════════════════════════════════════
          TRUST STRIP — theme-aware
      ══════════════════════════════════════════════════════════ */}
      <section className='border-y border-border/40 bg-muted/20 py-5'>
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
      </section>

      {/* ══════════════════════════════════════════════════════════
          COMPARE TABLE — theme-aware, collapsible
      ══════════════════════════════════════════════════════════ */}
      <section className='container mx-auto px-4 py-14'>
        {/* Section header */}
        <div className='mb-8 flex flex-col items-center gap-3 text-center'>
          <h2 className='text-2xl font-black tracking-tight sm:text-3xl'>
            {t('pricing.compareTitle')}
          </h2>
          <p className='max-w-md text-sm text-muted-foreground'>
            {t('pricing.compareDesc')}
          </p>

          {/* Toggle button */}
          <button
            onClick={() => setShowTable((v) => !v)}
            className='mt-1 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/40 px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground'>
            {showTable ? (
              <>
                <ChevronUp className='h-3.5 w-3.5' />
                {t('pricing.hideTable')}
              </>
            ) : (
              <>
                <ChevronDown className='h-3.5 w-3.5' />
                {t('pricing.showTable')}
              </>
            )}
          </button>
        </div>

        {showTable && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className='overflow-x-auto rounded-2xl border border-border/50'>
            <table className='w-full min-w-[480px] text-sm'>
              <thead>
                <tr className='border-b border-border/50 bg-muted/30'>
                  <th className='px-5 py-3.5 text-start text-[11px] font-bold uppercase tracking-widest text-muted-foreground w-[45%]'>
                    {t('pricing.table.header')}
                  </th>
                  <th className='px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground'>
                    {t('pricing.plans.free.name')}
                  </th>
                  <th className='px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-widest text-blue-500'>
                    {t('pricing.plans.pro.name')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row, i) => (
                  <tr
                    key={row.key}
                    className={cn(
                      'border-b border-border/30 transition-colors hover:bg-muted/20',
                      i % 2 === 0 && 'bg-muted/5',
                    )}>
                    <td
                      className={cn(
                        'px-5 py-3 text-sm',
                        row.highlight
                          ? 'font-semibold text-foreground'
                          : 'text-muted-foreground',
                      )}>
                      {t(row.key)}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <TableCell value={row.free} />
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <TableCell value={row.pro} isHighlight />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════
          FAQ STRIP — minimal
      ══════════════════════════════════════════════════════════ */}
      <section className='border-t border-border/40 bg-muted/10 py-14'>
        <div className='container mx-auto px-4 max-w-2xl'>
          <h3 className='mb-6 text-center text-xl font-black'>
            {t('pricing.faq.title')}
          </h3>
          <div className='space-y-4'>
            {(['q1', 'q2', 'q3'] as const).map((k) => (
              <FaqItem
                key={k}
                q={t(`pricing.faq.${k}.q`)}
                a={t(`pricing.faq.${k}.a`)}
              />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

// ── File-private helpers ──────────────────────────────────────────────

function TableCell({
  value,
  isHighlight,
}: {
  value: boolean | string;
  isHighlight?: boolean;
}) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className='mx-auto h-4 w-4 text-emerald-500' />
    ) : (
      <X className='mx-auto h-4 w-4 text-border/60' />
    );
  }
  return (
    <span
      className={cn(
        'text-xs font-semibold',
        isHighlight ? 'text-blue-500' : 'text-muted-foreground',
      )}>
      {value}
    </span>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className='rounded-xl border border-border/40 bg-card overflow-hidden'>
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex w-full items-center justify-between px-5 py-3.5 text-start text-sm font-semibold text-foreground hover:bg-muted/20 transition-colors'>
        {q}
        {open ? (
          <ChevronUp className='h-4 w-4 shrink-0 text-muted-foreground' />
        ) : (
          <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground' />
        )}
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='border-t border-border/30 px-5 py-3 text-sm text-muted-foreground leading-relaxed'>
          {a}
        </motion.div>
      )}
    </div>
  );
}
