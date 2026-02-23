import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  createdAt: string;
  readAt?: string | null;
};

type NotificationsResponse = {
  items: NotificationItem[];
  unreadCount: number;
};

async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/notifications?limit=10`,
    {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

async function markAllRead(): Promise<void> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/notifications/mark-all-read`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!res.ok) throw new Error('Failed to mark all as read');
}

async function markOneRead(id: string): Promise<void> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!res.ok) throw new Error('Failed to mark notification as read');
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export function NavbarNotifications() {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const { data } = useQuery({
    queryKey: ['notifications', 'navbar'],
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
  });

  const unreadCount = data?.unreadCount ?? 0;
  const items = data?.items ?? [];

  const markAllMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markOneMutation = useMutation({
    mutationFn: markOneRead,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 ? (
            <span
              className='absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] leading-[18px] text-center'
              aria-label={`Unread notifications: ${unreadCount}`}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-96'>
        <div className='flex items-center justify-between px-2 py-1.5'>
          <DropdownMenuLabel className='p-0'>Notifications</DropdownMenuLabel>
          <Button
            variant='ghost'
            className='h-8 px-2 text-xs'
            disabled={unreadCount === 0 || markAllMutation.isPending}
            onClick={() => markAllMutation.mutate()}>
            Mark all read
          </Button>
        </div>

        <DropdownMenuSeparator />

        {items.length === 0 ? (
          <div className='px-3 py-8 text-sm text-muted-foreground'>
            No notifications yet.
          </div>
        ) : (
          <div className='max-h-[340px] overflow-auto'>
            {items.map((n) => {
              const isUnread = !n.readAt;
              return (
                <DropdownMenuItem
                  key={n.id}
                  className='flex flex-col items-start gap-1 py-2'
                  onSelect={(e) => {
                    e.preventDefault(); // نخلي الدروبداون مفتوح لو حابب
                    if (isUnread && !markOneMutation.isPending) {
                      markOneMutation.mutate(n.id);
                    }
                  }}>
                  <div className='flex w-full items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <div className='text-sm font-medium truncate'>
                        {n.title}
                      </div>
                      {n.body ? (
                        <div className='text-xs text-muted-foreground line-clamp-2'>
                          {n.body}
                        </div>
                      ) : null}
                    </div>

                    {isUnread ? (
                      <span className='mt-1 h-2 w-2 rounded-full bg-primary' />
                    ) : null}
                  </div>

                  <div className='text-[11px] text-muted-foreground'>
                    {formatTime(n.createdAt)}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            // هنا تقدر تعمل navigate لصفحة كل الإشعارات
            // navigate('/notifications')
          }}>
          View all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
