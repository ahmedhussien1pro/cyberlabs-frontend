import { useQuery } from '@tanstack/react-query';
import { getMyProfile, getPublicProfile } from '../api/profile.api';
import { USER_QUERY_KEYS } from '@/shared/constants/query-keys';
import { useAuthStore } from '@/core/store';

// export function useProfile() {
//   return useQuery({ queryKey: USER_QUERY_KEYS.me, queryFn: getMyProfile });
// }
export function useProfile(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: USER_QUERY_KEYS.me,
    queryFn: getMyProfile,
    enabled: options?.enabled ?? isAuthenticated,
  });
}

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.public(userId),
    queryFn: () => getPublicProfile(userId),
    enabled: !!userId,
  });
}
