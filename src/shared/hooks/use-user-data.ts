import { useQuery } from '@tanstack/react-query';
import {
  getMyStats,
  getMyPoints,
  getMyLabs,
  getMyCourses,
  getMyActivity,
} from '@/features/profile/api/profile.api';
import { USER_QUERY_KEYS } from '@/shared/constants/query-keys';

export const useUserStats = () =>
  useQuery({ queryKey: USER_QUERY_KEYS.stats, queryFn: getMyStats });

export const useUserPoints = () =>
  useQuery({ queryKey: USER_QUERY_KEYS.points, queryFn: getMyPoints });

export const useUserLabs = () =>
  useQuery({ queryKey: USER_QUERY_KEYS.labs, queryFn: getMyLabs });

export const useUserCourses = () =>
  useQuery({ queryKey: USER_QUERY_KEYS.courses, queryFn: getMyCourses });

export const useUserActivity = () =>
  useQuery({
    queryKey: USER_QUERY_KEYS.activity,
    queryFn: getMyActivity,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
