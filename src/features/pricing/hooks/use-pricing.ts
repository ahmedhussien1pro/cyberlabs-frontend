// src/features/pricing/hooks/use-pricing.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  fetchPlans,
  fetchMySubscription,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
} from '../api/pricing.api';
import type { BillingCycle, PlanId } from '../types/pricing.types';
import { isSubscribed, PLAN_BADGE_CONFIG } from '../types/pricing.types';
import { useAuthStore } from '@/core/store';

const KEYS = {
  plans: ['pricing', 'plans'] as const,
  subscription: ['pricing', 'subscription'] as const,
};

// ── Plans ─────────────────────────────────────────────────────────────
export function usePlans() {
  return useQuery({
    queryKey: KEYS.plans,
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

// ── Current user subscription ─────────────────────────────────────────
export function useMySubscription() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: KEYS.subscription,
    queryFn: fetchMySubscription,
    retry: 1,
    throwOnError: false,
    enabled: isAuthenticated,
    // refetch كل دقيقتين لضمان انعكاس Stripe webhook
    refetchInterval: 1000 * 60 * 2,
    refetchIntervalInBackground: false,
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
  return (
    data?.planId === 'pro' ||
    data?.planId === 'team' ||
    data?.planId === 'enterprise'
  );
}

// ── Badge hook: يُستخدم في Nav/Profile ──────────────────────────────
export function useSubscriptionBadge() {
  const { data: sub, isLoading } = useMySubscription();
  const planId = sub?.planId ?? 'free';
  const subscribed = isSubscribed(sub);
  const badgeCfg = PLAN_BADGE_CONFIG[planId];

  return {
    planId,
    isSubscribed: subscribed,
    badgeLabel: badgeCfg.label,
    isLoading,
  };
}
