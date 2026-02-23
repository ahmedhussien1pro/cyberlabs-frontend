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
