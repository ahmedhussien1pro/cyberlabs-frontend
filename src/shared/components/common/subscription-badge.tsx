// src/shared/components/common/subscription-badge.tsx
import { Shield, Star, Crown, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanId } from '@/features/pricing/types/pricing.types';
import { PLAN_BADGE_CONFIG } from '@/features/pricing/types/pricing.types';

const PLAN_ICON: Record<PlanId, React.ElementType> = {
  free: Shield,
  pro: Star,
  team: Crown,
  enterprise: Users,
};

interface SubscriptionBadgeProps {
  planId: PlanId;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function SubscriptionBadge({
  planId,
  size = 'sm',
  showIcon = true,
  className,
}: SubscriptionBadgeProps) {
  // لا تعرض badge للـ free
  if (planId === 'free') return null;

  const cfg = PLAN_BADGE_CONFIG[planId];
  const Icon = PLAN_ICON[planId];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-bold tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        cfg.bgClass,
        cfg.borderClass,
        cfg.colorClass,
        className,
      )}>
      {showIcon && (
        <Icon className={cn(size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')} />
      )}
      {cfg.label}
    </span>
  );
}

/**
 * نسخة أصغر تُستخدم جنب الـ avatar في الـ nav
 * مثال: <SubscriptionBadgeDot planId="pro" />
 */
export function SubscriptionBadgeDot({ planId }: { planId: PlanId }) {
  if (planId === 'free') return null;

  const cfg = PLAN_BADGE_CONFIG[planId];

  return (
    <span
      title={cfg.label}
      className={cn(
        'absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-background',
        planId === 'pro'
          ? 'bg-primary'
          : planId === 'team'
            ? 'bg-violet-500'
            : 'bg-cyan-500',
      )}
    />
  );
}
