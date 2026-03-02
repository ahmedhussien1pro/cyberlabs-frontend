// src/features/pricing/api/pricing.api.ts
import { apiClient } from '@/core/api/client';
import { PLANS } from '../data/plans.data';
import type {
  Plan,
  UserSubscription,
  CheckoutSession,
  BillingCycle,
  PlanId,
} from '../types/pricing.types';

// shape from backend
interface BackendPlan {
  id: string;
  name: string; // 'free' | 'pro' | 'team' | 'enterprise'
  price: number; // per-month price (even for YEARLY, store monthly equivalent)
  duration: 'MONTHLY' | 'YEARLY';
  features: string[];
  ar_features: string[];
  stripePriceId: string | null;
  isActive: boolean;
}

const FREE_FALLBACK: UserSubscription = {
  planId: 'free',
  status: 'active',
  billingCycle: 'monthly',
  currentPeriodEnd: new Date(Date.now() + 31536000000).toISOString(),
  cancelAtPeriodEnd: false,
};

function mergePlansFromDb(rows: BackendPlan[]): Plan[] {
  return PLANS.map((uiPlan) => {
    const monthly = rows.find(
      (p) => p.name.toLowerCase() === uiPlan.id && p.duration === 'MONTHLY',
    );
    const yearly = rows.find(
      (p) => p.name.toLowerCase() === uiPlan.id && p.duration === 'YEARLY',
    );

    // IMPORTANT: no local-price fallback (avoid mock prices)
    const monthlyPrice = monthly?.price ?? 0;
    const annualPrice = yearly?.price ?? 0;

    // comingSoon if:
    // - plan is not active (coming soon), OR
    // - missing stripePriceId for either cycle (prevents 404 on checkout)
    const comingSoon =
      uiPlan.id !== 'free' &&
      (!monthly?.isActive ||
        !yearly?.isActive ||
        !monthly?.stripePriceId ||
        !yearly?.stripePriceId);

    return {
      ...uiPlan,
      monthlyPrice,
      annualPrice,
      comingSoon,
    };
  });
}

// GET /api/plans
export async function fetchPlans(): Promise<Plan[]> {
  const rows = (await apiClient.get('/plans')) as BackendPlan[];
  if (!Array.isArray(rows)) {
    throw new Error('Invalid plans payload');
  }
  return mergePlansFromDb(rows);
}

export async function fetchMySubscription(): Promise<UserSubscription> {
  try {
    const sub = (await apiClient.get(
      '/subscriptions/me',
    )) as UserSubscription | null;
    return sub ?? FREE_FALLBACK;
  } catch {
    return FREE_FALLBACK;
  }
}

export async function createCheckoutSession(
  planId: PlanId,
  cycle: BillingCycle,
  returnTo?: string,
): Promise<CheckoutSession> {
  const billingCycle: 'MONTHLY' | 'YEARLY' =
    cycle === 'annual' ? 'YEARLY' : 'MONTHLY';

  return (await apiClient.post('/subscriptions/checkout', {
    planId,
    billingCycle,
    successUrl: returnTo || `${window.location.origin}/pricing?success=true`,
  })) as CheckoutSession;
}

export async function createPortalSession(): Promise<{ portalUrl: string }> {
  return (await apiClient.post('/subscriptions/portal')) as {
    portalUrl: string;
  };
}

export async function cancelSubscription(): Promise<UserSubscription> {
  return (await apiClient.post('/subscriptions/cancel')) as UserSubscription;
}
