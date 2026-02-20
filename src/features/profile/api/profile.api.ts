// src/features/profile/api/profile.api.ts
import { apiClient } from '@/core/api/client';
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
// NOTE: Backend needs to add this endpoint → GET /users/me/activity
export const getMyActivity = () =>
  apiClient.get('/users/me/activity').then(unwrap<UserActivity[]>);

export const getPublicProfile = (id: string) =>
  apiClient.get(`/users/${id}`).then(unwrap<UserProfile>);

export const updateMyProfile = (payload: UpdateProfilePayload) =>
  apiClient.put('/users/me', payload).then(unwrap<UserProfile>);

// NOTE: Backend needs → POST /users/me/avatar (multipart/form-data)
export const uploadAvatar = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return apiClient
    .post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(unwrap<{ avatarUrl: string }>);
};
