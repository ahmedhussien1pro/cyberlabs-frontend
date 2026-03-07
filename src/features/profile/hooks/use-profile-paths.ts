// src/features/profile/hooks/use-profile-paths.ts
import { useQuery } from '@tanstack/react-query';
import { getMyPaths } from '../api/profile.api';
import type { UserCareerPath } from '../types/profile.types';

/**
 * Fetches the authenticated user's enrolled career paths.
 * Endpoint: GET /paths/me
 */
export function useProfilePaths() {
  return useQuery<UserCareerPath[]>({
    queryKey: ['profile', 'paths', 'enrolled'],
    queryFn: getMyPaths,
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}
