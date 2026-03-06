import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { UserLab, LabStatus } from '../types/dashboard.types';

export const MY_LABS_KEY = (status: LabStatus | 'all') =>
  ['user', 'labs', status] as const;

// ✅ Fix: backend returns { success, progress: [{lab, completedAt, ...}] }
//         we map it to the UserLab shape the UI expects
function mapProgressToUserLab(item: Record<string, unknown>): UserLab {
  const lab = (item.lab ?? {}) as Record<string, unknown>;
  return {
    id:             (lab.id ?? item.labId ?? '') as string,
    title:          (lab.title ?? '') as string,
    ar_title:       lab.ar_title as string | undefined,
    description:    (lab.description ?? '') as string,
    ar_description: lab.ar_description as string | undefined,
    difficulty:     (lab.difficulty ?? 'EASY') as UserLab['difficulty'],
    xpReward:       (lab.xpReward ?? 0) as number,
    category:       (lab.category ?? '') as string,
    thumbnail:      lab.thumbnail as string | undefined,
    status:         item.completedAt ? 'completed' : item.startedAt ? 'active' : 'not_started',
    progress:       (item.progress ?? 0) as number,
    completedAt:    item.completedAt as string | undefined,
    startedAt:      item.startedAt as string | undefined,
  };
}

export function useMyLabs(status: LabStatus | 'all' = 'all') {
  return useQuery({
    queryKey: MY_LABS_KEY(status),
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.LABS.MY_LABS);
      // Backend: { success: true, progress: [...] }  OR  { data: { progress: [...] } }
      const payload = ((res as any)?.data !== undefined ? (res as any).data : res) as any;
      const list: Record<string, unknown>[] =
        Array.isArray(payload?.progress) ? payload.progress
        : Array.isArray(payload)         ? payload
        : [];

      const all = list.map(mapProgressToUserLab);
      if (status === 'all') return all;
      return all.filter((l) => l.status === status);
    },
    retry: 1,
    staleTime: 1000 * 60 * 3,
  });
}
