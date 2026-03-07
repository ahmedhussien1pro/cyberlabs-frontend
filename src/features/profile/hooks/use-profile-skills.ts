// src/features/profile/hooks/use-profile-skills.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export interface SkillItem {
  id: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  /** 0–100 percent */
  progress: number;
  updatedAt: string;
  skill: {
    name: string;
    ar_name: string | null;
    category: string | null;
  };
}

function extract<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r?.data !== undefined ? r.data : res) as T;
}

/** Fetches the authenticated user’s tracked skills. GET /profile/skills */
export function useProfileSkills() {
  return useQuery<SkillItem[]>({
    queryKey: ['profile', 'skills'],
    queryFn: async () => extract(await apiClient.get('/profile/skills')),
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}
