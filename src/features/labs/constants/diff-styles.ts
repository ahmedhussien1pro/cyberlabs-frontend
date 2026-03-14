// src/features/labs/constants/diff-styles.ts
// ─── Single source of truth for difficulty styles used across lab-card & lab-detail ───
import { TrendingUp, Gauge, Flame } from 'lucide-react';

export const DIFF_STYLES = {
  BEGINNER: {
    Icon: TrendingUp,
    label: 'Beginner',
    badgeCls:    'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    ringCls:     'hover:ring-emerald-500/25',
    gradientCls: 'from-emerald-950 to-emerald-900/80 border-emerald-800/50',
    textCls:     'text-emerald-400',
    stripeCls:   'bg-emerald-500',
  },
  INTERMEDIATE: {
    Icon: Gauge,
    label: 'Intermediate',
    badgeCls:    'border-yellow-500/40 text-yellow-400 bg-yellow-500/10',
    ringCls:     'hover:ring-yellow-500/25',
    gradientCls: 'from-yellow-950 to-yellow-900/80 border-yellow-800/50',
    textCls:     'text-yellow-400',
    stripeCls:   'bg-yellow-500',
  },
  ADVANCED: {
    Icon: Flame,
    label: 'Advanced',
    badgeCls:    'border-red-500/40 text-red-400 bg-red-500/10',
    ringCls:     'hover:ring-red-500/25',
    gradientCls: 'from-red-950 to-red-900/80 border-red-800/50',
    textCls:     'text-red-400',
    stripeCls:   'bg-red-500',
  },
} as const;

export type LabDifficulty = keyof typeof DIFF_STYLES;

export const ACCESS_BADGE_CLS = {
  free:    'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  pro:     'border-blue-500/40    text-blue-400    bg-blue-500/10',
  premium: 'border-violet-500/40  text-violet-400  bg-violet-500/10',
} as const;
