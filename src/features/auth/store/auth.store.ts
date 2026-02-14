import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthStore } from '@/features/auth/types';
import { ENV } from '@/shared/constants';
import { tokenManager, sanitize } from '@/features/auth/utils';

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setTokens: (tokens) => set({ tokens }),

      login: async (user, tokens) => {
        if (tokens.accessToken && tokens.refreshToken) {
          try {
            await tokenManager.setTokens(
              tokens.accessToken,
              tokens.refreshToken,
            );
          } catch (error) {
            sanitize.error('AuthStore.login', error);
          }
        }
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        tokenManager.clearTokens();
        set({
          ...initialState,
          isLoading: false,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: `${ENV.STORAGE_PREFIX}auth`,
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        // Don't persist loading state
      }),
    },
  ),
);

export default useAuthStore;
