// src/features/auth/services/auth.service.ts
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { ApiResponse } from '@/core/types';
import type {
  LoginResponse,
  RegisterResponse,
  VerifyResponse,
  RefreshTokenResponse,
} from '@/features/auth/types';
import { sanitize } from '@/features/auth/utils';

export const authService = {
  // ==================== Email/Password Auth ====================

  /**
   * Login user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns LoginResponse with user data and tokens
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (import.meta.env.DEV) {
      sanitize.log('AuthService.login', { email, password: sanitize.REDACTED });
    }
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      { email, password },
    );
    return response.data || response;
  },

  /**
   * Register new user
   * @param name - Username
   * @param email - User's email address
   * @param password - User's password
   * @returns RegisterResponse with user data and tokens
   *
   * @note Backend currently returns 500 Internal Server Error when username exists
   *       instead of 409 Conflict. This should be fixed on the backend.
   *       For now, we handle 500 errors in the UI with a generic message.
   */
  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> => {
    if (import.meta.env.DEV) {
      sanitize.log('AuthService.register', {
        name,
        email,
        password: sanitize.REDACTED,
      });
    }

    try {
      const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        API_ENDPOINTS.AUTH.REGISTER,
        { name, email, password },
      );
      return response.data || response;
    } catch (error: any) {
      // ✅ Enhanced error handling for registration
      // Backend may return 500 for various validation errors
      // including username/email already exists

      if (import.meta.env.DEV) {
        console.error('Registration service error:', {
          message: error.message,
          statusCode: error.statusCode,
          errors: error.errors,
        });
      }

      // Re-throw error to be handled by UI
      // UI will check error.statusCode and error.message
      throw error;
    }
  },

  /**
   * Logout current user
   * Clears tokens and invalidates session
   */
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Current refresh token
   * @returns New access and refresh tokens
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    if (import.meta.env.DEV) {
      sanitize.log('AuthService.refreshToken', {
        refreshToken: sanitize.REDACTED,
      });
    }
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return response.data || response;
  },

  // ==================== Password Reset ====================

  /**
   * Request password reset email
   * @param email - User's email address
   * @returns VerifyResponse with success message
   */
  forgotPassword: async (email: string): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
    );
    return response.data || response;
  },

  /**
   * Reset password using token from email
   * @param token - Password reset token
   * @param newPassword - New password
   * @returns VerifyResponse with success message
   */
  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, newPassword },
    );
    return response.data || response;
  },

  /**
   * Change password for authenticated user
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns VerifyResponse with success message
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword },
    );
    return response.data || response;
  },

  // ==================== Email Verification ====================

  /**
   * Verify email using token from email link
   * @param token - Token from email verification link
   * @returns VerifyResponse with success message
   */
  verifyEmailWithToken: async (token: string): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      { token },
    );
    return response.data || response;
  },

  /**
   * Verify email using OTP code (6 digits)
   * @param email - User's email address
   * @param otp - 6-digit OTP code
   * @returns VerifyResponse with success message
   */
  verifyEmailWithOTP: async (
    email: string,
    otp: string,
  ): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL_OTP,
      { email, otp },
    );
    return response.data || response;
  },

  /**
   * Resend verification email/OTP
   * @param email - User's email address
   * @returns VerifyResponse with success message
   */
  resendVerificationEmail: async (email: string): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
      { email },
    );
    return response.data || response;
  },

  // ==================== Get Current User ====================

  /**
   * Get current authenticated user's data
   * @returns User object
   */
  getCurrentUser: async () => {
    const response = await apiClient.get<
      ApiResponse<{ user: LoginResponse['user'] }>
    >(API_ENDPOINTS.AUTH.ME);
    return response.data?.user || response.user;
  },
};
