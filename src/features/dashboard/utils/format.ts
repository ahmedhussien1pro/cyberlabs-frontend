// src/features/dashboard/utils/format.ts

/**
 * Format study time from minutes to human-readable string
 */
export const formatStudyTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Format XP with K/M suffixes
 */
export const formatXP = (xp: number): string => {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Get difficulty badge color
 */
export const getDifficultyColor = (
  difficulty: 'beginner' | 'intermediate' | 'advanced',
): string => {
  const colors = {
    beginner: 'bg-green-500/10 text-green-500',
    intermediate: 'bg-yellow-500/10 text-yellow-500',
    advanced: 'bg-red-500/10 text-red-500',
  };
  return colors[difficulty];
};

/**
 * Get rarity badge color
 */
export const getRarityColor = (
  rarity: 'common' | 'rare' | 'epic' | 'legendary',
): string => {
  const colors = {
    common: 'bg-gray-500/10 text-gray-500',
    rare: 'bg-blue-500/10 text-blue-500',
    epic: 'bg-purple-500/10 text-purple-500',
    legendary: 'bg-amber-500/10 text-amber-500',
  };
  return colors[rarity];
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};
