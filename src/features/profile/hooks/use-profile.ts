import { useQuery } from '@tanstack/react-query';
import { getMyProfile, getPublicProfile } from '../api/profile.api';

export const PROFILE_KEYS = {
  me: ['profile', 'me'] as const,
  public: (id: string) => ['profile', 'public', id] as const,
};

export function useProfile() {
  return useQuery({ queryKey: PROFILE_KEYS.me, queryFn: getMyProfile });
}

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: PROFILE_KEYS.public(userId),
    queryFn: () => getPublicProfile(userId),
    enabled: !!userId,
  });
}
