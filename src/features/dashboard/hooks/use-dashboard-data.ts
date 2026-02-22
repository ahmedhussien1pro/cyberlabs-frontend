import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type {
  WeeklyProgressPoint,
  LeaderboardEntry,
  Goal,
} from '../types/dashboard.types';

const cast = <T>(res: unknown) => res as T;

export const useWeeklyProgress = () =>
  useQuery({
    queryKey: ['dashboard', 'weekly'],
    queryFn: () =>
      apiClient
        .get(API_ENDPOINTS.DASHBOARD.PROGRESS_WEEKLY)
        .then(cast<WeeklyProgressPoint[]>),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

export const useLeaderboard = () =>
  useQuery({
    queryKey: ['dashboard', 'leaderboard'],
    queryFn: () =>
      apiClient
        .get(API_ENDPOINTS.DASHBOARD.LEADERBOARD)
        .then(cast<LeaderboardEntry[]>),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

export const useMyGoals = () =>
  useQuery({
    queryKey: ['goals', 'active'],
    queryFn: () => apiClient.get(API_ENDPOINTS.GOALS.BASE).then(cast<Goal[]>),
    retry: false,
  });
