// src/features/search/api/search.api.ts
import { apiClient } from '@/core/api';
import { API_ENDPOINTS } from '@/core/api/endpoints';

// ─── Types ───────────────────────────────────────────────────────────────────────

export type SearchResultType = 'course' | 'lab' | 'path' | 'challenge';

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  /** slug بيتحول لـ ROUTES.*.DETAIL(slug) */
  slug: string;
  imageUrl?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  query: string;
}

// ─── API call ───────────────────────────────────────────────────────────────────

/**
 * Global search across courses, labs, paths, and challenges.
 *
 * Backend endpoint: GET /search?q=<query>&limit=<n>
 *
 * @param query - النص المبحوث عنه (حد أدنى: 2 حروف — مطبّق في السيوط المستخدم)
 * @param limit  - عدد النتائج المطلوبة (default 10)
 */
export async function globalSearch(
  query: string,
  limit = 10,
): Promise<SearchResponse> {
  const { data } = await apiClient.get<SearchResponse>(
    API_ENDPOINTS.SEARCH.GLOBAL,
    { params: { q: query.trim(), limit } },
  );
  return data;
}
