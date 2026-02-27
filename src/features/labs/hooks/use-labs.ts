import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export const labsQueryKeys = {
  all: ['labs'] as const,
  list: () => ['labs', 'list'] as const,
};

export function useLabs() {
  return useQuery({
    queryKey: labsQueryKeys.list(),
    queryFn: async () => {
      const res = await apiClient.get('/practice-labs');
      return (res?.data ?? res) as import('../types/lab.types').LabsResponse;
    },
    staleTime: 1000 * 60 * 5,
  });
}
