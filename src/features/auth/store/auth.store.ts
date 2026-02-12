import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, AuthTokens } from "@/core/types"
import { ENV } from "@/shared/constants"

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false, // Changed from true to false
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setTokens: (tokens) =>
        set({ tokens }),

      login: (user, tokens) => {
        if (tokens.accessToken) {
          localStorage.setItem(`${ENV.STORAGE_PREFIX}accessToken`, tokens.accessToken)
        }
        if (tokens.refreshToken) {
          localStorage.setItem(`${ENV.STORAGE_PREFIX}refreshToken`, tokens.refreshToken)
        }

        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        localStorage.removeItem(`${ENV.STORAGE_PREFIX}accessToken`)
        localStorage.removeItem(`${ENV.STORAGE_PREFIX}refreshToken`)

        set({
          ...initialState,
          isLoading: false,
        })
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      setLoading: (isLoading) =>
        set({ isLoading }),
    }),
    {
      name: `${ENV.STORAGE_PREFIX}auth`,
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
