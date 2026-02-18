import { useQuery } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { ProgressResponse } from '../types';

export const useProgress = (
  period: 'weekly' | 'monthly' | 'yearly' = 'weekly',
) => {
  return useQuery({
    queryKey: ['dashboard', 'progress', period],
    queryFn: async (): Promise<ProgressResponse> => {
      const endpoint =
        period === 'weekly'
          ? API_ENDPOINTS.DASHBOARD.PROGRESS_WEEKLY
          : period === 'monthly'
            ? API_ENDPOINTS.DASHBOARD.PROGRESS_MONTHLY
            : API_ENDPOINTS.DASHBOARD.PROGRESS_CHART;

      const response = await apiClient.get<ProgressResponse>(endpoint);
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};
