import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/shared/constants';
import { useCheckout } from '../hooks/use-pricing';

export interface PaywallContext {
  featureKey: string;
  returnTo?: string;
}

// ── Global store for modal state ──────────────────────────────────────
interface UpgradeModalStore {
  open: boolean;
  context: PaywallContext | null;
  show: (ctx: PaywallContext) => void;
  hide: () => void;
}

export const useUpgradeModal = create<UpgradeModalStore>((set) => ({
  open: false,
  context: null,
  show: (ctx) => set({ open: true, context: ctx }),
  hide: () => set({ open: false }),
}));

// ── Modal component — mount once in App.tsx / RootLayout ─────────────
export function UpgradeModal() {
  const { t } = useTranslation('pricing');
  const navigate = useNavigate();
  const { open, context, hide } = useUpgradeModal();
  const checkout = useCheckout();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key='backdrop'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={hide}
            className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm'
          />

          {/* Dialog */}
          <motion.div
            key='dialog'
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className='fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-2xl border border-border/50 bg-card p-6 shadow-2xl'>
            {/* Close */}
            <button
              onClick={hide}
              className='absolute end-4 top-4 text-muted-foreground/60 hover:text-foreground'>
              <X className='h-4 w-4' />
            </button>

            {/* Icon */}
            <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500 ring-1 ring-blue-500/30'>
              <Lock className='h-6 w-6' />
            </div>

            {/* Title */}
            <h2 className='mb-1 text-center text-lg font-black tracking-tight'>
              {t('pricing.paywall.title')}
            </h2>
            <p className='mb-5 text-center text-sm text-muted-foreground'>
              {context?.featureKey
                ? t(context.featureKey)
                : t('pricing.paywall.generic')}
            </p>

            {/* Price teaser */}
            <div className='mb-5 rounded-xl border border-blue-500/25 bg-blue-500/8 px-4 py-3 text-center'>
              <p className='text-[11px] text-muted-foreground'>
                {t('pricing.paywall.proFrom')}
              </p>
              <p className='text-2xl font-black text-foreground'>
                $9
                <span className='text-sm font-normal text-muted-foreground'>
                  /mo
                </span>
              </p>
              <p className='text-[11px] text-emerald-500'>
                {t('pricing.paywall.annualNote')}
              </p>
            </div>

            {/* Actions */}
            <Button
              className='mb-2 w-full gap-2 font-semibold'
              disabled={checkout.isPending}
              onClick={() =>
                checkout.mutate({
                  planId: 'pro',
                  cycle: 'annual',
                  returnTo: context?.returnTo,
                })
              }>
              <Zap className='h-4 w-4' />
              {t('pricing.paywall.upgradeCta')}
            </Button>

            <Button
              variant='ghost'
              className='w-full text-sm text-muted-foreground'
              onClick={() => {
                hide();
                navigate(ROUTES.PRICING);
              }}>
              {t('pricing.paywall.viewPlans')}
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
