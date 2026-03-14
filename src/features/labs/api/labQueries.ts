// src/features/labs/api/labQueries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { tokenManager } from '@/features/auth/utils';
import { useLabStore } from '../store/useLabStore';
import { toast } from 'sonner';
import type { LabsResponse } from '../types/lab.types';

/* ─────────────────────────────────────────────────────────────────────────
   GET /practice-labs  →  labs grouped by category + user progress
───────────────────────────────────────────────────────────────────────── */
export const useLabsQuery = () =>
  useQuery<LabsResponse>({
    queryKey: ['labs'],
    queryFn: async () => {
      return apiClient.get('/practice-labs') as Promise<LabsResponse>;
    },
    staleTime: 1000 * 60 * 5,
  });

/* ─────────────────────────────────────────────────────────────────────────
   GET /practice-labs/:labId  →  single lab detail
───────────────────────────────────────────────────────────────────────── */
export const useLabDetailQuery = (labId: string | undefined) =>
  useQuery<{ success: boolean; lab: any }>({
    queryKey: ['lab', labId],
    queryFn: async () => {
      return apiClient.get(`/practice-labs/${labId}`) as Promise<{
        success: boolean;
        lab: any;
      }>;
    },
    enabled: !!labId,
    staleTime: 1000 * 60 * 2,
  });

/* ─────────────────────────────────────────────────────────────────────────
   POST /practice-labs/:labId/launch  →  { launchUrl, instanceId, executionMode }
───────────────────────────────────────────────────────────────────────── */
export const useStartLabMutation = () => {
  const { startLab, setLaunching } = useLabStore();

  return useMutation({
    mutationFn: async (labId: string) => {
      return apiClient.post(`/practice-labs/${labId}/launch`) as Promise<{
        success: boolean;
        launchUrl: string;
        instanceId: string;
        executionMode: string;
      }>;
    },
    onMutate: () => setLaunching(true),
    onSuccess: (data, labId) => {
      startLab(labId, data.launchUrl, data.instanceId);
      toast.success('Lab environment is ready!');

      // Pass accessToken via URL hash — never sent to server,
      // cleared immediately by the labs frontend.
      void (async () => {
        const at = await tokenManager.getAccessToken();
        const url = at ? `${data.launchUrl}#at=${at}` : data.launchUrl;
        window.open(url, '_blank', 'noopener,noreferrer');
      })();
    },
    onError: (err: any) => {
      setLaunching(false);
      const msg = err?.message ?? 'Failed to start lab. Try again.';
      toast.error(msg);
    },
  });
};

/* ─────────────────────────────────────────────────────────────────────────
   Stop (local only — v2 has no stop endpoint)
───────────────────────────────────────────────────────────────────────── */
export const useStopLabMutation = () => {
  const { stopLab } = useLabStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      stopLab();
      toast.info('Lab session ended.');
      queryClient.invalidateQueries({ queryKey: ['labs'] });
    },
  });
};
