import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthStore } from '@/features/auth/types';
import { ENV } from '@/shared/constants';
import { tokenManager, sanitize } from '@/features/auth/utils';
import { authService } from '@/features/auth/services/auth.service';
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

            const remaining = await tokenManager.getRemainingTime();
            if (remaining > 0) {
              tokenManager.scheduleAutoRefresh(
                Math.floor(remaining / 1000),
                async () => {
                  try {
                    const newTokens = await authService.refresh();
                    if (newTokens?.accessToken && newTokens?.refreshToken) {
                      await tokenManager.setTokens(
                        newTokens.accessToken,
                        newTokens.refreshToken,
                      );
                      const newRemaining =
                        await tokenManager.getRemainingTime();
                      tokenManager.scheduleAutoRefresh(
                        Math.floor(newRemaining / 1000),
                        async () => {},
                      );
                    }
                  } catch {
                    tokenManager.clearTokens();
                    useAuthStore.getState().logout();
                  }
                },
              );
            }
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
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
