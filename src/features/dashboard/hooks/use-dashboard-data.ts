// src/features/dashboard/hooks/use-dashboard-data.ts
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { WeeklyProgressPoint, LeaderboardEntry, Goal } from '../types/dashboard.types';

type ApiResponse<T> = { data: T } | T;

const extractData = <T>(res: ApiResponse<T>): T => {
  if (res && typeof res === 'object' && 'data' in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
};

export const useWeeklyProgress = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? ar : enUS;

  return useQuery({
    // ✅ Fix: include language in queryKey so chart refetches on locale switch
    queryKey: ['dashboard', 'weekly', i18n.language],
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.DASHBOARD.PROGRESS_CHART).then((res) => {
        const data = extractData<unknown[]>(res);
        if (!Array.isArray(data)) return [];
        return data.slice(-7).map((d) => {
          const point = d as Record<string, unknown>;
          return {
            // ✅ Fix: use date-fns locale so day names match the active language
            day: format(parseISO(point.date as string), 'EEE', { locale }),
            // ✅ Fix: backend now returns labsCompleted (was always 0 before)
            labs: (point.labsCompleted ?? point.labs ?? 0) as number,
            xp:   (point.xp ?? 0) as number,
          };
        }) as WeeklyProgressPoint[];
      }),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLeaderboard = () =>
  useQuery({
    queryKey: ['dashboard', 'leaderboard'],
    queryFn: () =>
      apiClient
        .get(API_ENDPOINTS.DASHBOARD.LEADERBOARD)
        .then((res) => extractData<LeaderboardEntry[]>(res)),
    retry: 1,
    staleTime: 1000 * 60 * 10,
  });

export const useMyGoals = () =>
  useQuery({
    queryKey: ['goals', 'active'],
    queryFn: () =>
      apiClient
        .get(API_ENDPOINTS.GOALS.BASE)
        .then((res) => extractData<Goal[]>(res)),
    retry: 1,
    staleTime: 1000 * 60 * 2,
  });
