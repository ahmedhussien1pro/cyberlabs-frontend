import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { updateMyProfile, uploadAvatar } from '../api/profile.api';
import { USER_QUERY_KEYS } from '@/shared/constants/query-keys';
import type { UpdateProfilePayload } from '../types/profile.types';
import type { UserProfile } from '../types/profile.types';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { t } = useTranslation('profile');

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: (updated) => {
      qc.setQueryData<UserProfile>(USER_QUERY_KEYS.me, updated);
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
      toast.success(t('edit.avatarSuccess'));
    },
    onError: (err: Error) => toast.error(err.message || t('edit.avatarError')),
  });
}
