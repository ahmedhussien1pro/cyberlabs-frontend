// src/features/auth/types/index.ts

/**
 * Frontend UserRole values (lowercase) used by role.util.ts hierarchy.
 *
 * NOTE: The backend sends UPPERCASE roles (ADMIN, STUDENT, INSTRUCTOR, etc.).
 * Use `roleUtils.mapBackendRole()` to convert backend roles to this type.
 * Do NOT add uppercase values here — it breaks Record<UserRole, ...> lookups
 * in role.util.ts.
 */
export type UserRole = 'admin' | 'trainee' | 'content-creator';
export type UserSubscription = 'FREE' | 'PRO' | 'PREMIUM';

/**
 * Auth-store user shape.
 *
 * ⚠️  Field names MUST match what the backend login endpoint returns:
 *   auth.service.ts → select: { id, email, name, avatarUrl, role, ... }
 *
 * History:
 *   - `avatar` renamed to `avatarUrl` to align with backend field name.
 *     Using `avatar` caused user.avatar to always be `undefined` at runtime
 *     even though the actual JS object carried `avatarUrl`.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscription?: UserSubscription;
  /** Frontend alias — maps to backend `isEmailVerified` */
  emailVerified?: boolean;
  isEmailVerified?: boolean;
  twoFactorEnabled?: boolean;
  isActive?: boolean;
  /**
   * ✅ Renamed from `avatar` → `avatarUrl`.
   * Backend login response returns `avatarUrl` (not `avatar`).
   * Any component reading `user.avatar` was always getting `undefined`.
   */
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface VerifyResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type OAuthCallbackStatus = 'processing' | 'success' | 'error';

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrength {
  score: PasswordStrengthLevel;
  feedback: string[];
  isValid: boolean;
}

export type AuthFormField =
  | 'email'
  | 'password'
  | 'name'
  | 'currentPassword'
  | 'newPassword'
  | 'confirmPassword'
  | 'otp'
  | 'token';

export type AuthPageRoute =
  | '/auth'
  | '/forgot-password'
  | '/reset-password'
  | '/verify-email'
  | '/oauth/callback'
  | '/logout';

export const AuthErrorCode = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  INVALID_OTP: 'INVALID_OTP',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  OAUTH_ERROR: 'OAUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: unknown;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;
