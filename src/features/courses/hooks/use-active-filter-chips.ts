// src/features/courses/hooks/use-active-filter-chips.ts
import { useTranslation } from 'react-i18next';
import {
  SearchX,
  Heart,
  BookOpen,
  BookCheck,
  TrendingUp,
  Gauge,
  Flame,
  Unlock,
  Crown,
  Gem,
  Clock3,
  FlaskConical,
  BookMarked,
} from 'lucide-react';
import type { CourseFilters } from '../types/course.types';

export interface ActiveFilterChip {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  onRemove: () => void;
}

export function useActiveFilterChips(
  filters: CourseFilters,
  onChange: (f: CourseFilters) => void,
): ActiveFilterChip[] {
  const { t } = useTranslation('courses');
  const chips: ActiveFilterChip[] = [];

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `"${filters.search}"`,
      icon: SearchX,
      color: 'text-foreground',
      onRemove: () => onChange({ ...filters, search: '' }),
    });
  }
  if (filters.onlyFavorites) {
    chips.push({
      key: 'fav',
      label: t('filters.favorites', 'Favorites'),
      icon: Heart,
      color: 'text-rose-400',
      onRemove: () => onChange({ ...filters, onlyFavorites: false }),
    });
  }
  if (filters.onlyEnrolled) {
    chips.push({
      key: 'enrolled',
      label: t('filters.enrolled', 'Enrolled'),
      icon: BookOpen,
      color: 'text-blue-400',
      onRemove: () => onChange({ ...filters, onlyEnrolled: false }),
    });
  }
  if (filters.onlyCompleted) {
    chips.push({
      key: 'completed',
      label: t('filters.completed', 'Completed'),
      icon: BookCheck,
      color: 'text-emerald-400',
      onRemove: () => onChange({ ...filters, onlyCompleted: false }),
    });
  }

  const DIFF_MAP: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    BEGINNER:     { label: 'Beginner',     icon: TrendingUp, color: 'text-emerald-500' },
    INTERMEDIATE: { label: 'Intermediate', icon: Gauge,      color: 'text-yellow-500' },
    ADVANCED:     { label: 'Advanced',     icon: Flame,      color: 'text-red-500'    },
  };
  if (filters.difficulty && DIFF_MAP[filters.difficulty]) {
    const d = DIFF_MAP[filters.difficulty];
    chips.push({
      key: 'diff',
      label: d.label,
      icon: d.icon,
      color: d.color,
      onRemove: () => onChange({ ...filters, difficulty: undefined }),
    });
  }

  const ACCESS_MAP: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    FREE:    { label: 'Free',    icon: Unlock, color: 'text-emerald-500' },
    PRO:     { label: 'Pro',     icon: Crown,  color: 'text-blue-500'    },
    PREMIUM: { label: 'Premium', icon: Gem,    color: 'text-violet-500'  },
  };
  if (filters.access && ACCESS_MAP[filters.access]) {
    const a = ACCESS_MAP[filters.access];
    chips.push({
      key: 'access',
      label: a.label,
      icon: a.icon,
      color: a.color,
      onRemove: () => onChange({ ...filters, access: undefined }),
    });
  }

  const CT_MAP: Record<string, { label: string; icon: React.ElementType }> = {
    PRACTICAL:   { label: t('filters.practical',   'Practical'),   icon: FlaskConical },
    THEORETICAL: { label: t('filters.theoretical', 'Theoretical'), icon: BookMarked   },
    MIXED:       { label: t('filters.mixed',        'Mixed'),       icon: BookOpen     },
  };
  if (filters.contentType && CT_MAP[filters.contentType]) {
    const ct = CT_MAP[filters.contentType];
    chips.push({
      key: 'ct',
      label: ct.label,
      icon: ct.icon,
      color: 'text-muted-foreground',
      onRemove: () => onChange({ ...filters, contentType: undefined }),
    });
  }

  if (filters.state === 'COMING_SOON') {
    chips.push({
      key: 'state',
      label: t('filters.comingSoon', 'Coming Soon'),
      icon: Clock3,
      color: 'text-zinc-400',
      onRemove: () => onChange({ ...filters, state: undefined }),
    });
  }

  return chips;
}
