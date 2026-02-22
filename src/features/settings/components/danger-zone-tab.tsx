import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Download, Loader2, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useDeleteAccount } from '../hooks/use-delete-account';
import { exportMyData } from '../api/settings.api';

const schema = z.object({
  confirmation: z.literal('DELETE'),
  password: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

function DeleteAccountDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation('settings');
  const { mutate, isPending } = useDeleteAccount();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onChange' });

  const onSubmit = ({ password }: FormData) => {
    mutate(password, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset();
          onClose();
        }
      }}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <AlertTriangle size={18} />
            {t('dangerZone.deleteTitle')}
          </DialogTitle>
          <DialogDescription>{t('dangerZone.deleteDesc')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='confirm-text'>{t('dangerZone.typeDelete')}</Label>
            <Input
              id='confirm-text'
              placeholder='DELETE'
              {...register('confirmation')}
              className='font-mono'
            />
            {errors.confirmation && (
              <p className='text-xs text-destructive'>
                {t('dangerZone.typeDeleteError')}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='del-password'>
              {t('dangerZone.confirmPassword')}
            </Label>
            <Input
              id='del-password'
              type='password'
              {...register('password')}
            />
          </div>

          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              className='flex-1'
              onClick={() => {
                reset();
                onClose();
              }}>
              {t('cancel')}
            </Button>
            <Button
              type='submit'
              variant='destructive'
              className='flex-1 gap-2'
              disabled={!isValid || isPending}>
              {isPending && <Loader2 size={14} className='animate-spin' />}
              {t('dangerZone.deleteConfirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DangerZoneTab() {
  const { t } = useTranslation('settings');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { downloadUrl } = await exportMyData();
      if (downloadUrl) window.open(downloadUrl, '_blank');
      toast.success(t('dangerZone.exportSuccess'));
    } catch {
      toast.error(t('dangerZone.exportError'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className='space-y-5'>
      {/* ── Export Data ───────────────────────────── */}
      <div className='rounded-xl border border-border/40 bg-card p-5'>
        <div className='flex items-start gap-3'>
          <Download
            size={20}
            className='mt-0.5 shrink-0 text-muted-foreground'
          />
          <div className='flex-1'>
            <p className='text-sm font-medium'>{t('dangerZone.exportTitle')}</p>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              {t('dangerZone.exportDesc')}
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='shrink-0 gap-2'
            disabled={exporting}
            onClick={handleExport}>
            {exporting ? (
              <Loader2 size={13} className='animate-spin' />
            ) : (
              <Download size={13} />
            )}
            {t('dangerZone.exportBtn')}
          </Button>
        </div>
      </div>

      {/* ── Delete Account ────────────────────────── */}
      <div className='rounded-xl border border-destructive/30 bg-destructive/5 p-5'>
        <div className='flex items-start gap-3'>
          <AlertTriangle
            size={20}
            className='mt-0.5 shrink-0 text-destructive'
          />
          <div className='flex-1'>
            <p className='text-sm font-medium text-destructive'>
              {t('dangerZone.deleteTitle')}
            </p>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              {t('dangerZone.deleteDesc')}
            </p>
          </div>
          <Button
            variant='destructive'
            size='sm'
            className='shrink-0 gap-2'
            onClick={() => setDeleteOpen(true)}>
            <Trash2 size={13} />
            {t('dangerZone.deleteBtn')}
          </Button>
        </div>
      </div>

      <DeleteAccountDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
