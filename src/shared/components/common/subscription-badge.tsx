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
  variant?: 'pill' | 'dot';
  className?: string;
}

export function SubscriptionBadge({
  planId,
  variant = 'pill',
  className,
}: SubscriptionBadgeProps) {
  const cfg = PLAN_BADGE_CONFIG[planId];

  if (!cfg.iconName || planId === 'free') return null;

  const Icon = ICON_MAP[cfg.iconName];

  if (variant === 'dot') {
    return (
      <span
        className={cn(
          'flex h-2.5 w-2.5 items-center justify-center rounded-full',
          className,
        )}
        style={{
          background: cfg.gradient,
          boxShadow: cfg.glow,
        }}
        aria-label={`${cfg.label} plan`}>
        <Icon
          style={{ color: cfg.textColor }}
          className='h-1.5 w-1.5'
          strokeWidth={3}
        />
      </span>
    );
  }

  /* ── pill variant ── */
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5',
        'px-2 py-[1px] rounded-full',
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
      <Icon className='h-1.5 w-1.5 shrink-0' strokeWidth={1.5} />
      <span>{cfg.label}</span>
    </span>
  );
}
