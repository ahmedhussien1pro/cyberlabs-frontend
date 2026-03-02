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

// ── Raw shape returned by the backend ────────────────────────────────
interface BackendPlan {
  id: string;
  name: string;
  price: number;
  duration: 'MONTHLY' | 'YEARLY';
  features: string[];
  stripePriceId?: string;
  isActive: boolean;
}

// ── Merge backend prices into local PLANS (keeps i18n keys & UI config)
function mergePlansWithPrices(backendPlans: BackendPlan[]): Plan[] {
  return PLANS.map((localPlan) => {
    const monthlyRow = backendPlans.find(
      (p) => p.name.toLowerCase() === localPlan.id && p.duration === 'MONTHLY',
    );
    const yearlyRow = backendPlans.find(
      (p) => p.name.toLowerCase() === localPlan.id && p.duration === 'YEARLY',
    );
    return {
      ...localPlan,
      monthlyPrice: monthlyRow?.price ?? localPlan.monthlyPrice,
      annualPrice: yearlyRow?.price ?? localPlan.annualPrice,
    };
  });
}

const FREE_FALLBACK: UserSubscription = {
  planId: 'free',
  status: 'active',
  billingCycle: 'monthly',
  currentPeriodEnd: new Date(Date.now() + 31536000000).toISOString(),
  cancelAtPeriodEnd: false,
};

// ── NOTE: apiClient interceptor already unwraps response.data ────────
// NEVER do `const { data } = await apiClient.get(...)` — data = undefined

// ── GET /api/plans ───────────────────────────────────────────────────
export async function fetchPlans(): Promise<Plan[]> {
  try {
    const raw = (await apiClient.get('/plans')) as BackendPlan[];
    if (!Array.isArray(raw) || raw.length === 0) return PLANS;
    return mergePlansWithPrices(raw);
  } catch {
    return PLANS;
  }
}

// ── GET /api/subscriptions/me ────────────────────────────────────────
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

// ── POST /api/subscriptions/checkout ────────────────────────────────
// Maps frontend 'monthly'|'annual' → backend 'MONTHLY'|'YEARLY'
export async function createCheckoutSession(
  planId: PlanId,
  cycle: BillingCycle,
  returnTo?: string,
): Promise<CheckoutSession> {
  const billingCycle: 'MONTHLY' | 'YEARLY' =
    cycle === 'annual' ? 'YEARLY' : 'MONTHLY';

  const result = (await apiClient.post('/subscriptions/checkout', {
    planId,
    billingCycle,
    successUrl: returnTo || `${window.location.origin}/pricing?success=true`,
  })) as CheckoutSession;

  return result;
}

// ── POST /api/subscriptions/portal ──────────────────────────────────
export async function createPortalSession(): Promise<{ portalUrl: string }> {
  return (await apiClient.post('/subscriptions/portal')) as {
    portalUrl: string;
  };
}

// ── POST /api/subscriptions/cancel ──────────────────────────────────
export async function cancelSubscription(): Promise<UserSubscription> {
  return (await apiClient.post('/subscriptions/cancel')) as UserSubscription;
}
