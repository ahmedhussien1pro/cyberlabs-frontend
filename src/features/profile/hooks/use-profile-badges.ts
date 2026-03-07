// src/features/profile/hooks/use-profile-badges.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import type { UserBadge } from '../types/profile.types';

function extract<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r?.data !== undefined ? r.data : res) as T;
}

/**
 * Backend stores `code` (kebab-case e.g. 'first-course').
 * Frontend badge registry uses `slug` for lookups.
 * This mapper aliases code → slug so BADGE_REGISTRY works correctly.
 */
function mapBadge(raw: Record<string, unknown>): UserBadge {
  const badge = raw.badge as Record<string, unknown>;
  return {
    id: raw.id as string,
    awardedAt: raw.awardedAt as string,
    context: raw.context as string | undefined,
    badge: {
      slug: (badge.slug ?? badge.code) as string | undefined, // ✅ alias code → slug
      title: badge.title as string,
      ar_title: badge.ar_title as string | undefined,
      description: badge.description as string | undefined,
      ar_description: badge.ar_description as string | undefined,
      iconUrl: badge.iconUrl as string | undefined,
      type: badge.type as UserBadge['badge']['type'],
      xpReward: badge.xpReward as number,
    },
  };
}

/**
 * Fetches only badges the authenticated user has EARNED.
 * Endpoint: GET /badges/my
 */
export function useProfileBadges() {
  return useQuery<UserBadge[]>({
    queryKey: ['profile', 'badges', 'earned'],
    queryFn: async () => {
      const raw = extract<Record<string, unknown>[]>(
        await apiClient.get('/badges/my'),
      );
      return raw.map(mapBadge);
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}
