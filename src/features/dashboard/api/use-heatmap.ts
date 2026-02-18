// src/features/dashboard/api/use-heatmap.ts

import { useQuery } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { HeatmapResponse } from '../types';

export const useHeatmap = (year?: number) => {
  return useQuery({
    queryKey: ['dashboard', 'heatmap', year],
    queryFn: async (): Promise<HeatmapResponse> => {
      const response = await apiClient.get<HeatmapResponse>(
        API_ENDPOINTS.DASHBOARD.HEATMAP,
        { params: year ? { year } : undefined },
      );
      return response.data;
    },
    staleTime: 15 * 60 * 1000,
  });
};
