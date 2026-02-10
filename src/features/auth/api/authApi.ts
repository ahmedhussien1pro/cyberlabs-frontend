import { api } from '@/lib/api/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  User,
} from '../types/auth.types';

export const authApi = {
  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // Get Current User
  me: async (): Promise<User> => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  },

  // Resend Verification Email
  resendVerification: async (email: string): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  // Reset Password
  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  // Change Password
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  // 2FA - Generate QR
  generate2FA: async (): Promise<{ qrCode: string; secret: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.TWO_FA.GENERATE);
    return response.data;
  },

  // 2FA - Enable
  enable2FA: async (code: string): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.TWO_FA.ENABLE, { code });
  },

  // 2FA - Disable
  disable2FA: async (code: string): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.TWO_FA.DISABLE, { code });
  },

  // 2FA - Verify Code
  verify2FA: async (code: string): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.TWO_FA.VERIFY, { code });
  },
};
