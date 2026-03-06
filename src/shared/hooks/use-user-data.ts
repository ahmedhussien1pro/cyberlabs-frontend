import { useQuery } from '@tanstack/react-query';
import {
  getMyStats,
  getMyPoints,
  getMyLabs,
  getMyCourses,
  getMyActivity,
  getMyPaths,
} from '@/features/profile/api/profile.api';
import { USER_QUERY_KEYS } from '@/shared/constants/query-keys';

// ✅ Fix: added staleTime + retry to all queries
// stats and points are displayed prominently — refresh every 3 min
export const useUserStats = () =>
  useQuery({
    queryKey: USER_QUERY_KEYS.stats,
    queryFn: getMyStats,
    staleTime: 1000 * 60 * 3,
    retry: 1,
  });

export const useUserPoints = () =>
  useQuery({
    queryKey: USER_QUERY_KEYS.points,
    queryFn: getMyPoints,
    staleTime: 1000 * 60 * 3,
    retry: 1,
  });

export const useUserLabs = () =>
  useQuery({
    queryKey: USER_QUERY_KEYS.labs,
    queryFn: getMyLabs,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

export const useUserCourses = () =>
  useQuery({
    queryKey: USER_QUERY_KEYS.courses,
    queryFn: getMyCourses,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

export const useUserActivity = () =>
  useQuery({
    queryKey: USER_QUERY_KEYS.activity,
    queryFn: getMyActivity,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

export const useUserPaths = () =>
  useQuery({
    queryKey: USER_QUERY_KEYS.paths,
    queryFn: getMyPaths,
    retry: 1,
    staleTime: 1000 * 60 * 10,
  });
