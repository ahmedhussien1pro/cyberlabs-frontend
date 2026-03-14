// src/features/paths/hooks/use-paths.ts
import { useQuery } from '@tanstack/react-query';
import type { PathFilters, LearningPath } from '../types';
import { fetchPaths, fetchPathBySlug } from '../api';

// ─── Query keys ───────────────────────────────────────────────────────────────
export const pathsQueryKeys = {
  all: ['paths'] as const,
  list: (f: PathFilters) => ['paths', 'list', f] as const,
  detail: (slug: string) => ['paths', 'detail', slug] as const,
} as const;

// ─── List ─────────────────────────────────────────────────────────────────────
export function usePaths(filters: PathFilters = {}) {
  return useQuery({
    queryKey: pathsQueryKeys.list(filters),
    queryFn: async (): Promise<LearningPath[]> => {
      const params: Record<string, string> = {};
      if (filters.difficulty && filters.difficulty !== 'all')
        params.difficulty = filters.difficulty.toUpperCase();
      if (filters.search) params.search = filters.search;
      return fetchPaths(params);
    },
    staleTime: 1000 * 60 * 10, // 10 min
  });
}

// ─── Detail ───────────────────────────────────────────────────────────────────
export function usePath(slug: string) {
  return useQuery({
    queryKey: pathsQueryKeys.detail(slug),
    queryFn: (): Promise<LearningPath | null> => fetchPathBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
