import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type {
  Session,
  NotificationPrefs,
  EmailChangeResponse,
} from '../types/settings.types';

const extractData = <T>(res: any): T =>
  (res?.data !== undefined ? res.data : res) as T;

export const getSessions = () =>
  apiClient.get(API_ENDPOINTS.USERS.SESSIONS).then(extractData<Session[]>);

export const revokeSession = (id: string) =>
  apiClient.delete(API_ENDPOINTS.USERS.REVOKE_SESSION(id));

export const revokeAllSessions = () =>
  apiClient.delete(API_ENDPOINTS.USERS.SESSIONS);

export const getNotificationPrefs = () =>
  apiClient
    .get(API_ENDPOINTS.USERS.NOTIFICATION_PREFS)
    .then(extractData<NotificationPrefs>);

export const updateNotificationPrefs = (prefs: Partial<NotificationPrefs>) =>
  apiClient
    .put(API_ENDPOINTS.USERS.NOTIFICATION_PREFS, prefs)
    .then(extractData<NotificationPrefs>);

export const exportMyData = () =>
  apiClient
    .post(API_ENDPOINTS.USERS.EXPORT_DATA)
    .then(extractData<{ downloadUrl: string }>);

export const deleteAccount = (password: string) =>
  apiClient.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT, { data: { password } });

// ── Email Change ─────────────────────────────────────────────
export const requestEmailChange = (newEmail: string) =>
  apiClient
    .post(API_ENDPOINTS.USERS.REQUEST_EMAIL_CHANGE, { newEmail })
    .then(extractData<EmailChangeResponse>);

export const verifyEmailChange = (otp: string, token: string) =>
  apiClient
    .post(API_ENDPOINTS.USERS.VERIFY_EMAIL_CHANGE, { otp, token })
    .then(extractData<{ email: string }>);
