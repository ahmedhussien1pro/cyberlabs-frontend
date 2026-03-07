// src/features/profile/hooks/use-profile-achievements.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export interface AchievementItem {
  id: string;
  /** 0–1 scale (multiply × 100 for %). null = not started */
  progress: number | null;
  /** null = still in progress */
  achievedAt: string | null;
  context: string | null;
  achievement: {
    title: string;
    ar_title: string | null;
    description: string | null;
    ar_description: string | null;
    iconUrl: string | null;
    category: 'LEARNING' | 'COMMUNITY' | 'COMPETITION' | 'MILESTONE' | 'CUSTOM';
    xpReward: number;
  };
}

function extract<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r?.data !== undefined ? r.data : res) as T;
}

/** Fetches user achievements (completed + in-progress). GET /profile/achievements */
export function useProfileAchievements() {
  return useQuery<AchievementItem[]>({
    queryKey: ['profile', 'achievements'],
    queryFn: async () => extract(await apiClient.get('/profile/achievements')),
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}
