// src/shared/components/common/subscription-badge.tsx
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export type UiPlanId = 'free' | 'pro' | 'team' | 'enterprise';

const CFG: Record<
  UiPlanId,
  {
    label: string;
    pillCls: string;
    dotCls: string;
    iconCls: string;
  }
> = {
  free: {
    label: 'Free',
    pillCls: 'border-border/50 bg-muted/40 text-muted-foreground',
    dotCls: 'bg-muted-foreground/60',
    iconCls: 'text-muted-foreground',
  },
  pro: {
    label: 'PRO',
    // Perplexity-ish: subtle gradient + thin border + compact typography
    pillCls:
      'border-sky-400/25 bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-indigo-500/15 text-sky-200',
    dotCls: 'bg-gradient-to-br from-sky-400 to-indigo-500',
    iconCls: 'text-sky-200',
  },
  team: {
    label: 'TEAM',
    pillCls:
      'border-violet-400/25 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-violet-500/15 text-violet-200',
    dotCls: 'bg-gradient-to-br from-violet-400 to-fuchsia-500',
    iconCls: 'text-violet-200',
  },
  enterprise: {
    label: 'ENT',
    pillCls:
      'border-cyan-400/25 bg-gradient-to-r from-cyan-500/15 via-emerald-500/10 to-cyan-500/15 text-cyan-200',
    dotCls: 'bg-gradient-to-br from-cyan-400 to-emerald-400',
    iconCls: 'text-cyan-200',
  },
};

export function SubscriptionPillBadge({
  planId,
  className,
  showIcon = true,
  size = 'sm',
}: {
  planId: UiPlanId;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}) {
  if (planId === 'free') return null;

  const cfg = CFG[planId];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold tracking-wide',
        size === 'sm' ? 'text-[10px]' : 'text-xs px-2.5 py-1',
        'shadow-sm',
        cfg.pillCls,
        className,
      )}>
      {showIcon && (
        <Star
          className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5', cfg.iconCls)}
          fill='currentColor'
        />
      )}
      {cfg.label}
    </span>
  );
}

export function SubscriptionAvatarDot({
  planId,
  className,
}: {
  planId: UiPlanId;
  className?: string;
}) {
  if (planId === 'free') return null;

  const cfg = CFG[planId];

  // Dot ring + glow (يطلع premium بدون ما يبقى “notification” قوي)
  return (
    <span
      className={cn(
        'absolute -end-0.5 -bottom-0.5 grid h-4 w-4 place-items-center rounded-full',
        'ring-2 ring-background',
        className,
      )}
      title={cfg.label}
      aria-label={`Subscription plan: ${cfg.label}`}>
      <span
        className={cn(
          'h-3 w-3 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.35)]',
          cfg.dotCls,
        )}
      />
    </span>
  );
}
