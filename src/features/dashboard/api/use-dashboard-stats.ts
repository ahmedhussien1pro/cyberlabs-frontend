// src/features/dashboard/api/use-dashboard-stats.ts

import { useQuery } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { DashboardStatsResponse } from '../types';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async (): Promise<DashboardStatsResponse> => {
      const response = await apiClient.get<DashboardStatsResponse>(
        API_ENDPOINTS.DASHBOARD.STATS,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
};
