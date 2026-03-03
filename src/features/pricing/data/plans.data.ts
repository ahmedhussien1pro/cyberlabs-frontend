import type { Plan, PlanFeatureRow } from '../types/pricing.types';

export const PLANS: Plan[] = [
  {
    id: 'free',
    nameKey: 'pricing.plans.free.name',
    descKey: 'pricing.plans.free.desc',
    monthlyPrice: 0,
    annualPrice: 0,
    color: 'zinc',
    ctaKey: 'pricing.cta.freeCta',
    highlights: [
      'pricing.plans.free.h1',
      'pricing.plans.free.h2',
      'pricing.plans.free.h3',
      'pricing.plans.free.h4',
    ],
  },
  {
    id: 'pro',
    nameKey: 'pricing.plans.pro.name',
    descKey: 'pricing.plans.pro.desc',
    monthlyPrice: 14,
    annualPrice: 9,
    color: 'blue',
    badge: 'pricing.badge.popular',
    ctaKey: 'pricing.cta.upgradeCta',
    highlights: [
      'pricing.plans.pro.h1',
      'pricing.plans.pro.h2',
      'pricing.plans.pro.h3',
      'pricing.plans.pro.h4',
      'pricing.plans.pro.h5',
    ],
  },
  {
    id: 'team',
    nameKey: 'pricing.plans.team.name',
    descKey: 'pricing.plans.team.desc',
    monthlyPrice: 49,
    annualPrice: 35,
    color: 'violet',
    ctaKey: 'pricing.cta.team',
    comingSoon: true,
    highlights: [
      'pricing.plans.team.h1',
      'pricing.plans.team.h2',
      'pricing.plans.team.h3',
      'pricing.plans.team.h4',
    ],
  },
  {
    id: 'enterprise',
    nameKey: 'pricing.plans.enterprise.name',
    descKey: 'pricing.plans.enterprise.desc',
    monthlyPrice: 49,
    annualPrice: 35,
    color: 'violet',
    ctaKey: 'pricing.cta.enterprise',
    comingSoon: true,
    highlights: [
      'pricing.plans.enterprise.h1',
      'pricing.plans.enterprise.h2',
      'pricing.plans.enterprise.h3',
      'pricing.plans.enterprise.h4',
    ],
  },
];

export const FEATURE_ROWS: PlanFeatureRow[] = [
  {
    key: 'pricing.table.labs',
    free: '5 labs',
    pro: 'Unlimited',
    highlight: true,
  },
  {
    key: 'pricing.table.paths',
    free: '2 paths',
    pro: 'Unlimited',
    highlight: true,
  },
  { key: 'pricing.table.courses', free: '3 courses', pro: 'Unlimited' },
  { key: 'pricing.table.certs', free: false, pro: true, highlight: true },
  { key: 'pricing.table.vpn', free: false, pro: true, highlight: true },
  { key: 'pricing.table.ctf', free: false, pro: true },
  { key: 'pricing.table.discord', free: false, pro: true },
  { key: 'pricing.table.support', free: 'Community', pro: 'Email' },
];
