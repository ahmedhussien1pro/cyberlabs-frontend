// src/features/auth/services/auth.service.ts
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { ApiResponse } from '@/core/types';

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'trainee' | 'content-creator';
    emailVerified?: boolean;
  };
  accessToken: string; 
  refreshToken: string;
  expiresIn: number; 
}

interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'trainee';
    emailVerified: boolean;
  };
  accessToken: string; 
  refreshToken: string;
  expiresIn: number; 
}

interface VerifyResponse {
  success: boolean;
  message: string;
}

export const authService = {
  // ==================== Email/Password Auth ====================
  
  login: async (email: string, password: string): Promise<LoginResponse> => {
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
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      { name, email, password },
    );
    return response.data || response;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data || response;
  },

  // ==================== Password Reset ====================
  
  forgotPassword: async (email: string): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return response.data || response;
  },

  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, newPassword }
    );
    return response.data || response;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword }
    );
    return response.data || response;
  },

  // ==================== Email Verification ====================
  
  /**
   * Verify email using token from email link
   * @param token - Token from email verification link
   */
  verifyEmailWithToken: async (token: string): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      { token }
    );
    return response.data || response;
  },

  /**
   * Verify email using OTP code (6 digits)
   * @param email - User's email address
   * @param otp - 6-digit OTP code
   */
  verifyEmailWithOTP: async (
    email: string,
    otp: string,
  ): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL_OTP,
      { email, otp }
    );
    return response.data || response;
  },

  /**
   * Resend verification email/OTP
   * @param email - User's email address
   */
  resendVerificationEmail: async (email: string): Promise<VerifyResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyResponse>>(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
      { email }
    );
    return response.data || response;
  },

  // ==================== OAuth Authentication ====================
  
  googleLogin: async (): Promise<{ url: string }> => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(
      API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
    );
    return response.data || response;
  },

  googleCallback: async (
    code: string,
    state: string,
  ): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.GOOGLE_CALLBACK,
      { code, state },
    );
    return response.data || response;
  },

  githubLogin: async (): Promise<{ url: string }> => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>>(
      API_ENDPOINTS.AUTH.GITHUB_LOGIN,
    );
    return response.data || response;
  },

  githubCallback: async (
    code: string,
    state: string,
  ): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.GITHUB_CALLBACK,
      { code, state },
    );
    return response.data || response;
  },

  // ==================== Get Current User ====================
  
  getCurrentUser: async (): Promise<LoginResponse['user']> => {
    const response = await apiClient.get<ApiResponse<{ user: LoginResponse['user'] }>>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data?.user || response.user;
  },
};

// Export types for use in other files
export type { LoginResponse, RegisterResponse, VerifyResponse };
