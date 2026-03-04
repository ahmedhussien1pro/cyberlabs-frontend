// src/features/dashboard/hooks/use-dashboard-data.ts
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type {
  WeeklyProgressPoint,
  LeaderboardEntry,
  Goal,
} from '../types/dashboard.types';

const extractData = <T>(res: any): T => {
  return (res?.data !== undefined ? res.data : res) as T;
};

export const useWeeklyProgress = () =>
  useQuery({
    queryKey: ['dashboard', 'weekly'],
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.DASHBOARD.PROGRESS_CHART).then((res) => {
        const data = extractData<any[]>(res);
        if (!Array.isArray(data)) return [];
        // ✅ Fix: labs يجيب من الـ backend مش hardcoded 0
        return data.slice(-7).map((d) => ({
          day: format(parseISO(d.date), 'EEE'),
          labs: d.labs ?? d.labsCompleted ?? 0, // ✅ real data
          xp: d.xp ?? 0,
        })) as WeeklyProgressPoint[];
      }),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

export const useLeaderboard = () =>
  useQuery({
    queryKey: ['dashboard', 'leaderboard'],
    queryFn: () =>
      apiClient
        .get(API_ENDPOINTS.DASHBOARD.LEADERBOARD)
        .then(extractData<LeaderboardEntry[]>),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

export const useMyGoals = () =>
  useQuery({
    queryKey: ['goals', 'active'],
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.GOALS.BASE).then(extractData<Goal[]>),
    retry: false,
    staleTime: 1000 * 60 * 2,
  });
