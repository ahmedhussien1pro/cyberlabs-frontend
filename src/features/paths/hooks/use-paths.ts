import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { MOCK_PATHS } from '../data/mock-paths';
import type { LearningPath, PathFilters } from '../types/path.types';

const BACKEND_READY = import.meta.env.VITE_PATHS_ENABLED === 'true';

export const pathsQueryKeys = {
  all: ['paths'] as const,
  list: (f: PathFilters) => ['paths', 'list', f] as const,
  detail: (slug: string) => ['paths', 'detail', slug] as const,
};

// ── All paths (list) ───────────────────────────────────────────────────
export function usePaths(filters: PathFilters = {}) {
  return useQuery({
    queryKey: pathsQueryKeys.list(filters),
    queryFn: async (): Promise<LearningPath[]> => {
      if (!BACKEND_READY) {
        let data = [...MOCK_PATHS];
        if (filters.difficulty && filters.difficulty !== 'all') {
          data = data.filter((p) => p.difficulty === filters.difficulty);
        }
        if (filters.search) {
          const q = filters.search.toLowerCase();
          data = data.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.ar_title.includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q)),
          );
        }
        return data;
      }
      const params: Record<string, string> = {};
      if (filters.difficulty && filters.difficulty !== 'all')
        params.difficulty = filters.difficulty;
      if (filters.search) params.search = filters.search;
      const res = await apiClient.get(API_ENDPOINTS.PATHS.BASE, { params });
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

// ── Single path ────────────────────────────────────────────────────────
export function usePath(slug: string) {
  return useQuery({
    queryKey: pathsQueryKeys.detail(slug),
    queryFn: async (): Promise<LearningPath | null> => {
      if (!BACKEND_READY) {
        return MOCK_PATHS.find((p) => p.slug === slug) ?? null;
      }
      const res = await apiClient.get(API_ENDPOINTS.PATHS.BY_SLUG(slug));
      return res.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
