import { motion } from 'framer-motion';
import { Crown, Sparkles, Building2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMySubscription } from '@/features/pricing/hooks/use-pricing';
import { ROUTES } from '@/shared/constants';

const PLAN_CONFIG = {
  pro: {
    icon: Crown,
    gradient: 'from-yellow-500/10 via-amber-500/5 to-background',
    border: 'border-yellow-500/20',
    iconBg: 'bg-yellow-500/10',
    iconColor: 'text-yellow-500',
    textColor: 'text-yellow-500',
    label: 'Pro',
  },
  team: {
    icon: Building2,
    gradient: 'from-purple-500/10 via-pink-500/5 to-background',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    textColor: 'text-purple-500',
    label: 'Team',
  },
  enterprise: {
    icon: Sparkles,
    gradient: 'from-cyan-500/10 via-blue-500/5 to-background',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
    textColor: 'text-cyan-500',
    label: 'Enterprise',
  },
};

export function SubscriptionBanner() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { data: subscription } = useMySubscription();

  if (!subscription || subscription.planId === 'free') {
    // Free user - show upgrade banner
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-background p-5'>
        <div className='absolute right-0 top-0 h-32 w-32 opacity-10'>
          <Crown className='h-full w-full text-yellow-500' />
        </div>

        <div className='relative z-10'>
          <div className='flex items-start gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/10'>
              <Crown className='h-5 w-5 text-yellow-500' />
            </div>
            <div className='flex-1'>
              <h3 className='font-bold text-foreground'>
                {t('subscription.upgradeTitle', 'Unlock Premium Features')}
              </h3>
              <p className='mt-1 text-sm text-muted-foreground'>
                {t(
                  'subscription.upgradeDesc',
                  'Get unlimited labs, certificates, and priority support with Pro',
                )}
              </p>
              <Button
                size='sm'
                onClick={() => navigate(ROUTES.PRICING)}
                className='mt-3 gap-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600'>
                {t('subscription.upgradeCTA', 'Upgrade to Pro')}
                <ArrowRight className='h-3.5 w-3.5' />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Pro+ user - show welcome card
  const config =
    PLAN_CONFIG[subscription.planId as keyof typeof PLAN_CONFIG] ||
    PLAN_CONFIG.pro;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-xl border ${config.border} bg-gradient-to-br ${config.gradient} p-5`}>
      <div className='absolute right-0 top-0 h-32 w-32 opacity-10'>
        <Icon className={`h-full w-full ${config.iconColor}`} />
      </div>

      <div className='relative z-10 flex items-center gap-3'>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}>
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div>
          <h3 className='font-bold text-foreground'>
            {t('subscription.activeTitle', 'Welcome back,')}{' '}
            <span className={config.textColor}>{config.label}</span>{' '}
            {t('subscription.member', 'member')}! 👋
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
