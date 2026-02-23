import type { PathColor } from '../types/path.types';

export interface PathColorTokens {
  stripe: string;
  border: string;
  hover: string;
  icon: string;
  badge: string;
  bar: string;
  btn: string;
  glow: string;
  text: string;
  ring: string;
}

export const PATH_COLOR_MAP: Record<PathColor, PathColorTokens> = {
  emerald: {
    stripe: 'bg-emerald-500',
    border: 'border-emerald-500/20',
    hover: 'hover:border-emerald-500/50',
    icon: 'bg-emerald-500/15 text-emerald-500',
    badge:
      'border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    bar: '[&>div]:bg-emerald-500',
    btn: 'border-emerald-500/35 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10',
    glow: 'hover:shadow-emerald-500/10',
    text: 'text-emerald-500',
    ring: 'ring-emerald-500/30',
  },
  blue: {
    stripe: 'bg-blue-500',
    border: 'border-blue-500/20',
    hover: 'hover:border-blue-500/50',
    icon: 'bg-blue-500/15 text-blue-500',
    badge: 'border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    bar: '[&>div]:bg-blue-500',
    btn: 'border-blue-500/35 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10',
    glow: 'hover:shadow-blue-500/10',
    text: 'text-blue-500',
    ring: 'ring-blue-500/30',
  },
  violet: {
    stripe: 'bg-violet-500',
    border: 'border-violet-500/20',
    hover: 'hover:border-violet-500/50',
    icon: 'bg-violet-500/15 text-violet-500',
    badge:
      'border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400',
    bar: '[&>div]:bg-violet-500',
    btn: 'border-violet-500/35 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10',
    glow: 'hover:shadow-violet-500/10',
    text: 'text-violet-500',
    ring: 'ring-violet-500/30',
  },
  rose: {
    stripe: 'bg-rose-500',
    border: 'border-rose-500/20',
    hover: 'hover:border-rose-500/50',
    icon: 'bg-rose-500/15 text-rose-500',
    badge: 'border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400',
    bar: '[&>div]:bg-rose-500',
    btn: 'border-rose-500/35 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10',
    glow: 'hover:shadow-rose-500/10',
    text: 'text-rose-500',
    ring: 'ring-rose-500/30',
  },
  orange: {
    stripe: 'bg-orange-500',
    border: 'border-orange-500/20',
    hover: 'hover:border-orange-500/50',
    icon: 'bg-orange-500/15 text-orange-500',
    badge:
      'border-orange-500/25 bg-orange-500/10 text-orange-600 dark:text-orange-400',
    bar: '[&>div]:bg-orange-500',
    btn: 'border-orange-500/35 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10',
    glow: 'hover:shadow-orange-500/10',
    text: 'text-orange-500',
    ring: 'ring-orange-500/30',
  },
  cyan: {
    stripe: 'bg-cyan-500',
    border: 'border-cyan-500/20',
    hover: 'hover:border-cyan-500/50',
    icon: 'bg-cyan-500/15 text-cyan-500',
    badge: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    bar: '[&>div]:bg-cyan-500',
    btn: 'border-cyan-500/35 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10',
    glow: 'hover:shadow-cyan-500/10',
    text: 'text-cyan-500',
    ring: 'ring-cyan-500/30',
  },
};

export function getPathColors(color: PathColor): PathColorTokens {
  return PATH_COLOR_MAP[color] ?? PATH_COLOR_MAP.blue;
}
