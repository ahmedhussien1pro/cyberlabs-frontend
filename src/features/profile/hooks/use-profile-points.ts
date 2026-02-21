import { useQuery } from '@tanstack/react-query';
import { getMyPoints } from '../api/profile.api';

export function useProfilePoints() {
  return useQuery({ queryKey: ['profile', 'points'], queryFn: getMyPoints });
}
