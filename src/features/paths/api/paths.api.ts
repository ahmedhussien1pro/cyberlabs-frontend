// src/features/paths/api/paths.api.ts
//
// Single source of truth for all paths-related HTTP calls.
// Hooks import from here — never call apiClient directly in hooks.

import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { LearningPath } from '../types';
import { mapBackendPath } from '../utils/path-mapper';

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function fetchPaths(params: Record<string, string> = {}): Promise<LearningPath[]> {
  const res = await apiClient.get(API_ENDPOINTS.PATHS.BASE, { params });
  const items: unknown[] = res.data?.data ?? res.data ?? [];
  return (Array.isArray(items) ? items : []).map(mapBackendPath);
}

export async function fetchPathBySlug(slug: string): Promise<LearningPath | null> {
  const res = await apiClient.get(API_ENDPOINTS.PATHS.BY_SLUG(slug));
  const data = res?.data ?? res;
  if (!data || !data.id) return null;
  return mapBackendPath(data);
}
