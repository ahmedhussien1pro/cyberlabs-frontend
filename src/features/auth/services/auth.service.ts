import { apiClient, API_ENDPOINTS } from "@/core/api"
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  User 
} from "@/core/types"

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    )
    return response
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ data: User }>(
      API_ENDPOINTS.AUTH.ME
    )
    return response.data
  },

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email })
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    })
  },
}

export default authService
