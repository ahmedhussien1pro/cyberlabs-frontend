import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useLabStore } from '../store/useLabStore';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: '/api/practice-labs',
  withCredentials: true,
});

export const useStartLabMutation = () => {
  const { startLab } = useLabStore();

  return useMutation({
    mutationFn: async (labId: string) => {
      const response = await apiClient.post(`/${labId}/launch`);
      return response.data; // { launchUrl: "https://labs.cyberlabs.io/launch/xyz", instanceId: "...", executionMode: "..." }
    },
    onSuccess: (data, labId) => {
      // Mark lab as running locally so the user knows it's active
      startLab(labId, data.launchUrl);
      toast.success('تم تجهيز بيئة اللاب بنجاح');

      // Open the lab in a new tab to avoid breaking the dashboard context
      if (data.launchUrl) {
        window.open(data.launchUrl, '_blank');
      }
    },
    onError: () => toast.error('فشل في بدء تشغيل اللاب. حاول مجدداً.'),
  });
};

export const useStopLabMutation = () => {
  const { stopLab, labId } = useLabStore();
  const queryClient = useQueryClient();

  // Using old v1 api route for stopping temporarily, or update if there's a new one
  const v1Client = axios.create({
    baseURL: '/api/v1/labs',
    withCredentials: true,
  });

  return useMutation({
    mutationFn: async () => {
      if (!labId) throw new Error('No active lab');
      await v1Client.post(`/${labId}/stop`);
    },
    onSuccess: () => {
      stopLab();
      toast.info('تم إيقاف بيئة اللاب');
      queryClient.invalidateQueries({ queryKey: ['activeLab'] });
    },
  });
};
