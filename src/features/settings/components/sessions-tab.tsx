// src/features/settings/components/sessions-tab.tsx
import { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Loader2,
  Trash2,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
      className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
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

        <div className='mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground'>
          <span>
            {t('sessions.lastActive')}:{' '}
            {formatDistanceToNow(new Date(session.lastActiveAt), {
              addSuffix: true,
            })}
          </span>
          <span>
            {t('sessions.createdAt')}:{' '}
            {format(new Date(session.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      </div>

      {!session.isCurrent && (
        <Button
          variant='ghost'
          size='icon'
          className='mt-0.5 shrink-0 text-muted-foreground hover:text-destructive'
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const currentSession = data?.find((s) => s.isCurrent);
  const others = data?.filter((s) => !s.isCurrent) ?? [];

  return (
    <div className='space-y-4'>
      {/* ── Header ────────────────────────────────── */}
      <div className='flex items-start justify-between gap-3'>
        <div>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-semibold'>{t('sessions.title')}</p>
            {!isLoading && data && (
              <Badge variant='outline' className='h-5 text-[10px]'>
                {data.length}
              </Badge>
            )}
          </div>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            {t('sessions.subtitle')}
          </p>
        </div>

        {others.length > 0 && (
          <Button
            variant='outline'
            size='sm'
            className='shrink-0 gap-1.5 text-destructive hover:text-destructive'
            disabled={revokeAll.isPending}
            onClick={() => setConfirmOpen(true)}>
            {revokeAll.isPending ? (
              <Loader2 size={13} className='animate-spin' />
            ) : (
              <LogOut size={13} />
            )}
            {t('sessions.revokeAll')}
          </Button>
        )}
      </div>

      {/* ── Content ───────────────────────────────── */}
      {isLoading ? (
        <div className='space-y-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-24 w-full rounded-xl' />
          ))}
        </div>
      ) : isError ? (
        <div className='flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/60 py-10 text-center'>
          <Globe size={28} className='opacity-30' />
          <p className='text-sm text-muted-foreground'>
            {t('sessions.unavailable')}
          </p>
        </div>
      ) : (
        <div className='space-y-2'>
          {/* Current session first */}
          {currentSession && <SessionRow session={currentSession} />}

          {others.length > 0 ? (
            <>
              <p className='px-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50'>
                {t('sessions.otherSessions')}
              </p>
              {others.map((s) => (
                <SessionRow key={s.id} session={s} />
              ))}
            </>
          ) : (
            <div className='flex items-center gap-3 rounded-xl border border-dashed border-border/50 bg-muted/20 px-4 py-5'>
              <ShieldAlert size={20} className='text-muted-foreground/40' />
              <p className='text-sm text-muted-foreground'>
                {t('sessions.noOtherSessions')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Confirm revoke-all ─────────────────────── */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('sessions.revokeAllTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('sessions.revokeAllDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={() => {
                revokeAll.mutate();
                setConfirmOpen(false);
              }}>
              {t('sessions.revokeAll')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
