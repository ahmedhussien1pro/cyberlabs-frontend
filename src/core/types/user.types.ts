import { UserRole } from "@/shared/constants/roles"

export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}
