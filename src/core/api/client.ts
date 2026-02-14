import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/shared/constants';
import type { ApiError, ApiResponse } from '@/core/types';
import { tokenManager, requestQueue } from '@/features/auth/utils';
// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Transform response to ApiResponse format
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Check if refresh is already in progress
      const ongoingRefresh = tokenManager.getRefreshPromise();

      if (ongoingRefresh) {
        // Wait for ongoing refresh and retry request
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
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const refreshPromise = axios
            .post<ApiResponse<{ accessToken: string; refreshToken: string }>>()
            .then((response) => {
              const { accessToken, refreshToken: newRefreshToken } =
                response.data.data;
              tokenManager.setTokens(accessToken, newRefreshToken);

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
        }
      } catch (refreshError) {
        tokenManager.setRefreshPromise(null);
        requestQueue.rejectQueue(refreshError);
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Transform error to ApiError format
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
