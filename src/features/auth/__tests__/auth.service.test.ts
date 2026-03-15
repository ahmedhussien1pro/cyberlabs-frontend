import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/core/api', () => ({
  apiClient: { post: vi.fn(), get: vi.fn() },
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      CHANGE_PASSWORD: '/auth/change-password',
      VERIFY_EMAIL: '/auth/verify-email',
      VERIFY_EMAIL_OTP: '/auth/verify-email-otp',
      RESEND_VERIFICATION: '/auth/resend-verification',
      ME: '/auth/me',
    },
  },
}));

vi.mock('@/features/auth/utils', () => ({
  sanitize: { log: vi.fn(), error: vi.fn(), REDACTED: '[REDACTED]' },
  tokenManager: {
    setTokens: vi.fn(),
    getRefreshToken: vi.fn(),
    getRemainingTime: vi.fn(),
    clearTokens: vi.fn(),
    scheduleAutoRefresh: vi.fn(),
  },
}));

import { apiClient, API_ENDPOINTS } from '@/core/api';
import { authService } from '../services/auth.service';

describe('authService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('login', () => {
    it('calls POST /auth/login with email and password', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ accessToken: 'tok', refreshToken: 'ref' });
      await authService.login('a@b.com', 'pass');
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGIN, { email: 'a@b.com', password: 'pass' });
    });
    it('returns the API response', async () => {
      const mockRes = { accessToken: 'tok', refreshToken: 'ref', user: {} };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockRes);
      const res = await authService.login('a@b.com', 'pass');
      expect(res).toEqual(mockRes);
    });
  });

  describe('register', () => {
    it('calls POST /auth/register', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ user: {} });
      await authService.register('Ahmed', 'a@b.com', 'pass123');
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.REGISTER, {
        name: 'Ahmed', email: 'a@b.com', password: 'pass123',
      });
    });
    it('throws on API error', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce({ statusCode: 409, message: 'Conflict' });
      await expect(authService.register('Ahmed', 'a@b.com', 'pass123')).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('logout', () => {
    it('calls POST /auth/logout', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({});
      await authService.logout();
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGOUT);
    });
  });

  describe('forgotPassword', () => {
    it('calls POST /auth/forgot-password with email', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ message: 'sent' });
      await authService.forgotPassword('a@b.com');
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email: 'a@b.com' });
    });
  });

  describe('resetPassword', () => {
    it('calls POST /auth/reset-password with token and newPassword', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ message: 'ok' });
      await authService.resetPassword('tok123', 'NewPass1');
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token: 'tok123', newPassword: 'NewPass1',
      });
    });
  });

  describe('changePassword', () => {
    it('calls POST /auth/change-password', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ message: 'ok' });
      await authService.changePassword('old', 'New1pass');
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword: 'old', newPassword: 'New1pass',
      });
    });
  });

  describe('verifyEmailWithOTP', () => {
    it('calls POST /auth/verify-email-otp', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ message: 'ok' });
      await authService.verifyEmailWithOTP('a@b.com', '123456');
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.VERIFY_EMAIL_OTP, {
        email: 'a@b.com', otp: '123456',
      });
    });
  });

  describe('resendVerificationEmail', () => {
    it('calls POST /auth/resend-verification', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ message: 'sent' });
      await authService.resendVerificationEmail('a@b.com');
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email: 'a@b.com' });
    });
  });

  describe('getCurrentUser', () => {
    it('calls GET /auth/me and returns user', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ user: { id: '1', email: 'a@b.com' } });
      const user = await authService.getCurrentUser();
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.ME);
      expect(user).toEqual({ id: '1', email: 'a@b.com' });
    });
    it('returns undefined when user not in response', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({});
      const user = await authService.getCurrentUser();
      expect(user).toBeUndefined();
    });
  });

  describe('refresh', () => {
    it('returns null when API throws', async () => {
      const { tokenManager } = await import('@/features/auth/utils');
      vi.mocked(tokenManager.getRefreshToken).mockResolvedValueOnce('ref-tok');
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('fail'));
      const result = await authService.refresh();
      expect(result).toBeNull();
    });
  });
});
