import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Notification } from '../types/notification.types';
import { TYPE_CONFIG } from './type-config';

interface Props {
  notification: Notification | null;
  open: boolean;
  onClose: () => void;
}

const PRIORITY_BADGE: Record<string, string> = {
  LOW: 'bg-slate-500/10 text-slate-400',
  MEDIUM: 'bg-blue-500/10  text-blue-400',
  HIGH: 'bg-orange-500/10 text-orange-400',
  URGENT: 'bg-red-500/10   text-red-500',
};

export function NotificationDetailModal({
  notification: n,
  open,
  onClose,
}: Props) {
  const { t, i18n } = useTranslation('notifications');
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';
  const locale = isAr ? ar : enUS;

  if (!n) return null;

  const title = isAr ? (n.ar_title ?? n.title) : n.title;
  const body = isAr ? (n.ar_body ?? n.body) : n.body;
  const { icon: Icon, cls } = TYPE_CONFIG[n.type] ?? { icon: null, cls: '' };

  const handleNavigate = () => {
    onClose();
    if (n.actionUrl) navigate(n.actionUrl);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='max-w-md'>
        <DialogHeader className='flex-row items-start gap-3 space-y-0 pb-3'>
          {Icon && (
            <div
              className={cn(
                'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                cls,
              )}>
              <Icon size={18} />
            </div>
          )}
          <div className='flex-1 min-w-0'>
            <DialogTitle className='text-base leading-snug'>
              {title}
            </DialogTitle>
            <p className='mt-1 text-[11px] text-muted-foreground'>
              {formatDistanceToNow(new Date(n.createdAt), {
                addSuffix: true,
                locale,
              })}
            </p>
          </div>
          <DialogClose asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 shrink-0 -mt-1 -me-1'>
              <X size={14} />
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* Body */}
        {body && (
          <p className='text-sm text-muted-foreground leading-relaxed px-1'>
            {body}
          </p>
        )}

        {/* Priority badge */}
        <div className='flex items-center justify-between pt-2'>
          <Badge
            variant='outline'
            className={cn('text-[10px] h-5', PRIORITY_BADGE[n.priority] ?? '')}>
            {t(`priority.${n.priority.toLowerCase()}`, n.priority)}
          </Badge>

          {n.actionUrl && (
            <Button
              size='sm'
              className='h-8 gap-1.5 text-xs'
              onClick={handleNavigate}>
              <ExternalLink size={12} />
              {t('modal.goTo', 'Go to page')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
