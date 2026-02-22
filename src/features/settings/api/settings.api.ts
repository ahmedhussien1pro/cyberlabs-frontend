import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { Session, NotificationPrefs } from '../types/settings.types';

const cast = <T>(res: unknown) => res as T;

export const getSessions = () =>
  apiClient.get(API_ENDPOINTS.USERS.SESSIONS).then(cast<Session[]>);

export const revokeSession = (id: string) =>
  apiClient.delete(API_ENDPOINTS.USERS.REVOKE_SESSION(id));

export const revokeAllSessions = () =>
  apiClient.delete(API_ENDPOINTS.USERS.SESSIONS);

export const getNotificationPrefs = () =>
  apiClient
    .get(API_ENDPOINTS.USERS.NOTIFICATION_PREFS)
    .then(cast<NotificationPrefs>);

export const updateNotificationPrefs = (prefs: Partial<NotificationPrefs>) =>
  apiClient
    .put(API_ENDPOINTS.USERS.NOTIFICATION_PREFS, prefs)
    .then(cast<NotificationPrefs>);

export const exportMyData = () =>
  apiClient
    .post(API_ENDPOINTS.USERS.EXPORT_DATA)
    .then(cast<{ downloadUrl: string }>);

export const deleteAccount = (password: string) =>
  apiClient.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT, { data: { password } });
