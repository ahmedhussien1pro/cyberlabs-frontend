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

/**
 * Extract a human-readable error message from whatever the API throws.
 *
 * The apiClient interceptor transforms Axios errors into ApiError objects:
 *   { message: string, statusCode: number, errors?: ... }
 *
 * Raw Axios errors (e.g. from uploadToR2 via plain axios) have:
 *   { response: { data: { message: string } } }
 *
 * Both cases are handled here.
 */
function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null;
  const e = err as Record<string, unknown>;

  // ApiError format — produced by apiClient response interceptor
  if (typeof e.message === 'string' && typeof e.statusCode === 'number') {
    return e.message;
  }

  // Raw Axios error format — from plain axios.put (uploadToR2)
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
       * Step 1 — Optimistic cache update.
       * Immediately updates every component subscribed to USER_QUERY_KEYS.me
       * (ProfileHero, EditAvatar, Navbar) without waiting for a network round-trip.
       * The `key={avatarUrl}` on AvatarImage forces Radix to remount and
       * reload the image when this new URL reaches the component as a prop.
       */
      qc.setQueryData<UserProfile>(USER_QUERY_KEYS.me, (old) =>
        old ? { ...old, avatarUrl: data.avatarUrl } : old,
      );

      /**
       * Step 2 — Background refetch to get the authoritative server state.
       * Runs silently; the optimistic update above keeps the UI snappy.
       */
      void qc.invalidateQueries({ queryKey: USER_QUERY_KEYS.me });

      // Step 3 — Sync navbar/auth store avatar immediately.
      if (data.avatarUrl) {
        updateUser({ avatar: data.avatarUrl });
      }

      toast.success(t('edit.avatarSuccess'));
    },
    onError: (err: unknown) => {
      const msg =
        extractApiError(err) ||
        (err instanceof Error ? err.message : null) ||
        t('edit.avatarError');
      toast.error(msg);
    },
  });
}
