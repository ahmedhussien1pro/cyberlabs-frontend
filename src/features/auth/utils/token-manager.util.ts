import { ENV } from '@/shared/constants';
import { tokenUtils } from './token.util';

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
  getAccessToken(): string | null {
    try {
      const token = localStorage.getItem(`${ENV.STORAGE_PREFIX}accessToken`);

      if (
        token &&
        tokenUtils.isValidFormat(token) &&
        !tokenUtils.isExpired(token)
      ) {
        return token;
      }

      return null;
    } catch (error) {
      console.error('Error reading access token:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(`${ENV.STORAGE_PREFIX}refreshToken`);
    } catch (error) {
      console.error('Error reading refresh token:', error);
      return null;
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    try {
      localStorage.setItem(`${ENV.STORAGE_PREFIX}accessToken`, accessToken);
      localStorage.setItem(`${ENV.STORAGE_PREFIX}refreshToken`, refreshToken);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  clearTokens(): void {
    try {
      localStorage.removeItem(`${ENV.STORAGE_PREFIX}accessToken`);
      localStorage.removeItem(`${ENV.STORAGE_PREFIX}refreshToken`);

      localStorage.removeItem(`${ENV.STORAGE_PREFIX}auth`);

      this.cancelRefresh();
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
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
          console.error('Auto-refresh failed:', error);
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

  getRemainingTime(): number {
    const accessToken = this.getAccessToken();
    if (!accessToken) return 0;

    return tokenUtils.getRemainingTime(accessToken);
  }

  isExpiringSoon(thresholdMinutes: number = 5): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) return true;

    return tokenUtils.isExpiringSoon(accessToken, thresholdMinutes);
  }
}

export const tokenManager = TokenManager.getInstance();
