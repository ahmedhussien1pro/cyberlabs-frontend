import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { LabStatus, UserLab } from '../types/dashboard.types';

export const MY_LABS_KEY = (status: LabStatus | 'all') =>
  ['user', 'labs', status] as const;

export function useMyLabs(status: LabStatus | 'all' = 'all') {
  return useQuery({
    queryKey: MY_LABS_KEY(status),
    queryFn: async () => {
      // ✅ Fix: was /labs (public catalog) → now /labs/me (user's own labs)
      const res = await apiClient.get(API_ENDPOINTS.LABS.MY_LABS, {
        params: status !== 'all' ? { status } : undefined,
      });
      return ((res as any)?.data !== undefined
        ? (res as any).data
        : res) as UserLab[];
    },
    // ✅ Fix: retry once on transient failures instead of never
    retry: 1,
    staleTime: 1000 * 60 * 3,
  });
}
