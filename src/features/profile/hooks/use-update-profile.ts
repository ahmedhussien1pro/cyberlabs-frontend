// src/features/profile/hooks/use-update-profile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { updateMyProfile, uploadAvatar } from '../api/profile.api';
import { USER_QUERY_KEYS } from '@/shared/constants/query-keys';
import type { UpdateProfilePayload, UserProfile } from '../types/profile.types';
import { useAuthStore } from '@/core/store';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

/** Extract a readable message from an Axios error response */
function extractApiError(err: unknown): string | null {
  const e = err as Record<string, unknown>;
  const data = (e?.response as Record<string, unknown>)?.data as
    | Record<string, unknown>
    | undefined;
  const msg = data?.message;
  if (!msg) return null;
  if (Array.isArray(msg)) return msg.join(' — ');
  return String(msg);
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { t } = useTranslation('profile');
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: (updated) => {
      qc.setQueryData<UserProfile>(USER_QUERY_KEYS.me, updated);
      if (updated.name) updateUser({ name: updated.name });
      toast.success(t('edit.success'));
    },
    onError: (err: unknown) => {
      const msg = extractApiError(err) ?? t('edit.error');
      toast.error(msg);
    },
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
      /**
       * Step 1: Optimistic cache update — instant UI feedback, no network wait.
       * This re-renders every component subscribed to USER_QUERY_KEYS.me,
       * including ProfileHero and EditAvatar.
       */
      qc.setQueryData<UserProfile>(USER_QUERY_KEYS.me, (old) =>
        old ? { ...old, avatarUrl: data.avatarUrl } : old,
      );

      /**
       * Step 2: Invalidate to get a fresh authoritative profile from the server.
       * Runs in background — the optimistic update above keeps the UI snappy.
       */
      void qc.invalidateQueries({ queryKey: USER_QUERY_KEYS.me });

      // Step 3: Sync navbar avatar immediately via auth store
      if (data.avatarUrl) {
        updateUser({ avatar: data.avatarUrl });
      }

      toast.success(t('edit.avatarSuccess'));
    },
    onError: (err: Error) => toast.error(err.message || t('edit.avatarError')),
  });
}
