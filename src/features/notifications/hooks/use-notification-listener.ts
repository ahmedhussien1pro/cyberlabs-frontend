import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSocket } from '@/core/providers/socket-provider';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';

export function useNotificationListener() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: any) => {
      // Invalidate queries to update notification bell count and list
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Play sound (optional)
      const audio = new Audio('/sounds/notification.mp3'); // Ensure this file exists in public/sounds
      audio.play().catch(() => {});

      // Show toast
      const title = isAr ? notification.ar_title || notification.title : notification.title;
      const body = isAr ? notification.ar_body || notification.body : notification.body;

      toast(title, {
        description: body,
        icon: <Bell className="h-4 w-4 text-primary" />,
        action: notification.actionUrl ? {
          label: isAr ? 'عرض' : 'View',
          onClick: () => window.location.href = notification.actionUrl,
        } : undefined,
        duration: 5000,
      });
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, queryClient, isAr]);
}
