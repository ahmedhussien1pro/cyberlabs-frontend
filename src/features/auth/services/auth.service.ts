// src/features/auth/services/auth.service.ts
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { ApiResponse } from '@/core/types';

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'trainee' | 'content-creator';
  };
  token: string;
  refreshToken: string;
}

interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'trainee';
  };
  token: string;
}

interface OTPResponse {
  success: boolean;
  message: string;
}

export const authService = {
  // Email/Password Auth
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      { email, password },
    );
    // apiClient interceptor already returns response.data
    // So response is already the ApiResponse object
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
    // apiClient interceptor already returns response.data
    return response.data || response;
  },

  // Password Reset
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
      confirmPassword,
    });
  },

  // Email Verification
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
  },

  // OTP (Phone) Authentication
  sendOTP: async (phoneNumber: string): Promise<OTPResponse> => {
    const response = await apiClient.post<ApiResponse<OTPResponse>>(
      API_ENDPOINTS.AUTH.SEND_OTP,
      { phoneNumber },
    );
    return response.data || response;
  },

  verifyOTP: async (
    phoneNumber: string,
    otp: string,
  ): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      { phoneNumber, otp },
    );
    return response.data || response;
  },

  resendOTP: async (phoneNumber: string): Promise<OTPResponse> => {
    const response = await apiClient.post<ApiResponse<OTPResponse>>(
      API_ENDPOINTS.AUTH.RESEND_OTP,
      { phoneNumber },
    );
    return response.data || response;
  },

  // OAuth Authentication
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
    const response = await apiClient.get<ApiResponse<{ url: string }>>(
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

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
