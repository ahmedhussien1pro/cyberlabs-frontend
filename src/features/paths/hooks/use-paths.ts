// src/features/paths/hooks/use-paths.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type {
  LearningPath,
  PathModule,
  PathFilters,
  ModuleType,
  ModuleStatus,
} from '../types/path.types';

const BACKEND_READY = import.meta.env.VITE_PATHS_ENABLED === 'true';

export const pathsQueryKeys = {
  all: ['paths'] as const,
  list: (f: PathFilters) => ['paths', 'list', f] as const,
  detail: (slug: string) => ['paths', 'detail', slug] as const,
};

const normalizeType = (t?: string): ModuleType => {
  const map: Record<string, ModuleType> = {
    COURSE: 'course',
    LAB: 'lab',
    QUIZ: 'quiz',
    PROJECT: 'project',
  };
  return map[t ?? ''] ?? 'course';
};

const normalizeStatus = (s?: string): ModuleStatus => {
  const map: Record<string, ModuleStatus> = {
    PUBLISHED: 'published',
    COMING_SOON: 'coming_soon',
    DRAFT: 'draft',
  };
  return map[s ?? ''] ?? 'published';
};

const normalizeModule = (mod: any): PathModule => ({
  id: mod.id,
  order: mod.order,
  title: mod.title ?? mod.course?.title ?? mod.lab?.title ?? '',
  ar_title: mod.ar_title ?? mod.course?.ar_title ?? mod.lab?.ar_title ?? '',
  description: mod.description ?? mod.course?.description ?? '',
  ar_description: mod.ar_description ?? mod.course?.ar_description ?? '',
  type: normalizeType(mod.type),
  status: normalizeStatus(mod.status),
  estimatedHours:
    mod.estimatedHours ?? mod.course?.duration ?? mod.lab?.duration ?? 0,
  isLocked: mod.isLocked ?? false,
  slug: mod.course?.slug ?? mod.lab?.slug ?? undefined,
  course: mod.course,
  lab: mod.lab,
  userProgress: mod.userProgress,
});

const mapBackendPathToFrontend = (path: any): LearningPath => ({
  ...path,
  difficulty: path.difficulty
    ? path.difficulty.charAt(0) + path.difficulty.slice(1).toLowerCase()
    : 'Beginner',
  color: path.color ? path.color.toLowerCase() : 'blue',
  modules: Array.isArray(path.modules) ? path.modules.map(normalizeModule) : [],
});

export function usePaths(filters: PathFilters = {}) {
  return useQuery({
    queryKey: pathsQueryKeys.list(filters),
    queryFn: async (): Promise<LearningPath[]> => {
      const params: Record<string, string> = {};
      if (filters.difficulty && filters.difficulty !== 'all')
        params.difficulty = filters.difficulty.toUpperCase();
      if (filters.search) params.search = filters.search;

      const res = await apiClient.get(API_ENDPOINTS.PATHS.BASE, { params });
      const items = res.data?.data || res.data || [];
      return items.map(mapBackendPathToFrontend);
    },
    staleTime: 1000 * 60 * 10,
    enabled: BACKEND_READY,
  });
}

export function usePath(slug: string) {
  return useQuery({
    queryKey: pathsQueryKeys.detail(slug),
    queryFn: async (): Promise<LearningPath | null> => {
      const response = await apiClient.get(API_ENDPOINTS.PATHS.BY_SLUG(slug));
      // ✅ Fix: الـ data في response.data لا في response نفسها
      const res = response?.data ?? response;
      if (!res || !res.id) return null;
      return mapBackendPathToFrontend(res);
    },
    enabled: !!slug && BACKEND_READY,
    staleTime: 1000 * 60 * 5,
  });
}
