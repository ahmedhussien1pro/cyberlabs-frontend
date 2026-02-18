// src/core/api/client.ts - FIXED VERSION

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/shared/constants';
import type { ApiError, ApiResponse } from '@/core/types';
import { tokenManager, requestQueue } from '@/features/auth/utils';
import { API_ENDPOINTS } from './endpoints';

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRF-Token';

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenManager.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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

      try {
        const refreshToken = await tokenManager.getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshPromise = axios
          .post<
            ApiResponse<{ accessToken: string; refreshToken: string }>
          >(`${ENV.API_URL}${API_ENDPOINTS.AUTH.REFRESH}`, { refreshToken }, { withCredentials: true })
          .then(async (response) => {
            const data = response.data.data || response.data;
            const { accessToken, refreshToken: newRefreshToken } = data;

            // Store new tokens
            await tokenManager.setTokens(accessToken, newRefreshToken);

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
