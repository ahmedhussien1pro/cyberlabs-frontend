import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { API_CONFIG, STORAGE_KEYS } from '../constants/config'

// Create Axios Instance
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor - Add Auth Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - Handle Errors & Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Handle 401 - Unauthorized (Token Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        // Refresh Token Request
        const { data } = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const newAccessToken = data.accessToken
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken)

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed - Logout user
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)

        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || 'Something went wrong'

    // Don't show toast for specific routes (like silent refresh)
    if (!originalRequest.url?.includes('/refresh')) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)
