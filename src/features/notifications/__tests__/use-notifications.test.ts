import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/utils';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllRead,
  useClearAll,
  useDeleteNotification,
  useArchiveNotification,
} from '../hooks/use-notifications';

const mockGet = vi.fn();
const mockPatch = vi.fn();
const mockDelete = vi.fn();

vi.mock('@/core/api/client', () => ({
  apiClient: { get: mockGet, patch: mockPatch, delete: mockDelete },
}));
vi.mock('@/core/api/endpoints', () => ({
  API_ENDPOINTS: {
    NOTIFICATIONS: {
      BASE: '/notifications',
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      MARK_ALL_READ: '/notifications/read-all',
      ARCHIVE: (id: string) => `/notifications/${id}/archive`,
      DELETE: (id: string) => `/notifications/${id}`,
    },
  },
}));

const mockData = {
  notifications: [
    { id: '1', isRead: false, isArchived: false, title: 'A' },
    { id: '2', isRead: true, isArchived: false, title: 'B' },
  ],
  total: 2,
  unreadCount: 1,
};

describe('useNotifications', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns notifications data on success', async () => {
    mockGet.mockResolvedValue({ data: { data: mockData } });
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.notifications).toHaveLength(2);
    expect(result.current.data?.unreadCount).toBe(1);
  });

  it('returns empty state on API error (no throw)', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.notifications).toHaveLength(0);
    expect(result.current.data?.unreadCount).toBe(0);
  });
});

describe('useMarkAsRead', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls PATCH with correct endpoint', async () => {
    mockPatch.mockResolvedValue({});
    const { result } = renderHook(() => useMarkAsRead(), {
      wrapper: createWrapper(),
    });
    result.current.mutate('1');
    await waitFor(() => expect(mockPatch).toHaveBeenCalledWith('/notifications/1/read'));
  });
});

describe('useMarkAllRead', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls PATCH on mark-all-read endpoint', async () => {
    mockPatch.mockResolvedValue({});
    const { result } = renderHook(() => useMarkAllRead(), {
      wrapper: createWrapper(),
    });
    result.current.mutate();
    await waitFor(() =>
      expect(mockPatch).toHaveBeenCalledWith('/notifications/read-all'),
    );
  });
});

describe('useClearAll', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls DELETE on /notifications/all', async () => {
    mockDelete.mockResolvedValue({});
    const { result } = renderHook(() => useClearAll(), {
      wrapper: createWrapper(),
    });
    result.current.mutate();
    await waitFor(() =>
      expect(mockDelete).toHaveBeenCalledWith('/notifications/all'),
    );
  });
});

describe('useDeleteNotification', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls DELETE with correct id endpoint', async () => {
    mockDelete.mockResolvedValue({});
    const { result } = renderHook(() => useDeleteNotification(), {
      wrapper: createWrapper(),
    });
    result.current.mutate('1');
    await waitFor(() =>
      expect(mockDelete).toHaveBeenCalledWith('/notifications/1'),
    );
  });
});

describe('useArchiveNotification', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls PATCH with archive endpoint', async () => {
    mockPatch.mockResolvedValue({});
    const { result } = renderHook(() => useArchiveNotification(), {
      wrapper: createWrapper(),
    });
    result.current.mutate('2');
    await waitFor(() =>
      expect(mockPatch).toHaveBeenCalledWith('/notifications/2/archive'),
    );
  });
});
