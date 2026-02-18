// src/features/auth/utils/token-manager.util.ts - UPDATED

import { ENV } from '@/shared/constants';
import { tokenUtils } from './token.util';
import { tokenCrypto } from './token-crypto.util';
import { sanitize } from './sanitize.util';

class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string> | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const encryptedToken = localStorage.getItem(
        `${ENV.STORAGE_PREFIX}accessToken`,
      );

      if (!encryptedToken) return null;

      const token = await tokenCrypto.decryptToken(encryptedToken);

      if (!token) return null;

      if (tokenUtils.isValidFormat(token) && !tokenUtils.isExpired(token)) {
        return token;
      }

      this.clearTokens();
      return null;
    } catch (error) {
      sanitize.error('TokenManager.getAccessToken', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const encryptedToken = localStorage.getItem(
        `${ENV.STORAGE_PREFIX}refreshToken`,
      );

      if (!encryptedToken) return null;

      return await tokenCrypto.decryptToken(encryptedToken);
    } catch (error) {
      sanitize.error('TokenManager.getRefreshToken', error);
      return null;
    }
  }

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      if (!accessToken || !refreshToken) {
        throw new Error('Access token and refresh token are required');
      }

      const encryptedAccess = await tokenCrypto.encryptToken(accessToken);
      const encryptedRefresh = await tokenCrypto.encryptToken(refreshToken);

      localStorage.setItem(`${ENV.STORAGE_PREFIX}accessToken`, encryptedAccess);
      localStorage.setItem(
        `${ENV.STORAGE_PREFIX}refreshToken`,
        encryptedRefresh,
      );
    } catch (error) {
      sanitize.error('TokenManager.setTokens', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  clearTokens(): void {
    try {
      localStorage.removeItem(`${ENV.STORAGE_PREFIX}accessToken`);
      localStorage.removeItem(`${ENV.STORAGE_PREFIX}refreshToken`);
      localStorage.removeItem(`${ENV.STORAGE_PREFIX}auth`);

      tokenCrypto.clearSessionKey();

      this.cancelRefresh();
    } catch (error) {
      sanitize.error('TokenManager.clearTokens', error);
    }
  }

  async hasValidTokens(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return accessToken !== null;
  }

  getRefreshPromise(): Promise<string> | null {
    return this.refreshPromise;
  }

  setRefreshPromise(promise: Promise<string> | null): void {
    this.refreshPromise = promise;
  }

  scheduleAutoRefresh(
    expiresIn: number,
    refreshCallback: () => Promise<void>,
  ): void {
    this.cancelRefresh();

    const refreshTime = (expiresIn - 120) * 1000;

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        try {
          await refreshCallback();
        } catch (error) {
          sanitize.error('TokenManager.autoRefresh', error);
        }
      }, refreshTime);
    }
  }

  cancelRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async getRemainingTime(): Promise<number> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return 0;

    return tokenUtils.getRemainingTime(accessToken);
  }

  async isExpiringSoon(thresholdMinutes: number = 5): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return true;

    return tokenUtils.isExpiringSoon(accessToken, thresholdMinutes);
  }
}

export const tokenManager = TokenManager.getInstance();
