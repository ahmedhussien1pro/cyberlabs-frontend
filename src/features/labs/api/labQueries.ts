import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useLabStore } from '../store/useLabStore';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: '/api/v1/labs',
  withCredentials: true,
});

export const useStartLabMutation = () => {
  const { startLab } = useLabStore();

  return useMutation({
    mutationFn: async (labId: string) => {
      const response = await apiClient.post(`/${labId}/start`);
      return response.data; // { containerUrl: "https://xxx.labs.cyberlabs.com" }
    },
    onSuccess: (data, labId) => {
      startLab(labId, data.containerUrl);
      toast.success('تم تشغيل بيئة اللاب بنجاح');
    },
    onError: () => toast.error('فشل في بدء تشغيل اللاب. حاول مجدداً.'),
  });
};

export const useStopLabMutation = () => {
  const { stopLab, labId } = useLabStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!labId) throw new Error('No active lab');
      await apiClient.post(`/${labId}/stop`);
    },
    onSuccess: () => {
      stopLab();
      toast.info('تم تدمير بيئة اللاب');
      queryClient.invalidateQueries({ queryKey: ['activeLab'] });
    },
  });
};
