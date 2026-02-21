import { apiClient } from '@/core/api/client';
import axios from 'axios';
import type {
  UserProfile,
  UserStats,
  UserPoints,
  CompletedLab,
  EnrolledCourse,
  UserActivity,
  UpdateProfilePayload,
} from '../types/profile.types';

const unwrap = <T>(res: unknown) => (res as { data: T }).data;

/* ─── GET endpoints ─────────────────────────── */
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

/* ─── Public ────────────────────────────────── */
export const getPublicProfile = (id: string) =>
  apiClient.get(`/users/${id}`).then(unwrap<UserProfile>);

/* ─── Mutations ─────────────────────────────── */
export const updateMyProfile = (payload: UpdateProfilePayload) =>
  apiClient.put('/users/me', payload).then(unwrap<UserProfile>);

const presignAvatar = (contentType: string) =>
  apiClient
    .post('/users/me/avatar/presign', { contentType })
    .then(unwrap<{ presignedUrl: string; key: string }>);

const uploadToR2 = (presignedUrl: string, file: File) =>
  axios.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type },
  });

const confirmAvatar = (key: string) =>
  apiClient
    .post('/users/me/avatar/confirm', { key })
    .then(unwrap<{ avatarUrl: string }>);

export const uploadAvatar = async (
  file: File,
): Promise<{ avatarUrl: string }> => {
  const { presignedUrl, key } = await presignAvatar(file.type);
  await uploadToR2(presignedUrl, file);
  return confirmAvatar(key);
};
