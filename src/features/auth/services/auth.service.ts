import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { ApiResponse } from '@/core/types';
import type {
  LoginResponse,
  RegisterResponse,
  VerifyResponse,
  RefreshTokenResponse,
  User,
} from '@/features/auth/types';
import { sanitize } from '@/features/auth/utils';

function unwrap<T>(res: unknown): T {
  return (res as ApiResponse<T>).data;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (import.meta.env.DEV) {
      sanitize.log('AuthService.login', { email, password: sanitize.REDACTED });
    }
    const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return unwrap<LoginResponse>(res);
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
      const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
      });
      return unwrap<RegisterResponse>(res);
    } catch (error: any) {
      const isExpectedError = [400, 409, 500].includes(error.statusCode);
      if (import.meta.env.DEV && !isExpectedError) {
        sanitize.error('Unexpected registration error:', {
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
    const res = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return unwrap<RefreshTokenResponse>(res);
  },

  forgotPassword: async (email: string): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return unwrap<VerifyResponse>(res);
  },

  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return unwrap<VerifyResponse>(res);
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return unwrap<VerifyResponse>(res);
  },

  verifyEmailWithToken: async (token: string): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      token,
    });
    return unwrap<VerifyResponse>(res);
  },

  verifyEmailWithOTP: async (
    email: string,
    otp: string,
  ): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL_OTP, {
      email,
      otp,
    });
    return unwrap<VerifyResponse>(res);
  },

  resendVerificationEmail: async (email: string): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      email,
    });
    return unwrap<VerifyResponse>(res);
  },

  getCurrentUser: async (): Promise<User | undefined> => {
    const res = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return unwrap<{ user: User }>(res)?.user;
  },
};
