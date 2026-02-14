import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '@/features/auth/types';
export const tokenUtils = {
  decode(token: string): DecodedToken {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      throw new Error(`Invalid token format: ${error}`);
    }
  },

  isExpired(token: string): boolean {
    try {
      const decoded = this.decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  },

  getExpiryTime(token: string): number {
    try {
      const decoded = this.decode(token);
      return decoded.exp * 1000;
    } catch {
      return 0;
    }
  },

  getRemainingTime(token: string): number {
    const expiryTime = this.getExpiryTime(token);
    if (!expiryTime) return 0;

    const remaining = expiryTime - Date.now();
    return Math.max(0, remaining);
  },

  extractUserId(token: string): string | null {
    try {
      const decoded = this.decode(token);
      return decoded.sub;
    } catch {
      return null;
    }
  },

  extractEmail(token: string): string | null {
    try {
      const decoded = this.decode(token);
      return decoded.email;
    } catch {
      return null;
    }
  },

  extractRole(token: string): string | null {
    try {
      const decoded = this.decode(token);
      return decoded.role;
    } catch {
      return null;
    }
  },

  isValidFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    return parts.length === 3;
  },

  isExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
    const remaining = this.getRemainingTime(token);
    const threshold = thresholdMinutes * 60 * 1000;

    return remaining > 0 && remaining < threshold;
  },
};
