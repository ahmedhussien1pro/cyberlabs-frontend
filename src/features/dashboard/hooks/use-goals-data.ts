import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { Goal, GoalCategory } from '../types/dashboard.types';

const extractData = <T>(res: any): T => {
  return (res?.data !== undefined ? res.data : res) as T;
};

const GOALS_KEY = ['goals', 'my'] as const;

/** ── Read ─────────────────────────── */
export const useMyGoals = () =>
  useQuery({
    queryKey: GOALS_KEY,
    queryFn: () => apiClient.get(API_ENDPOINTS.GOALS.BASE).then(extractData<Goal[]>),
    retry: false,
  });

/** ── Create ───────────────────────── */
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
    mutationFn: (input: CreateGoalInput) =>
      apiClient.post(API_ENDPOINTS.GOALS.CREATE, input).then(extractData<Goal>),
    onSuccess: (newGoal) => {
      qc.setQueryData<Goal[]>(GOALS_KEY, (prev) => [newGoal, ...(prev ?? [])]);
      toast.success(t('goals.createSuccess'));
    },
    onError: () => toast.error(t('goals.createError')),
  });
}

/** ── Complete ──────────────────────── */
export function useCompleteGoal() {
  const qc = useQueryClient();
  const { t } = useTranslation('dashboard');
  return useMutation({
    mutationFn: (id: string) =>
      apiClient
        .patch(API_ENDPOINTS.GOALS.UPDATE(id), { isCompleted: true })
        .then(extractData<Goal>),
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

/** ── Delete ────────────────────────── */
export function useDeleteGoal() {
  const qc = useQueryClient();
  const { t } = useTranslation('dashboard');
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(API_ENDPOINTS.GOALS.DELETE(id)),
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
