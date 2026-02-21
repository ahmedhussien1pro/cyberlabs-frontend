import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { updateMyProfile, uploadAvatar } from '../api/profile.api';
import { PROFILE_KEYS } from './use-profile';
import type { UpdateProfilePayload } from '../types/profile.types';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

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
    mutationFn: (file: File) => {
      if (!ALLOWED.includes(file.type)) {
        return Promise.reject(new Error(t('edit.avatarInvalidType')));
      }
      if (file.size > MAX_SIZE) {
        return Promise.reject(new Error(t('edit.avatarTooLarge')));
      }
      return uploadAvatar(file);
    },
    onSuccess: (data) => {
      qc.setQueryData<{ avatarUrl?: string }>(PROFILE_KEYS.me, (old) =>
        old ? { ...old, avatarUrl: data.avatarUrl } : old,
      );
      toast.success(t('edit.avatarSuccess'));
    },
    onError: (err: Error) => toast.error(err.message || t('edit.avatarError')),
  });
}
