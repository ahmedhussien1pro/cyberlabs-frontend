// src/features/dashboard/api/use-leaderboard.ts

import { useQuery } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { LeaderboardResponse } from '../types';

export const useLeaderboard = (limit = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'leaderboard', limit],
    queryFn: async (): Promise<LeaderboardResponse> => {
      const response = await apiClient.get<LeaderboardResponse>(
        API_ENDPOINTS.DASHBOARD.LEADERBOARD,
        { params: { limit } },
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
