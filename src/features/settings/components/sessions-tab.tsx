import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetSessions,
  useRevokeSession,
  useRevokeAllSessions,
} from '../hooks/use-sessions';
import type { Session } from '../types/settings.types';

const DEVICE_ICON = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: Globe,
};

function SessionRow({ session }: { session: Session }) {
  const { t } = useTranslation('settings');
  const revoke = useRevokeSession();
  const Icon = DEVICE_ICON[session.deviceType] ?? Globe;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition-colors
      ${
        session.isCurrent
          ? 'border-primary/30 bg-primary/5'
          : 'border-border/40 bg-card hover:border-border/60'
      }`}>
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted'>
        <Icon size={18} className='text-muted-foreground' />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <p className='text-sm font-medium'>
            {session.browser} · {session.os}
          </p>
          {session.isCurrent && (
            <Badge className='h-5 bg-primary/10 text-[10px] text-primary'>
              {t('sessions.current')}
            </Badge>
          )}
        </div>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          {session.ipAddress}
          {session.location && ` · ${session.location}`}
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          {t('sessions.lastActive')}:{' '}
          {formatDistanceToNow(new Date(session.lastActiveAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {!session.isCurrent && (
        <Button
          variant='ghost'
          size='icon'
          className='shrink-0 text-muted-foreground hover:text-destructive'
          disabled={revoke.isPending}
          onClick={() => revoke.mutate(session.id)}>
          {revoke.isPending ? (
            <Loader2 size={14} className='animate-spin' />
          ) : (
            <Trash2 size={14} />
          )}
        </Button>
      )}
    </div>
  );
}

export function SessionsTab() {
  const { t } = useTranslation('settings');
  const { data, isLoading, isError } = useGetSessions();
  const revokeAll = useRevokeAllSessions();
  const others = data?.filter((s) => !s.isCurrent) ?? [];

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium'>{t('sessions.title')}</p>
          <p className='text-xs text-muted-foreground'>
            {t('sessions.subtitle')}
          </p>
        </div>
        {others.length > 0 && (
          <Button
            variant='outline'
            size='sm'
            className='text-destructive hover:text-destructive gap-2'
            disabled={revokeAll.isPending}
            onClick={() => revokeAll.mutate()}>
            {revokeAll.isPending && (
              <Loader2 size={13} className='animate-spin' />
            )}
            {t('sessions.revokeAll')}
          </Button>
        )}
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-24 w-full rounded-xl' />
        ))
      ) : isError ? (
        <div className='flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/60 py-10 text-center'>
          <Globe size={28} className='opacity-30' />
          <p className='text-sm text-muted-foreground'>
            {t('sessions.unavailable')}
          </p>
        </div>
      ) : (
        <div className='space-y-2'>
          {data?.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
