// src/features/profile/hooks/use-profile-badges.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import type { UserBadge } from '../types/profile.types';

function extract<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r?.data !== undefined ? r.data : res) as T;
}

/**
 * Fetches only the authenticated user's EARNED badges.
 * Endpoint: GET /badges/my-badges
 */
export function useProfileBadges() {
  return useQuery<UserBadge[]>({
    queryKey: ['profile', 'badges', 'earned'],
    queryFn: async () =>
      extract<UserBadge[]>(await apiClient.get('/badges/my-badges')),
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}
