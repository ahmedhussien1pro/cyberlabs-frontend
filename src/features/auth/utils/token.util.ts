import { jwtDecode } from 'jwt-decode';

/**
 * Interface for decoded JWT token structure
 * Matches backend JWT payload format
 */
export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

/**
 * Token Utilities
 * Centralized functions for token parsing, validation, and extraction
 *
 * Security: All token operations should go through these utilities
 * to maintain consistency and enable future security enhancements
 */
export const tokenUtils = {
  /**
   * Decode JWT token without verification
   * @param token - JWT token string
   * @returns Decoded token payload
   * @throws Error if token is malformed
   */
  decode(token: string): DecodedToken {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      throw new Error(`Invalid token format: ${error}`);
    }
  },

  /**
   * Check if token is expired
   * @param token - JWT token string
   * @returns true if token is expired or invalid
   */
  isExpired(token: string): boolean {
    try {
      const decoded = this.decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true; // Consider invalid tokens as expired
    }
  },

  /**
   * Get token expiry time in milliseconds
   * @param token - JWT token string
   * @returns Expiry timestamp in milliseconds, or 0 if invalid
   */
  getExpiryTime(token: string): number {
    try {
      const decoded = this.decode(token);
      return decoded.exp * 1000; // Convert to milliseconds
    } catch {
      return 0;
    }
  },

  /**
   * Get remaining time until token expires
   * @param token - JWT token string
   * @returns Remaining milliseconds, or 0 if expired/invalid
   */
  getRemainingTime(token: string): number {
    const expiryTime = this.getExpiryTime(token);
    if (!expiryTime) return 0;

    const remaining = expiryTime - Date.now();
    return Math.max(0, remaining);
  },

  /**
   * Extract user ID from token
   * @param token - JWT token string
   * @returns User ID or null if invalid
   */
  extractUserId(token: string): string | null {
    try {
      const decoded = this.decode(token);
      return decoded.sub;
    } catch {
      return null;
    }
  },

  /**
   * Extract user email from token
   * @param token - JWT token string
   * @returns User email or null if invalid
   */
  extractEmail(token: string): string | null {
    try {
      const decoded = this.decode(token);
      return decoded.email;
    } catch {
      return null;
    }
  },

  /**
   * Extract user role from token
   * @param token - JWT token string
   * @returns User role or null if invalid
   */
  extractRole(token: string): string | null {
    try {
      const decoded = this.decode(token);
      return decoded.role;
    } catch {
      return null;
    }
  },

  /**
   * Validate token format (basic check)
   * @param token - JWT token string
   * @returns true if token format is valid
   */
  isValidFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;

    // JWT should have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  },

  /**
   * Check if token will expire soon
   * @param token - JWT token string
   * @param thresholdMinutes - Minutes before expiry to consider "soon" (default: 5)
   * @returns true if token expires within threshold
   */
  isExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
    const remaining = this.getRemainingTime(token);
    const threshold = thresholdMinutes * 60 * 1000; // Convert to milliseconds

    return remaining > 0 && remaining < threshold;
  },
};
