// src/features/dashboard/components/overview/subscription-banner.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMySubscription } from '@/features/pricing/hooks/use-pricing';
import { PLAN_BADGE_CONFIG } from '@/features/pricing/types/pricing.types';
import { SubscriptionBadge } from '@/shared/components/common/subscription-badge';
import { ROUTES } from '@/shared/constants';
import type { PlanId } from '@/features/pricing/types/pricing.types';

export function SubscriptionBanner() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { data: subscription, isLoading } = useMySubscription();

  // ✅ Fix: prevent flash of "Upgrade" banner while subscription data is loading
  if (isLoading) return <Skeleton className='h-20 rounded-xl' />;

  /* ── Free user: upgrade banner ── */
  if (!subscription || subscription.planId === 'free') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative overflow-hidden rounded-xl border border-primary/20
                   bg-gradient-to-br from-primary/8 via-primary/3 to-background p-5'>
        <div className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-5'>
          <Crown className='h-20 w-20 text-primary' />
        </div>

        <div className='relative z-10 flex items-center gap-4'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10'>
            <Crown className='h-5 w-5 text-primary' />
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='font-bold text-foreground'>
              {t('subscription.upgradeTitle', 'Unlock Premium Features')}
            </h3>
            <p className='mt-0.5 text-sm text-muted-foreground'>
              {t(
                'subscription.upgradeDesc',
                'Unlimited labs, certificates & priority support',
              )}
            </p>
          </div>
          <Button
            size='sm'
            onClick={() => navigate(ROUTES.PRICING)}
            className='shrink-0 gap-1.5'>
            {t('subscription.upgradeCTA', 'Upgrade')}
            <ArrowRight className='h-3.5 w-3.5' />
          </Button>
        </div>
      </motion.div>
    );
  }

  /* ── Subscribed: welcome card ── uses PLAN_BADGE_CONFIG for color consistency ── */
  const planId = subscription.planId as PlanId;
  const cfg = PLAN_BADGE_CONFIG[planId];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className='relative overflow-hidden rounded-xl border p-5'
      style={{
        borderColor: `${cfg.accentColor}30`,
        background: `linear-gradient(135deg, ${cfg.accentColor}0d 0%, transparent 60%)`,
      }}>
      {/* Faint background icon */}
      <div className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-5'>
        <Crown className='h-20 w-20' style={{ color: cfg.accentColor }} />
      </div>

      <div className='relative z-10 flex items-center gap-4'>
        <div
          className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full'
          style={{ background: `${cfg.accentColor}18` }}>
          <SubscriptionBadge planId={planId} variant='crown' />
        </div>
        <div>
          <h3 className='font-bold text-foreground flex items-center gap-2'>
            {t('subscription.activeTitle', 'Welcome back!')}
            <SubscriptionBadge planId={planId} variant='pill' />
          </h3>
          <p className='text-sm text-muted-foreground'>
            {t(
              'subscription.activeDesc',
              'You have full access to all premium features',
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
