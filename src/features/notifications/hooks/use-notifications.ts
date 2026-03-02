import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { NotificationsResponse } from '../types/notification.types';

const extractData = <T>(res: any): T => {
  const axiosData = res?.data !== undefined ? res.data : res;
  return (axiosData?.data !== undefined ? axiosData.data : axiosData) as T;
};

const KEY = ['notifications'] as const;

// ─── helpers ──────────────────────────────────────────────────────────
const patchCache = (
  qc: ReturnType<typeof useQueryClient>,
  updater: (old: NotificationsResponse) => NotificationsResponse,
) => ({
  onMutate: async () => {
    await qc.cancelQueries({ queryKey: KEY });
    const prev = qc.getQueryData<NotificationsResponse>(KEY);
    qc.setQueryData<NotificationsResponse>(KEY, (old) =>
      old ? updater(old) : old,
    );
    return { prev };
  },
  onError: (
    _e: unknown,
    _v: unknown,
    ctx?: { prev?: NotificationsResponse },
  ) => {
    if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
  },
});

// ── Fetch ──────────────────────────────────────────────────────────────
export function useNotifications() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<NotificationsResponse> => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
        return extractData<NotificationsResponse>(response);
      } catch (error) {
        // Return empty notifications to prevent query from failing constantly
        return {
          notifications: [],
          total: 0,
          unreadCount: 0,
        };
      }
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    retry: false,
  });
}

// ── Mark one read ──────────────────────────────────────────────────────
export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    },
    ...patchCache(qc, (old) => {
      // id injected via closure trick — use onMutate directly
      return old; // overridden below
    }),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<NotificationsResponse>(KEY);
      qc.setQueryData<NotificationsResponse>(KEY, (old) => {
        if (!old) return old;
        const wasUnread = old.notifications.find(
          (n) => n.id === id && !n.isRead,
        );
        return {
          ...old,
          unreadCount: wasUnread
            ? Math.max(0, old.unreadCount - 1)
            : old.unreadCount,
          notifications: old.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
        };
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
  });
}

// ── Mark all read ──────────────────────────────────────────────────────
export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<NotificationsResponse>(KEY);
      qc.setQueryData<NotificationsResponse>(KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          unreadCount: 0,
          notifications: old.notifications.map((n) => ({ ...n, isRead: true })),
        };
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
  });
}

// ── Clear/Delete All ───────────────────────────────────────────────────
export function useClearAll() {
  const qc = useQueryClient();
  return useMutation({
    // Replace with correct backend endpoint for clearing all notifications if available
    mutationFn: async (): Promise<void> => {
      await apiClient.delete(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/all`);
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<NotificationsResponse>(KEY);
      qc.setQueryData<NotificationsResponse>(KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          unreadCount: 0,
          total: 0,
          notifications: [],
        };
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
  });
}

// ── Archive one ────────────────────────────────────────────────────────
export function useArchiveNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.ARCHIVE(id));
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<NotificationsResponse>(KEY);
      qc.setQueryData<NotificationsResponse>(KEY, (old) => {
        if (!old) return old;
        const target = old.notifications.find((n) => n.id === id);
        const wasUnread = target && !target.isRead && !target.isArchived;
        return {
          ...old,
          unreadCount: wasUnread
            ? Math.max(0, old.unreadCount - 1)
            : old.unreadCount,
          notifications: old.notifications.map((n) =>
            n.id === id ? { ...n, isArchived: true, isRead: true } : n,
          ),
        };
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
  });
}

// ── Delete one ─────────────────────────────────────────────────────────
export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<NotificationsResponse>(KEY);
      qc.setQueryData<NotificationsResponse>(KEY, (old) => {
        if (!old) return old;
        const target = old.notifications.find((n) => n.id === id);
        const wasUnread = target && !target.isRead;
        return {
          ...old,
          total: old.total - 1,
          unreadCount: wasUnread
            ? Math.max(0, old.unreadCount - 1)
            : old.unreadCount,
          notifications: old.notifications.filter((n) => n.id !== id),
        };
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
  });
}
