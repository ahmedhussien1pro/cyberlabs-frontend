// src/features/profile/api/profile.api.ts
import { apiClient } from '@/core/api/client';
import axios from 'axios';
import type {
  UserProfile,
  UpdateProfilePayload,
  UserCareerPath,
} from '../types/profile.types';
import type {
  UserStats,
  UserPoints,
  CompletedLab,
  EnrolledCourse,
  UserActivity,
} from '@/shared/types/user.types';

// ✅ Fix: typed extractor — no more `any` parameter
function extract<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r?.data !== undefined ? r.data : res) as T;
}

// ─── GET ─────────────────────────────────────────────────────────────────────
export const getMyProfile = async () =>
  extract<UserProfile>(await apiClient.get('/users/me'));

export const getMyStats = async () =>
  extract<UserStats>(await apiClient.get('/users/me/stats'));

export const getMyPoints = async () =>
  extract<UserPoints>(await apiClient.get('/users/me/points'));

export const getMyLabs = async () =>
  extract<CompletedLab[]>(await apiClient.get('/users/me/labs'));

export const getMyCourses = async () =>
  extract<EnrolledCourse[]>(await apiClient.get('/users/me/courses'));

export const getMyActivity = async () =>
  extract<UserActivity[]>(await apiClient.get('/users/me/activity'));

// ✅ Paths: pulls from profile — switch to a dedicated endpoint once backend adds /users/me/paths
export const getMyPaths = async (): Promise<UserCareerPath[]> => {
  const profile = await getMyProfile();
  return profile.careerPaths ?? [];
};

// ─── Public ──────────────────────────────────────────────────────────────────
export const getPublicProfile = async (id: string) =>
  extract<UserProfile>(await apiClient.get(`/users/${id}`));

// ─── Mutations ───────────────────────────────────────────────────────────────
export const updateMyProfile = async (payload: UpdateProfilePayload) =>
  extract<UserProfile>(await apiClient.put('/users/me', payload));

// ─── Avatar upload (R2 presign flow) ─────────────────────────────────────────
const presignAvatar = async (contentType: string) =>
  extract<{ uploadUrl: string; key: string; publicUrl: string }>(
    await apiClient.post('/users/me/avatar/presign', { contentType }),
  );

const uploadToR2 = (uploadUrl: string, file: File) => {
  if (!uploadUrl?.startsWith('http')) {
    throw new Error(
      'R2 not configured — set R2_* env vars in the backend .env',
    );
  }
  return axios.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type },
  });
};

const confirmAvatar = async (key: string) =>
  extract<{ avatarUrl: string }>(
    await apiClient.post('/users/me/avatar/confirm', { key }),
  );

export const uploadAvatar = async (
  file: File,
): Promise<{ avatarUrl: string }> => {
  const { uploadUrl, key } = await presignAvatar(file.type);
  await uploadToR2(uploadUrl, file);
  return confirmAvatar(key);
};
