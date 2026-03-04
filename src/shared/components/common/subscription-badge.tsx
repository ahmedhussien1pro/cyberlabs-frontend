// src/shared/components/common/subscription-badge.tsx
import { Zap, Crown, Building2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanId } from '@/features/pricing/types/pricing.types';
import { PLAN_BADGE_CONFIG } from '@/features/pricing/types/pricing.types';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Crown,
  Building2,
};

interface SubscriptionBadgeProps {
  planId: PlanId;
  /**
   * crown  → أيقونة فقط بلون plan + glow، توضع فوق الـ avatar (لابس تاج)
   * dot    → دائرة صغيرة جداً بـ gradient (corner usage)
   * pill   → badge كامل مع نص (billing tab, profile page)
   */
  variant?: 'crown' | 'dot' | 'pill';
  className?: string;
}

export function SubscriptionBadge({
  planId,
  variant = 'crown',
  className,
}: SubscriptionBadgeProps) {
  const cfg = PLAN_BADGE_CONFIG[planId];

  if (!cfg.iconName || planId === 'free') return null;

  // كل الـ paid plans تأخذ Crown icon في variant='crown' عشان يبدو زي تاج
  // الفرق بين الـ plans بيكون في اللون بس
  const CrownIcon = Crown;
  const PlanIcon = ICON_MAP[cfg.iconName];

  /* ── crown: أيقونة فوق الـ avatar بدون خلفية ──────────────── */
  if (variant === 'crown') {
    return (
      <span
        className={cn('pointer-events-none select-none', className)}
        aria-label={`${cfg.label} plan`}>
        <CrownIcon
          className='h-4 w-4'
          strokeWidth={2}
          style={{
            color: cfg.accentColor,
            filter: `drop-shadow(0 0 5px ${cfg.accentColor}) drop-shadow(0 1px 3px rgba(0,0,0,0.6))`,
          }}
        />
      </span>
    );
  }

  /* ── dot: دائرة صغيرة بـ gradient ─────────────────────────── */
  if (variant === 'dot') {
    return (
      <span
        className={cn(
          'flex h-2.5 w-2.5 items-center justify-center rounded-full',
          className,
        )}
        style={{ background: cfg.gradient, boxShadow: cfg.glow }}
        aria-label={`${cfg.label} plan`}>
        <PlanIcon
          style={{ color: cfg.textColor }}
          className='h-1.5 w-1.5'
          strokeWidth={3}
        />
      </span>
    );
  }

  /* ── pill: badge كامل مع نص (billing-tab, profile) ─────────── */
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'px-2 py-[3px] rounded-full',
        'text-[10px] font-bold tracking-widest uppercase',
        'border border-white/20 select-none',
        className,
      )}
      style={{
        background: cfg.gradient,
        boxShadow: cfg.glow,
        color: cfg.textColor,
      }}
      aria-label={`${cfg.label} plan`}>
      <PlanIcon className='h-2.5 w-2.5 shrink-0' strokeWidth={2.5} />
      <span>{cfg.label}</span>
    </span>
  );
}
