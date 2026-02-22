import { apiClient, API_ENDPOINTS } from '@/core/api';
import type {
  LoginResponse,
  RegisterResponse,
  VerifyResponse,
  RefreshTokenResponse,
  User,
} from '@/features/auth/types';
import { sanitize } from '@/features/auth/utils';

const cast = <T>(res: unknown) => res as unknown as T;

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (import.meta.env.DEV) {
      sanitize.log('AuthService.login', { email, password: sanitize.REDACTED });
    }
    const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return cast<LoginResponse>(res);
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
      return cast<RegisterResponse>(res);
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
    return cast<RefreshTokenResponse>(res);
  },

  forgotPassword: async (email: string): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return cast<VerifyResponse>(res);
  },

  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return cast<VerifyResponse>(res);
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return cast<VerifyResponse>(res);
  },

  verifyEmailWithToken: async (token: string): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      token,
    });
    return cast<VerifyResponse>(res);
  },

  verifyEmailWithOTP: async (
    email: string,
    otp: string,
  ): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL_OTP, {
      email,
      otp,
    });
    return cast<VerifyResponse>(res);
  },

  resendVerificationEmail: async (email: string): Promise<VerifyResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      email,
    });
    return cast<VerifyResponse>(res);
  },

  getCurrentUser: async (): Promise<User | undefined> => {
    const res = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return (res as unknown as { user: User })?.user;
  },
};
