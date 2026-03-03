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
  highlights: string[];
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

export interface PlanBadgeConfig {
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;

  iconName: 'Crown' | 'Zap' | 'Building2' | null;
  gradient: string;
  glow: string;
  textColor: string;
}

export const PLAN_BADGE_CONFIG: Record<PlanId, PlanBadgeConfig> = {
  free: {
    label: 'Free',
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted/50',
    borderClass: 'border-border/40',
    iconName: null,
    gradient: '',
    glow: '',
    textColor: '',
  },
  pro: {
    label: 'Pro',
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    borderClass: 'border-primary/30',
    iconName: 'Zap',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    glow: '0 0 10px 2px rgba(59,130,246,0.45)',
    textColor: '#ffffff',
  },
  team: {
    label: 'Team',
    colorClass: 'text-violet-400',
    bgClass: 'bg-violet-500/10',
    borderClass: 'border-violet-500/30',
    iconName: 'Crown',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    glow: '0 0 10px 2px rgba(139,92,246,0.45)',
    textColor: '#ffffff',
  },
  enterprise: {
    label: 'Ent',
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
    iconName: 'Building2',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
    glow: '0 0 10px 2px rgba(6,182,212,0.45)',
    textColor: '#ffffff',
  },
};
