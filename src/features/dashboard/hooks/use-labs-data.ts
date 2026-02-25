import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { LabStatus, UserLab } from '../types/dashboard.types';

const extractData = <T>(res: any): T => {
  return (res?.data !== undefined ? res.data : res) as T;
};

export const MY_LABS_KEY = (status: LabStatus | 'all') =>
  ['user', 'labs', status] as const;

export function useMyLabs(status: LabStatus | 'all' = 'all') {
  return useQuery({
    queryKey: MY_LABS_KEY(status),
    queryFn: () =>
      apiClient
        .get(API_ENDPOINTS.LABS.BASE, {
          params: status !== 'all' ? { status } : undefined,
        })
        .then(extractData<UserLab[]>),
    retry: false,
    staleTime: 1000 * 60 * 3,
  });
}
