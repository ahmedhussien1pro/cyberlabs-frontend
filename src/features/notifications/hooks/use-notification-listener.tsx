import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSocket } from '@/core/providers/socket-provider';
import { useTranslation } from 'react-i18next';

import type {
  Notification,
  NotificationsResponse,
} from '../types/notification.types';
import { TYPE_CONFIG } from '../components/type-config';
const KEY = ['notifications'] as const;

export function useNotificationListener() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation('notifications');
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    if (!socket) return;

    const handleNew = (n: Notification) => {
      queryClient.setQueryData<NotificationsResponse>(KEY, (old) => {
        if (!old) return old;
        const alreadyExists = old.notifications.some((x) => x.id === n.id);
        if (alreadyExists) return old;
        return {
          ...old,
          total: old.total + 1,
          unreadCount: old.unreadCount + 1,
          notifications: [n, ...old.notifications],
        };
      });

      const title = isAr ? (n.ar_title ?? n.title) : n.title;
      const body = isAr ? (n.ar_body ?? n.body) : n.body;
      const { icon: Icon, cls } = TYPE_CONFIG[n.type] ?? {
        icon: null,
        cls: '',
      };

      toast(title, {
        description: body ?? undefined,
        icon: Icon ? (
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${cls}`}>
            <Icon size={14} />
          </span>
        ) : undefined,
        action: n.actionUrl
          ? {
              label: isAr ? 'عرض' : 'View',
              onClick: () => (window.location.href = n.actionUrl!),
            }
          : undefined,
        duration: 5000,
      });

      // Sound
      new Audio('/sounds/notification.mp3').play().catch(() => {});
    };

    socket.on('notification:new', handleNew);
    return () => {
      socket.off('notification:new', handleNew);
    };
  }, [socket, queryClient, isAr]);
}
