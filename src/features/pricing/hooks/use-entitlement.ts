import { useCallback } from 'react';
import { useMySubscription } from './use-pricing';
import { useUpgradeModal } from '../components/upgrade-modal';
import type { PlanId } from '../types/pricing.types';

/**
 * A helper to define plan hierarchy and access levels.
 * Maps each plan to an access level score.
 */
const PLAN_LEVELS: Record<PlanId, number> = {
  free: 0,
  pro: 1,
  team: 2,
  enterprise: 3,
};

/**
 * Hook to manage entitlement gating across the platform.
 * Use this to wrap actions that require a certain plan level.
 */
export function useEntitlement() {
  const { data: subscription, isLoading } = useMySubscription();
  const upgradeModal = useUpgradeModal();

  const currentPlan = subscription?.planId || 'free';
  const currentLevel = PLAN_LEVELS[currentPlan];

  /**
   * Check if the user has access to a required plan level
   */
  const hasAccess = useCallback(
    (requiredPlan: PlanId = 'pro') => {
      const requiredLevel = PLAN_LEVELS[requiredPlan];
      return currentLevel >= requiredLevel;
    },
    [currentLevel]
  );

  /**
   * Wrap an action with an entitlement check.
   * If the user doesn't have access, it opens the upgrade modal instead.
   * 
   * @param action The callback to execute if the user has access
   * @param requiredPlan The minimum plan required (defaults to 'pro')
   * @param featureKey Translation key for the modal description
   * @param returnTo Optional URL to return to after checkout
   */
  const withEntitlement = useCallback(
    (
      action: () => void,
      options?: {
        requiredPlan?: PlanId;
        featureKey?: string;
        returnTo?: string;
      }
    ) => {
      const requiredPlan = options?.requiredPlan || 'pro';
      
      return () => {
        if (isLoading) return; // Optional: could show a loading state instead
        
        if (hasAccess(requiredPlan)) {
          action();
        } else {
          upgradeModal.show({
            featureKey: options?.featureKey || 'pricing.paywall.generic',
            returnTo: options?.returnTo,
          });
        }
      };
    },
    [hasAccess, isLoading, upgradeModal]
  );

  return {
    currentPlan,
    isLoading,
    hasAccess,
    withEntitlement,
  };
}
