import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { updateMyProfile, uploadAvatar } from '../api/profile.api';
import { USER_QUERY_KEYS } from '@/shared/constants/query-keys';
import type { UpdateProfilePayload } from '../types/profile.types';
import type { UserProfile } from '../types/profile.types';
import { useAuthStore } from '@/core/store';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { t } = useTranslation('profile');
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: (updated) => {
      qc.setQueryData<UserProfile>(USER_QUERY_KEYS.me, updated);
      
      // Sync the user's name with auth store so navbar updates
      if (updated.name) {
        updateUser({ name: updated.name });
      }
      
      toast.success(t('edit.success'));
    },
    onError: () => toast.error(t('edit.error')),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  const { t } = useTranslation('profile');
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (file: File) => {
      if (!ALLOWED.includes(file.type))
        return Promise.reject(new Error(t('edit.avatarInvalidType')));
      if (file.size > MAX_SIZE)
        return Promise.reject(new Error(t('edit.avatarTooLarge')));
      return uploadAvatar(file);
    },
    onSuccess: (data) => {
      qc.setQueryData<UserProfile>(USER_QUERY_KEYS.me, (old) =>
        old ? { ...old, avatarUrl: data.avatarUrl } : old,
      );
      
      // Sync the user's avatar with auth store so navbar updates immediately
      if (data.avatarUrl) {
        updateUser({ avatar: data.avatarUrl });
      }
      
      toast.success(t('edit.avatarSuccess'));
    },
    onError: (err: Error) => toast.error(err.message || t('edit.avatarError')),
  });
}
