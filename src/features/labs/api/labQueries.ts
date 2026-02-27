import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ENV } from '@/shared/constants/env';
import { useLabStore } from '../store/useLabStore';
import { toast } from 'sonner';
import type { LabsResponse } from '../types/lab.types';

const apiClient = axios.create({
  baseURL: `${ENV.API_URL}/practice-labs`,
  withCredentials: true,
});

/* ─────────────────────────────────────────────────────────────────────────
   GET /practice-labs  →  all labs grouped by category (with user progress)
───────────────────────────────────────────────────────────────────────── */
export const useLabsQuery = () =>
  useQuery<LabsResponse>({
    queryKey: ['labs'],
    queryFn: async () => {
      const res = await apiClient.get('/');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

/* ─────────────────────────────────────────────────────────────────────────
   POST /practice-labs/:labId/launch  →  { launchUrl, instanceId, executionMode }
   Opens the sub-app in a new tab
───────────────────────────────────────────────────────────────────────── */
export const useStartLabMutation = () => {
  const { startLab, setLaunching } = useLabStore();

  return useMutation({
    mutationFn: async (labId: string) => {
      const res = await apiClient.post(`/${labId}/launch`);
      return res.data as {
        success: boolean;
        launchUrl: string;
        instanceId: string;
        executionMode: string;
      };
    },
    onMutate: () => setLaunching(true),
    onSuccess: (data, labId) => {
      startLab(labId, data.launchUrl, data.instanceId);
      toast.success('✅ Lab environment ready!');
      window.open(data.launchUrl, '_blank', 'noopener,noreferrer');
    },
    onError: (err: any) => {
      setLaunching(false);
      const msg =
        err?.response?.data?.message ?? 'Failed to start lab. Try again.';
      toast.error(msg);
    },
  });
};

/* ─────────────────────────────────────────────────────────────────────────
   Stop / cleanup (local only — no backend stop endpoint in v2)
───────────────────────────────────────────────────────────────────────── */
export const useStopLabMutation = () => {
  const { stopLab } = useLabStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // v2 has no stop endpoint — lab sessions expire server-side
      return Promise.resolve();
    },
    onSuccess: () => {
      stopLab();
      toast.info('Lab session ended.');
      queryClient.invalidateQueries({ queryKey: ['labs'] });
    },
  });
};
