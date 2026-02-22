import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Archive, Bell, BellOff, CheckCheck, RefreshCw } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllRead,
  useArchiveNotification,
  useDeleteNotification,
} from '../hooks/use-notifications';
import { NotificationItem } from './notification-item';

type Tab = 'all' | 'unread' | 'archived';

const TABS: Tab[] = ['all', 'unread', 'archived'];

export function NotificationBell() {
  const { t } = useTranslation('notifications');
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('all');

  const { data, isLoading, refetch, isFetching } = useNotifications();

  const markOne = useMarkAsRead();
  const markAll = useMarkAllRead();
  const archive = useArchiveNotification();
  const del = useDeleteNotification();

  /* ── derived data ──────────────────────────────── */
  const all = data?.notifications ?? [];
  const unread = data?.unreadCount ?? 0;
  const hasNew = unread > 0;

  const filtered: Record<Tab, typeof all> = {
    all: all.filter((n) => !n.isArchived),
    unread: all.filter((n) => !n.isRead && !n.isArchived),
    archived: all.filter((n) => n.isArchived),
  };

  const current = filtered[tab];
  const archivedCnt = filtered.archived.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ── Trigger button ────────────────────────── */}
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className={cn(
            'relative transition-colors',
            open
              ? 'bg-primary/10 text-primary hover:bg-primary/15'
              : 'text-muted-foreground',
          )}
          aria-label={t('bell.ariaLabel')}
          aria-expanded={open}>
          {/* Bell icon — shake when new notifs */}
          <motion.div
            animate={
              hasNew && !open ? { rotate: [0, -15, 15, -10, 10, 0] } : {}
            }
            transition={{ repeat: Infinity, repeatDelay: 8, duration: 0.6 }}>
            <Bell size={18} />
          </motion.div>

          {/* ── Count badge ─────────────────────── */}
          <AnimatePresence>
            {hasNew && (
              <motion.span
                key='unread-badge'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className='absolute -right-0.5 -top-0.5 flex h-[18px]
                           min-w-[18px] items-center justify-center rounded-full
                           bg-red-500 px-1 font-mono text-[9px] font-bold
                           leading-none text-white shadow-sm'>
                {unread > 99 ? '99+' : unread}
              </motion.span>
            )}
          </AnimatePresence>

          {/* ── Dot indicator (no count, just presence) ─ */}
          {!hasNew && archivedCnt > 0 && (
            <span
              className='absolute right-0.5 top-0.5 h-1.5 w-1.5
                          rounded-full bg-muted-foreground/40'
            />
          )}
        </Button>
      </PopoverTrigger>

      {/* ── Panel ─────────────────────────────────── */}
      <PopoverContent
        align='end'
        sideOffset={10}
        className='w-[360px] max-w-[calc(100vw-1rem)] p-0 shadow-2xl'>
        {/* Panel Header */}
        <div className='flex items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-2'>
            <h2 className='text-sm font-semibold'>{t('panel.title')}</h2>
            {hasNew && (
              <Badge
                className='h-4 min-w-4 rounded-full bg-red-500 px-1.5
                                text-[10px] font-bold text-white'>
                {unread}
              </Badge>
            )}
          </div>

          <div className='flex items-center gap-1'>
            {/* Refresh */}
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-muted-foreground'
              onClick={() => refetch()}
              disabled={isFetching}>
              <RefreshCw
                size={13}
                className={cn(isFetching && 'animate-spin')}
              />
            </Button>

            {/* Mark all read — only when unread exist */}
            {hasNew && tab !== 'archived' && (
              <Button
                variant='ghost'
                size='sm'
                className='h-7 gap-1.5 px-2 text-xs text-muted-foreground'
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}>
                <CheckCheck size={12} />
                {t('panel.markAll')}
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* ── Tab Bar ──────────────────────────────── */}
        <div className='flex gap-0.5 px-3 pt-2'>
          {TABS.map((tb) => {
            const count =
              tb === 'unread'
                ? filtered.unread.length
                : tb === 'archived'
                  ? archivedCnt
                  : filtered.all.length;

            return (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2.5 py-1.5',
                  'text-xs font-medium transition-colors',
                  tab === tb
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}>
                {tb === 'archived' ? <Archive size={11} /> : null}
                {t(`panel.tab.${tb}`)}
                {count > 0 && (
                  <span
                    className={cn(
                      'rounded-full px-1 font-mono text-[9px] leading-tight',
                      tab === tb
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── List ─────────────────────────────────── */}
        <div className='max-h-[380px] overflow-y-auto scroll-smooth py-1.5'>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='flex items-start gap-3 px-4 py-3'>
                <Skeleton className='h-8 w-8 shrink-0 rounded-lg' />
                <div className='flex-1 space-y-1.5'>
                  <Skeleton className='h-3.5 w-3/4' />
                  <Skeleton className='h-3 w-full' />
                  <Skeleton className='h-2.5 w-1/3' />
                </div>
              </div>
            ))
          ) : current.length === 0 ? (
            /* ── Empty state ──────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex flex-col items-center gap-2.5
                          py-12 text-muted-foreground'>
              {tab === 'archived' ? (
                <Archive size={28} className='opacity-25' />
              ) : (
                <BellOff size={28} className='opacity-25' />
              )}
              <p className='text-xs font-medium'>
                {tab === 'unread'
                  ? t('panel.empty.unread')
                  : tab === 'archived'
                    ? t('panel.empty.archived')
                    : t('panel.empty.all')}
              </p>
              {tab === 'all' && (
                <p className='text-[11px] text-muted-foreground/50'>
                  {t('panel.empty.allHint')}
                </p>
              )}
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {current.map((n, i) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  index={i}
                  isArchived={tab === 'archived'}
                  onRead={(id) => markOne.mutate(id)}
                  onArchive={(id) => archive.mutate(id)}
                  onDelete={(id) => del.mutate(id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* ── Footer ───────────────────────────────── */}
        {current.length > 0 && (
          <>
            <Separator />
            <p className='px-4 py-2 text-center text-[11px] text-muted-foreground/50'>
              {t('panel.endOfList')}
            </p>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
