import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { updateMyProfile, uploadAvatar } from '../api/profile.api';
import { PROFILE_KEYS } from './use-profile';
import type { UpdateProfilePayload } from '../types/profile.types';

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { t } = useTranslation('profile');
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: (updated) => {
      qc.setQueryData(PROFILE_KEYS.me, updated);
      toast.success(t('edit.success'));
    },
    onError: () => toast.error(t('edit.error')),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  const { t } = useTranslation('profile');
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_KEYS.me });
      toast.success(t('edit.avatarSuccess'));
    },
    onError: () => toast.error(t('edit.avatarError')),
  });
}
