// src/features/dashboard/hooks/use-badges-data.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

export interface BadgeWithStatus {
  id: string;
  code: string;
  title: string;
  ar_title?: string;
  description?: string;
  ar_description?: string;
  iconUrl?: string;
  type: string;
  xpReward: number;
  pointsReward: number;
  earned: boolean;
  awardedAt: string | null;
}

export interface EarnedBadge {
  id: string;
  awardedAt: string;
  badge: Omit<BadgeWithStatus, 'earned' | 'awardedAt'>;
}

/** Full catalog with earned/locked status — used by dashboard BadgesCard */
export const BADGES_ME_KEY = ['badges', 'me'] as const;

export function useBadgesWithStatus() {
  return useQuery({
    queryKey: BADGES_ME_KEY,
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.BADGES.ME);
      const payload = ((res as any)?.data !== undefined
        ? (res as any).data
        : res) as any;
      return (payload?.data ?? payload ?? []) as BadgeWithStatus[];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

/** Only earned badges — used by Profile badges section */
export const MY_BADGES_KEY = ['badges', 'my'] as const;

export function useMyBadges() {
  return useQuery({
    queryKey: MY_BADGES_KEY,
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.BADGES.MY);
      const payload = ((res as any)?.data !== undefined
        ? (res as any).data
        : res) as any;
      return (payload?.data ?? payload ?? []) as EarnedBadge[];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
