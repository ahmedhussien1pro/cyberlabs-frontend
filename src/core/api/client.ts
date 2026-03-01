// src/core/api/client.ts

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/shared/constants';
import type { ApiError, ApiResponse } from '@/core/types';
import { tokenManager, requestQueue } from '@/features/auth/utils';
import { API_ENDPOINTS } from './endpoints';

/**
 * Cookie mode  → *.cyber-labs.tech (prod / test)
 *   refreshToken lives in httpOnly cookie, sent automatically via withCredentials
 * Legacy mode  → localhost (dev)
 *   refreshToken lives in localStorage (encrypted), sent in request body
 */
const isCookieMode = (): boolean =>
  typeof window !== 'undefined' &&
  window.location.hostname.endsWith('cyber-labs.tech');

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // required for cookie mode; harmless in legacy mode
});

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRF-Token';

// ── Request interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenManager.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor (401 → token refresh) ───────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,

  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // ── If a refresh is already in progress, wait for it ─────────────────
      const ongoingRefresh = tokenManager.getRefreshPromise();
      if (ongoingRefresh) {
        try {
          const newToken = await ongoingRefresh;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // ── Start a new refresh ───────────────────────────────────────────────
      try {
        const cookieMode = isCookieMode();

        // In legacy (localhost) mode: read refreshToken from localStorage
        // In cookie mode: it's in the httpOnly cookie, sent automatically
        const storedRefreshToken = cookieMode
          ? null
          : await tokenManager.getRefreshToken();

        if (!cookieMode && !storedRefreshToken) {
          // No way to refresh → go to login
          return Promise.reject({ message: 'Unauthorized', statusCode: 401 });
        }

        const refreshPromise = axios
          .post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            `${ENV.API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
            // Cookie mode: empty body (cookie goes automatically via withCredentials)
            // Legacy mode: refreshToken in body
            cookieMode ? {} : { refreshToken: storedRefreshToken },
            { withCredentials: true },
          )
          .then(async (response) => {
            const data = response.data.data || response.data;
            const { accessToken, refreshToken: newRefreshToken } = data;

            // Dual-mode: backend always returns both in body.
            // Store in localStorage as backup (token-crypto fix already applied).
            if (newRefreshToken) {
              await tokenManager.setTokens(accessToken, newRefreshToken);
            }

            return accessToken;
          });

        tokenManager.setRefreshPromise(refreshPromise);

        const newToken = await refreshPromise;

        tokenManager.setRefreshPromise(null);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        if (!requestQueue.isEmpty()) {
          await requestQueue.processQueue(newToken, apiClient);
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenManager.setRefreshPromise(null);
        requestQueue.rejectQueue(refreshError);
        tokenManager.clearTokens();

        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }

        return Promise.reject(refreshError);
      }
    }

    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  },
);

export default apiClient;
