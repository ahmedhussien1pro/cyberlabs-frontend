// src/features/dashboard/api/use-goals.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { LearningGoal, GoalsResponse } from '../types';
import { toast } from 'sonner';

export const useGoals = () => {
  return useQuery({
    queryKey: ['dashboard', 'goals'],
    queryFn: async (): Promise<LearningGoal[]> => {
      const response = await apiClient.get<GoalsResponse>(
        API_ENDPOINTS.GOALS.BASE,
      );
      return response.data.goals || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: Omit<LearningGoal, 'id' | 'createdAt'>) => {
      const response = await apiClient.post<LearningGoal>(
        API_ENDPOINTS.GOALS.CREATE,
        goal,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'goals'] });
      toast.success('Goal created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create goal');
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<LearningGoal>;
    }) => {
      const response = await apiClient.put<LearningGoal>(
        API_ENDPOINTS.GOALS.UPDATE(id),
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'goals'] });
      toast.success('Goal updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update goal');
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.GOALS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'goals'] });
      toast.success('Goal deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete goal');
    },
  });
};
