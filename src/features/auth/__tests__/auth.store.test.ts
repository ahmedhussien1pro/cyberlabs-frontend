import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/features/auth/services/auth.service', () => ({
  authService: { refresh: vi.fn() },
}));

vi.mock('@/features/auth/utils', () => ({
  sanitize: { log: vi.fn(), error: vi.fn(), REDACTED: '[REDACTED]' },
  tokenManager: {
    setTokens: vi.fn().mockResolvedValue(undefined),
    getRefreshToken: vi.fn().mockResolvedValue('ref'),
    getRemainingTime: vi.fn().mockResolvedValue(0),
    clearTokens: vi.fn(),
    scheduleAutoRefresh: vi.fn(),
  },
}));

vi.mock('@/shared/constants', () => ({
  ENV: { STORAGE_PREFIX: 'cl_' },
}));

import { useAuthStore } from '../store/auth.store';

const mockUser = { id: '1', email: 'a@b.com', username: 'ahmed' } as never;
const mockTokens = { accessToken: 'acc', refreshToken: 'ref' };

describe('useAuthStore', () => {
  beforeEach(() => {
    // reset store to initial state
    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  it('initial state is unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.tokens).toBeNull();
  });

  it('setUser sets user and isAuthenticated=true', () => {
    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('setUser(null) sets isAuthenticated=false', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('setTokens stores tokens in state', () => {
    useAuthStore.getState().setTokens(mockTokens);
    expect(useAuthStore.getState().tokens).toEqual(mockTokens);
  });

  it('setLoading updates isLoading', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('login sets user, tokens, isAuthenticated=true', async () => {
    await useAuthStore.getState().login(mockUser, mockTokens);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.tokens).toEqual(mockTokens);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('logout resets state to initial', async () => {
    await useAuthStore.getState().login(mockUser, mockTokens);
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.tokens).toBeNull();
  });

  it('updateUser merges partial user data', async () => {
    await useAuthStore.getState().login(mockUser, mockTokens);
    useAuthStore.getState().updateUser({ email: 'new@email.com' } as never);
    expect(useAuthStore.getState().user).toMatchObject({ email: 'new@email.com' });
  });

  it('updateUser does nothing when user is null', () => {
    useAuthStore.getState().updateUser({ email: 'x@x.com' } as never);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
