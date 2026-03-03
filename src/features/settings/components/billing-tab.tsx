import { CreditCard, ExternalLink, Loader2, XCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  useMySubscription,
  useManageSubscription,
  useCancelSubscription,
} from '@/features/pricing/hooks/use-pricing';
import {
  PLAN_BADGE_CONFIG,
  isSubscribed,
} from '@/features/pricing/types/pricing.types';
import { ROUTES } from '@/shared/constants';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso));
}

export function BillingTab() {
  const { t } = useTranslation('settings');
  const { data: sub, isLoading } = useMySubscription();
  const manage = useManageSubscription();
  const cancel = useCancelSubscription();

  const subscribed = isSubscribed(sub);
  const planId = sub?.planId ?? 'free';
  const cfg = PLAN_BADGE_CONFIG[planId];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  /* ── Free plan ─────────────────────────────────────── */
  if (!subscribed) {
    return (
      <div className='space-y-4'>
        <SectionHeader
          icon={<CreditCard size={16} />}
          title={t('billing.title')}
          description={t('billing.freePlan')}
        />
        <div className='rounded-xl border border-border/40 bg-muted/20 p-5 flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground'>
            {t('billing.upgradeDesc')}
          </p>
          <Button asChild size='sm' className='w-fit'>
            <Link to={ROUTES.PRICING}>
              <Zap className='mr-2 h-4 w-4' />
              {t('billing.viewPlans')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  /* ── Active plan ───────────────────────────────────── */
  return (
    <div className='space-y-6'>
      <SectionHeader
        icon={<CreditCard size={16} />}
        title={t('billing.title')}
        description={t('billing.description')}
      />

      {/* Plan card */}
      <div className='rounded-xl border border-border/40 bg-card p-5 space-y-4'>
        <div className='flex items-center justify-between flex-wrap gap-2'>
          <div className='flex items-center gap-2'>
            <span
              className={cn(
                'text-xs font-semibold uppercase px-2.5 py-1 rounded-full border',
                cfg.bgClass,
                cfg.colorClass,
                cfg.borderClass,
              )}>
              {cfg.label}
            </span>
            <StatusPill status={sub!.status} t={t} />
          </div>
          <span className='text-xs text-muted-foreground capitalize'>
            {t('billing.billedLabel')}{' '}
            <span className='font-medium text-foreground'>
              {sub!.billingCycle}
            </span>
          </span>
        </div>

        <div className='text-sm text-muted-foreground'>
          {sub!.cancelAtPeriodEnd ? (
            <span className='text-destructive font-medium'>
              {t('billing.cancelsOn')} {formatDate(sub!.currentPeriodEnd)}
            </span>
          ) : (
            <>
              {t('billing.renewsOn')}{' '}
              <span className='font-medium text-foreground'>
                {formatDate(sub!.currentPeriodEnd)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-wrap gap-3'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => manage.mutate()}
          disabled={manage.isPending}>
          {manage.isPending ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <ExternalLink className='mr-2 h-4 w-4' />
          )}
          {t('billing.manageBilling')}
        </Button>

        {!sub!.cancelAtPeriodEnd && (
          <Button
            variant='ghost'
            size='sm'
            className='text-destructive hover:bg-destructive/10 hover:text-destructive'
            onClick={() => cancel.mutate()}
            disabled={cancel.isPending}>
            {cancel.isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <XCircle className='mr-2 h-4 w-4' />
            )}
            {t('billing.cancelSubscription')}
          </Button>
        )}
      </div>

      {sub!.cancelAtPeriodEnd && (
        <p className='text-xs text-muted-foreground rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3'>
          {t('billing.cancelNotice', {
            date: formatDate(sub!.currentPeriodEnd),
          })}
        </p>
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────── */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='flex items-start gap-2.5 pb-2 border-b border-border/40'>
      <span className='mt-0.5 text-muted-foreground'>{icon}</span>
      <div>
        <p className='text-sm font-semibold'>{title}</p>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
}

const STATUS_CLASSES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  trialing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  past_due: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  canceled: 'bg-destructive/10 text-destructive border-destructive/30',
};

function StatusPill({
  status,
  t,
}: {
  status: string;
  t: (key: string) => string;
}) {
  return (
    <span
      className={cn(
        'text-[10px] font-medium uppercase px-2 py-0.5 rounded-full border',
        STATUS_CLASSES[status] ??
          'bg-muted text-muted-foreground border-border',
      )}>
      {t(`billing.status.${status}`) || status.replace('_', ' ')}
    </span>
  );
}
