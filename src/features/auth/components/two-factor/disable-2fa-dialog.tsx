import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ShieldOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDisable2FA } from '../../hooks/use-two-factor';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function Disable2FADialog({ open, onClose }: Props) {
  const { t } = useTranslation('settings');
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const disable = useDisable2FA();

  useEffect(() => {
    if (!open) {
      setCode('');
      return;
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleSubmit = () => {
    if (code.length !== 6) return;
    disable.mutate(code, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <ShieldOff size={18} />
            {t('2fa.disableTitle')}
          </DialogTitle>
          <DialogDescription>{t('2fa.disableDesc')}</DialogDescription>
        </DialogHeader>

        <div className='space-y-3'>
          <Input
            ref={inputRef}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder='000000'
            className='text-center font-mono text-2xl tracking-[0.4em]'
            maxLength={6}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div className='flex gap-2'>
          <Button variant='outline' className='flex-1' onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            variant='destructive'
            className='flex-1 gap-2'
            disabled={code.length !== 6 || disable.isPending}
            onClick={handleSubmit}>
            {disable.isPending && (
              <Loader2 size={14} className='animate-spin' />
            )}
            {t('2fa.disableConfirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
