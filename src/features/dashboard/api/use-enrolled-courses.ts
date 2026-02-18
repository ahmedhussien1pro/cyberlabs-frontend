// src/features/dashboard/api/use-enrolled-courses.ts

import { useQuery } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { EnrolledCoursesResponse } from '../types';

export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: ['dashboard', 'enrolled-courses'],
    queryFn: async (): Promise<EnrolledCoursesResponse> => {
      const response = await apiClient.get<EnrolledCoursesResponse>(
        API_ENDPOINTS.DASHBOARD.ENROLLED_COURSES,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
