import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Archive, Bell, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Notification } from '../types/notification.types';
import { NotificationDetailModal } from './notification-detail-modal';
import { TYPE_CONFIG } from './type-config';

const FALLBACK = { icon: Bell, cls: 'bg-muted text-muted-foreground' };

interface Props {
  notification: Notification;
  onRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
  isArchived?: boolean;
}

export const NotificationItem = forwardRef<HTMLDivElement, Props>(
  (
    { notification: n, onRead, onArchive, onDelete, index, isArchived },
    ref,
  ) => {
    const { t, i18n } = useTranslation('notifications');
    const navigate = useNavigate();
    const isAr = i18n.language === 'ar';
    const locale = isAr ? ar : enUS;
    const { icon: Icon, cls } = TYPE_CONFIG[n.type] ?? FALLBACK;
    const [modalOpen, setModalOpen] = useState(false);
    const title = isAr ? (n.ar_title ?? n.title) : n.title;
    const body = isAr ? (n.ar_body ?? n.body) : n.body;

    const handleClick = () => {
      if (!n.isRead) onRead(n.id);
      if (n.actionUrl) {
        navigate(n.actionUrl);
      } else {
        setModalOpen(true);
      }
    };

    return (
      <TooltipProvider delayDuration={400}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ delay: index * 0.03, duration: 0.2 }}
          className={cn(
            'group relative flex cursor-pointer items-start gap-3 px-4 py-3',
            'border-b border-border/20 last:border-0',
            'transition-colors hover:bg-muted/30',
            !n.isRead && !isArchived && 'bg-primary/[0.03]',
          )}
          onClick={handleClick}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
          {/* ── Unread dot ───────────────────────── */}
          {!n.isRead && !isArchived && (
            <span className='absolute start-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary' />
          )}

          {/* ── Type icon ────────────────────────── */}
          <div
            className={cn(
              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
              cls,
            )}>
            <Icon size={15} />
          </div>

          {/* ── Content ──────────────────────────── */}
          <div className='min-w-0 flex-1 space-y-0.5'>
            <p
              className={cn(
                'truncate text-sm',
                n.isRead ? 'font-normal' : 'font-semibold',
              )}>
              {title}
            </p>
            {body && (
              <p className='line-clamp-2 text-xs text-muted-foreground'>
                {body}
              </p>
            )}
            <p className='text-[10px] text-muted-foreground/50'>
              {formatDistanceToNow(new Date(n.createdAt), {
                addSuffix: true,
                locale,
              })}
            </p>
          </div>

          {/* ── Actions (visible on hover) ────────── */}
          <div className='flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
            {!isArchived && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 text-muted-foreground hover:text-foreground'
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(n.id);
                    }}>
                    <Archive size={11} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>
                  {t('actions.archive')}
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 text-muted-foreground hover:text-destructive'
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(n.id);
                  }}>
                  {isArchived ? <Trash2 size={11} /> : <X size={11} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side='left'>{t('actions.delete')}</TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
        <NotificationDetailModal
          notification={modalOpen ? n : null}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </TooltipProvider>
    );
  },
);
NotificationItem.displayName = 'NotificationItem';
