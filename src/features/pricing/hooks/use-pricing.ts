import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { PLANS } from '../data/plans.data';
import {
  fetchPlans,
  fetchMySubscription,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
} from '../api/pricing.api';
import type { BillingCycle, PlanId } from '../types/pricing.types';

const KEYS = {
  plans: ['pricing', 'plans'] as const,
  subscription: ['pricing', 'subscription'] as const,
};

// ── Plans (falls back to mock while backend is not ready) ─────────────
export function usePlans() {
  return useQuery({
    queryKey: KEYS.plans,
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 10,
    placeholderData: PLANS,
    retry: false,
  });
}

// ── Current user subscription ─────────────────────────────────────────
export function useMySubscription() {
  return useQuery({
    queryKey: KEYS.subscription,
    queryFn: fetchMySubscription,
    retry: 1,
    // If API 401/404 → treat as free plan (guest/unsubscribed)
    throwOnError: false,
  });
}

// ── Checkout ──────────────────────────────────────────────────────────
export function useCheckout() {
  const { t } = useTranslation('pricing');

  return useMutation({
    mutationFn: ({
      planId,
      cycle,
      returnTo,
    }: {
      planId: PlanId;
      cycle: BillingCycle;
      returnTo?: string;
    }) => createCheckoutSession(planId, cycle, returnTo),

    onSuccess: ({ checkoutUrl }) => {
      window.location.href = checkoutUrl;
    },
    onError: () => {
      toast.error(t('pricing.checkoutError'));
    },
  });
}

// ── Manage subscription (portal) ─────────────────────────────────────
export function useManageSubscription() {
  const { t } = useTranslation('pricing');

  return useMutation({
    mutationFn: createPortalSession,
    onSuccess: ({ portalUrl }) => {
      window.location.href = portalUrl;
    },
    onError: () => {
      toast.error(t('pricing.portalError'));
    },
  });
}

// ── Cancel subscription ───────────────────────────────────────────────
export function useCancelSubscription() {
  const qc = useQueryClient();
  const { t } = useTranslation('pricing');

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (updated) => {
      qc.setQueryData(KEYS.subscription, updated);
      toast.success(t('pricing.cancelSuccess'));
    },
    onError: () => {
      toast.error(t('pricing.cancelError'));
    },
  });
}

// ── Helper: is user Pro or above? ─────────────────────────────────────
export function useIsPro(): boolean {
  const { data } = useMySubscription();
  return data?.planId === 'pro' || data?.planId === 'team';
}
