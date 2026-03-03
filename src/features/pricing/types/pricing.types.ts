// src/features/pricing/types/pricing.types.ts
export type BillingCycle = 'monthly' | 'annual';
export type PlanId = 'free' | 'pro' | 'team' | 'enterprise';

export interface Plan {
  id: PlanId;
  nameKey: string;
  descKey: string;
  monthlyPrice: number;
  annualPrice: number;
  color: 'zinc' | 'blue' | 'violet' | 'cyan';
  badge?: string;
  ctaKey: string;
  comingSoon?: boolean;
  highlights: string[]; // i18n keys
}

export interface PlanFeatureRow {
  key: string;
  free: boolean | string;
  pro: boolean | string;
  highlight?: boolean;
}

export interface UserSubscription {
  planId: PlanId;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  billingCycle: BillingCycle;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface CheckoutSession {
  checkoutUrl: string;
  sessionId: string;
}

// ── Derived helpers ───────────────────────────────────────────────────
export function isSubscribed(sub: UserSubscription | undefined): boolean {
  if (!sub) return false;
  return sub.planId !== 'free' && sub.status === 'active';
}

export const PLAN_BADGE_CONFIG: Record<
  PlanId,
  { label: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  free: {
    label: 'Free',
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted/50',
    borderClass: 'border-border/40',
  },
  pro: {
    label: 'Pro',
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    borderClass: 'border-primary/30',
  },
  team: {
    label: 'Team',
    colorClass: 'text-violet-400',
    bgClass: 'bg-violet-500/10',
    borderClass: 'border-violet-500/30',
  },
  enterprise: {
    label: 'Enterprise',
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
  },
};
