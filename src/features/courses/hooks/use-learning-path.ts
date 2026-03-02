import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../services/courses.api';

export const useLearningPaths = (filters?: {
  page?: number;
  limit?: number;
  difficulty?: string;
  search?: string;
}) =>
  useQuery({
    queryKey: ['learning-paths', filters],
    queryFn: () => coursesApi.listPaths(filters),
    staleTime: 5 * 60 * 1000,
  });

export const useLearningPath = (slug: string) =>
  useQuery({
    queryKey: ['learning-path', slug],
    queryFn: () => coursesApi.getPath(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

export const useEnrollPath = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => coursesApi.enrollPath(slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ['learning-path', slug] });
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
    },
  });
};
