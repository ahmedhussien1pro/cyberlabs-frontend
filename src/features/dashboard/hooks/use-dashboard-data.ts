import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type {
  WeeklyProgressPoint,
  LeaderboardEntry,
  Goal,
} from '../types/dashboard.types';

// The apiClient interceptor returns response.data directly.
// Depending on backend structure, sometimes it wraps arrays in { data: [...] }
const extractData = <T>(res: any): T => {
  return (res?.data !== undefined ? res.data : res) as T;
};

export const useWeeklyProgress = () =>
  useQuery({
    queryKey: ['dashboard', 'weekly'],
    queryFn: () =>
      apiClient
        .get(API_ENDPOINTS.DASHBOARD.PROGRESS_CHART)
        .then((res) => {
          const data = extractData<any[]>(res);
          // Take the last 7 days of the 30-day chart data to display in the weekly bar chart
          if (!Array.isArray(data)) return [];
          return data.slice(-7).map((d) => ({
            day: format(parseISO(d.date), 'EEE'), // 'Mon', 'Tue'
            labs: 0,
            xp: d.xp,
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
    queryFn: () => apiClient.get(API_ENDPOINTS.GOALS.BASE).then(extractData<Goal[]>),
    retry: false,
  });
