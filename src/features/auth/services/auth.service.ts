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
      const isExpectedError =
        error.statusCode === 500 ||
        error.statusCode === 400 ||
        error.statusCode === 409;

      // Only log unexpected errors in DEV
      if (import.meta.env.DEV && !isExpectedError) {
        console.error('Unexpected registration error:', {
          message: error.message,
          statusCode: error.statusCode,
        });
      }

      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

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
