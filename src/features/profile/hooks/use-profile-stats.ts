import { useQuery } from '@tanstack/react-query';
import {
  getMyStats,
  getMyLabs,
  getMyCourses,
  getMyActivity,
} from '../api/profile.api';

export function useProfileStats() {
  return useQuery({ queryKey: ['profile', 'stats'], queryFn: getMyStats });
}
export function useProfileLabs() {
  return useQuery({ queryKey: ['profile', 'labs'], queryFn: getMyLabs });
}
export function useProfileCourses() {
  return useQuery({ queryKey: ['profile', 'courses'], queryFn: getMyCourses });
}
export function useProfileActivity() {
  return useQuery({
    queryKey: ['profile', 'activity'],
    queryFn: getMyActivity,
  });
}
