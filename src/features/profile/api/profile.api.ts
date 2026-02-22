import { apiClient } from '@/core/api/client';
import axios from 'axios';
import type { UserProfile, UpdateProfilePayload } from '../types/profile.types';
import type {
  UserStats,
  UserPoints,
  CompletedLab,
  EnrolledCourse,
  UserActivity,
} from '@/shared/types/user.types';

const unwrap = <T>(res: unknown) => (res as { data: T }).data;

// ─── GET ─────────────────────────────────────────────────────────────────────
export const getMyProfile = () =>
  apiClient.get('/users/me').then(unwrap<UserProfile>);
export const getMyStats = () =>
  apiClient.get('/users/me/stats').then(unwrap<UserStats>);
export const getMyPoints = () =>
  apiClient.get('/users/me/points').then(unwrap<UserPoints>);
export const getMyLabs = () =>
  apiClient.get('/users/me/labs').then(unwrap<CompletedLab[]>);
export const getMyCourses = () =>
  apiClient.get('/users/me/courses').then(unwrap<EnrolledCourse[]>);
export const getMyActivity = () =>
  apiClient.get('/users/me/activity').then(unwrap<UserActivity[]>);

// ─── Public ──────────────────────────────────────────────────────────────────
export const getPublicProfile = (id: string) =>
  apiClient.get(`/users/${id}`).then(unwrap<UserProfile>);

// ─── Mutations ───────────────────────────────────────────────────────────────
export const updateMyProfile = (payload: UpdateProfilePayload) =>
  apiClient.put('/users/me', payload).then(unwrap<UserProfile>);

// ─── Avatar upload (R2 presign flow) ─────────────────────────────────────────
const presignAvatar = (contentType: string) =>
  apiClient
    .post('/users/me/avatar/presign', { contentType })
    .then(unwrap<{ uploadUrl: string; key: string; publicUrl: string }>);

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

const confirmAvatar = (key: string) =>
  apiClient
    .post('/users/me/avatar/confirm', { key })
    .then(unwrap<{ avatarUrl: string }>);

export const uploadAvatar = async (
  file: File,
): Promise<{ avatarUrl: string }> => {
  const { uploadUrl, key } = await presignAvatar(file.type);
  await uploadToR2(uploadUrl, file);
  return confirmAvatar(key);
};
