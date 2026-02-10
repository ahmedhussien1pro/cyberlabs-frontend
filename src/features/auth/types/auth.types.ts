export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'INSTRUCTOR';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
