/**
 * User role types supported by the system
 */
export type UserRole = 'admin' | 'trainee' | 'content-creator';

/**
 * User entity
 * Represents authenticated user information
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Authentication tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

/**
 * Decoded JWT token payload
 * Matches backend JWT structure
 */
export interface DecodedToken {
  sub: string; // user id
  email: string;
  role: string;
  type: 'access' | 'refresh';
  iat: number; // issued at timestamp
  exp: number; // expiry timestamp
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Register response from API
 */
export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Generic verification response
 */
export interface VerifyResponse {
  success: boolean;
  message: string;
}

/**
 * Password reset request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Password reset with token
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Change password request (authenticated)
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Email verification with token
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Email verification with OTP
 */
export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

/**
 * Resend verification email
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * OAuth callback status
 */
export type OAuthCallbackStatus = 'processing' | 'success' | 'error';

/**
 * Password strength levels
 */
export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Password strength result
 */
export interface PasswordStrength {
  score: PasswordStrengthLevel;
  feedback: string[];
  isValid: boolean;
}

/**
 * Auth form field names
 */
export type AuthFormField =
  | 'email'
  | 'password'
  | 'name'
  | 'currentPassword'
  | 'newPassword'
  | 'confirmPassword'
  | 'otp'
  | 'token';

/**
 * Auth page routes
 */
export type AuthPageRoute =
  | '/auth'
  | '/auth'
  | '/forgot-password'
  | '/reset-password'
  | '/verify-email'
  | '/oauth/callback'
  | '/logout';

/**
 * Auth error codes
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_OTP = 'INVALID_OTP',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  OAUTH_ERROR = 'OAUTH_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Auth error with code and message
 */
export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: any;
}

/**
 * Auth state for Zustand store
 */
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth actions for Zustand store
 */
export interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;
