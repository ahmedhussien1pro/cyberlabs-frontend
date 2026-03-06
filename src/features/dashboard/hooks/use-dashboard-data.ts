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

// ✅ Fix: replaced `any` with a proper generic type
type ApiResponse<T> = { data: T } | T;

const extractData = <T>(res: ApiResponse<T>): T => {
  if (res && typeof res === 'object' && 'data' in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
};

export const useWeeklyProgress = () =>
  useQuery({
    queryKey: ['dashboard', 'weekly'],
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.DASHBOARD.PROGRESS_CHART).then((res) => {
        const data = extractData<unknown[]>(res);
        if (!Array.isArray(data)) return [];
        return data.slice(-7).map((d) => {
          const point = d as Record<string, unknown>;
          return {
            day: format(parseISO(point.date as string), 'EEE'),
            labs: (point.labs ?? point.labsCompleted ?? 0) as number,
            xp: (point.xp ?? 0) as number,
          };
        }) as WeeklyProgressPoint[];
      }),
    retry: 1, // ✅ Fix: retry once on failure instead of never
    staleTime: 1000 * 60 * 5,
  });

export const useLeaderboard = () =>
  useQuery({
    queryKey: ['dashboard', 'leaderboard'],
    queryFn: () =>
      apiClient
        .get(API_ENDPOINTS.DASHBOARD.LEADERBOARD)
        // ✅ Fix: was `.then(extractData<T>)` which passes the function ref, not calling it
        .then((res) => extractData<LeaderboardEntry[]>(res)),
    retry: 1, // ✅ Fix: retry once on failure
    staleTime: 1000 * 60 * 10,
  });

export const useMyGoals = () =>
  useQuery({
    queryKey: ['goals', 'active'],
    queryFn: () =>
      apiClient
        .get(API_ENDPOINTS.GOALS.BASE)
        .then((res) => extractData<Goal[]>(res)),
    retry: 1, // ✅ Fix: retry once on failure
    staleTime: 1000 * 60 * 2,
  });
