import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { Goal, GoalCategory } from '../types/dashboard.types';

function extract<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r?.data !== undefined ? r.data : res) as T;
}

const GOALS_KEY = ['goals', 'my'] as const;

// ── Read ────────────────────────────────────────────────────────
export const useMyGoals = () =>
  useQuery({
    queryKey: GOALS_KEY,
    queryFn: async () => extract<Goal[]>(await apiClient.get(API_ENDPOINTS.GOALS.BASE)),
    retry: 1,
    staleTime: 1000 * 60 * 2,
  });

// ── Create ───────────────────────────────────────────────────────
export interface CreateGoalInput {
  title: string;
  category: GoalCategory;
  targetValue: number;
  unit: string;
  dueDate?: string;
}

export function useCreateGoal() {
  const qc = useQueryClient();
  const { t } = useTranslation('dashboard');
  return useMutation({
    mutationFn: async (input: CreateGoalInput) =>
      extract<Goal>(await apiClient.post(API_ENDPOINTS.GOALS.CREATE, input)),
    onSuccess: (newGoal) => {
      qc.setQueryData<Goal[]>(GOALS_KEY, (prev) => [newGoal, ...(prev ?? [])]);
      toast.success(t('goals.createSuccess'));
    },
    onError: () => toast.error(t('goals.createError')),
  });
}

// ── Complete ─────────────────────────────────────────────────────
export function useCompleteGoal() {
  const qc = useQueryClient();
  const { t } = useTranslation('dashboard');
  return useMutation({
    // ✅ Fix: backend now accepts { isCompleted: true } via UpdateGoalDto
    mutationFn: async (id: string) =>
      extract<Goal>(
        await apiClient.patch(API_ENDPOINTS.GOALS.UPDATE(id), { isCompleted: true }),
      ),
    onSuccess: (updated) => {
      qc.setQueryData<Goal[]>(
        GOALS_KEY,
        (prev) => prev?.map((g) => (g.id === updated.id ? updated : g)) ?? [],
      );
      toast.success(t('goals.completeSuccess'));
    },
    onError: () => toast.error(t('goals.completeError')),
  });
}

// ── Delete ─────────────────────────────────────────────────────────
export function useDeleteGoal() {
  const qc = useQueryClient();
  const { t } = useTranslation('dashboard');
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(API_ENDPOINTS.GOALS.DELETE(id)),
    onSuccess: (_data, id) => {
      qc.setQueryData<Goal[]>(
        GOALS_KEY,
        (prev) => prev?.filter((g) => g.id !== id) ?? [],
      );
      toast.success(t('goals.deleteSuccess'));
    },
    onError: () => toast.error(t('goals.deleteError')),
  });
}
