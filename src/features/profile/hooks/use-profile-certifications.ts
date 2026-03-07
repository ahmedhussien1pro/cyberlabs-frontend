// src/features/profile/hooks/use-profile-certifications.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import type { UserCertification } from '../types/profile.types';

function extract<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r?.data !== undefined ? r.data : res) as T;
}

/**
 * Fetches the authenticated user's issued certificates.
 * Endpoint: GET /certificates/me
 */
export function useProfileCertifications() {
  return useQuery<UserCertification[]>({
    queryKey: ['profile', 'certifications'],
    queryFn: async () =>
      extract<UserCertification[]>(await apiClient.get('/certificates/me')),
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}
