// src/features/dashboard/api/use-active-labs.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { ActiveLabsResponse } from '../types';
import { toast } from 'sonner';

export const useActiveLabs = () => {
  return useQuery({
    queryKey: ['dashboard', 'active-labs'],
    queryFn: async (): Promise<ActiveLabsResponse> => {
      const response = await apiClient.get<ActiveLabsResponse>(
        API_ENDPOINTS.DASHBOARD.ACTIVE_LABS,
      );
      return response.data;
    },
    staleTime: 3 * 60 * 1000,
  });
};

export const useStartLab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labId: string) => {
      const response = await apiClient.post(API_ENDPOINTS.LABS.START(labId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'active-labs'] });
      toast.success('Lab started successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to start lab');
    },
  });
};
