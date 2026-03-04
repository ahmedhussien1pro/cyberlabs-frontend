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

export function isSubscribed(sub: UserSubscription | undefined): boolean {
  if (!sub) return false;
  return sub.planId !== 'free' && sub.status === 'active';
}

export const PLAN_BADGE_CONFIG: Record<
  PlanId,
  {
    label: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    iconName: 'Zap' | 'Crown' | 'Building2' | null;
    accentColor: string; // لون الأيقونة في crown variant
    gradient: string;
    glow: string;
    textColor: string;
  }
> = {
  free: {
    label: 'Free',
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted/50',
    borderClass: 'border-border/40',
    iconName: null,
    accentColor: '',
    gradient: '',
    glow: '',
    textColor: '',
  },
  pro: {
    label: 'Pro',
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/30',
    iconName: 'Zap',
    accentColor: '#60a5fa',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    glow: '0 0 8px 2px rgba(59,130,246,0.5)',
    textColor: '#ffffff',
  },
  team: {
    label: 'Team',
    colorClass: 'text-violet-400',
    bgClass: 'bg-violet-500/10',
    borderClass: 'border-violet-500/30',
    iconName: 'Crown',
    accentColor: '#a78bfa',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    glow: '0 0 8px 2px rgba(139,92,246,0.5)',
    textColor: '#ffffff',
  },
  enterprise: {
    label: 'Ent',
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
    iconName: 'Building2',
    accentColor: '#22d3ee',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
    glow: '0 0 8px 2px rgba(6,182,212,0.5)',
    textColor: '#ffffff',
  },
};
