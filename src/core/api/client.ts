import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios"
import { ENV } from "@/shared/constants"
import { ApiError, ApiResponse } from "@/core/types"

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Send cookies with requests
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if exists
    const token = localStorage.getItem(`${ENV.STORAGE_PREFIX}accessToken`)
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add timestamp to prevent caching
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Transform response to ApiResponse format
    return response.data
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem(`${ENV.STORAGE_PREFIX}refreshToken`)
        
        if (refreshToken) {
          const response = await axios.post<ApiResponse<{ accessToken: string }>>(
            `${ENV.API_URL}/auth/refresh`,
            { refreshToken }
          )

          const { accessToken } = response.data.data
          localStorage.setItem(`${ENV.STORAGE_PREFIX}accessToken`, accessToken)

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem(`${ENV.STORAGE_PREFIX}accessToken`)
        localStorage.removeItem(`${ENV.STORAGE_PREFIX}refreshToken`)
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    // Transform error to ApiError format
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || "An error occurred",
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors,
    }

    return Promise.reject(apiError)
  }
)

export default apiClient
