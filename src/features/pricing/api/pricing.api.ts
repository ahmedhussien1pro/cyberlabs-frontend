import { apiClient } from '@/core/api/client';
import type {
  Plan,
  UserSubscription,
  CheckoutSession,
  BillingCycle,
  PlanId,
} from '../types/pricing.types';

// ── GET /api/plans ─────────────────────────────────────────────────────

export async function fetchPlans(): Promise<Plan[]> {
  const { data } = await apiClient.get<Plan[]>('/plans');
  return data;
}

// ── GET /api/subscriptions/me ──────────────────────────────────────────

export async function fetchMySubscription(): Promise<UserSubscription> {
  try {
    const { data } = await apiClient.get<UserSubscription>('/subscriptions/me');
    // Ensure we always return an object even if API returns null/undefined
    return (
      data || {
        userId: '',
        planId: 'free',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 31536000000).toISOString(),
        cancelAtPeriodEnd: false,
      }
    );
  } catch (error) {
    return {
      userId: 'guest',
      planId: 'free',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 31536000000).toISOString(),
      cancelAtPeriodEnd: false,
    };
  }
}

// ── POST /api/subscriptions/checkout ──────────────────────────────────

export async function createCheckoutSession(
  planId: PlanId,
  cycle: BillingCycle,
  returnTo?: string,
): Promise<CheckoutSession> {
  const { data } = await apiClient.post<CheckoutSession>(
    '/subscriptions/checkout',
    { planId, billingCycle: cycle, successUrl: returnTo },
  );
  return data;
}

// ── POST /api/subscriptions/portal ────────────────────────────────────
export async function createPortalSession(): Promise<{ portalUrl: string }> {
  const { data } = await apiClient.post<{ portalUrl: string }>(
    '/subscriptions/portal',
  );
  return data;
}

// ── POST /api/subscriptions/cancel ────────────────────────────────────
export async function cancelSubscription(): Promise<UserSubscription> {
  const { data } = await apiClient.post<UserSubscription>(
    '/subscriptions/cancel',
  );
  return data;
}
