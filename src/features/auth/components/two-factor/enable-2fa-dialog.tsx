import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGenerate2FA, useEnable2FA } from '../../hooks/use-two-factor';

type Step = 'loading' | 'scan' | 'verify' | 'done';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: (backupCodes?: string[]) => void;
}

export function Enable2FADialog({ open, onClose, onSuccess }: Props) {
  const { t } = useTranslation('settings');

  const [step, setStep] = useState<Step>('loading');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [backups, setBackups] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const generate = useGenerate2FA();
  const enable = useEnable2FA();

  useEffect(() => {
    if (!open) {
      setStep('loading');
      setCode('');
      return;
    }
    generate.mutate(undefined, {
      onSuccess: (data) => {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setStep('scan');
      },
      onError: () => onClose(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (step === 'verify') setTimeout(() => inputRef.current?.focus(), 100);
  }, [step]);

  const handleVerify = () => {
    if (code.length !== 6) return;
    enable.mutate(code, {
      onSuccess: (data) => {
        setBackups(data.backupCodes ?? []);
        setStep('done');
        onSuccess?.(data.backupCodes);
      },
    });
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='max-w-md'>
        {/* ── LOADING ──────────────────────────────────── */}
        {step === 'loading' && (
          <div className='flex flex-col items-center gap-4 py-8'>
            <Loader2 size={36} className='animate-spin text-primary' />
            <p className='text-sm text-muted-foreground'>
              {t('2fa.generating')}
            </p>
          </div>
        )}

        {/* ── SCAN ─────────────────────────────────────── */}
        {step === 'scan' && (
          <>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Smartphone size={18} className='text-primary' />
                {t('2fa.enableTitle')}
              </DialogTitle>
              <DialogDescription>{t('2fa.scanDesc')}</DialogDescription>
            </DialogHeader>

            {/* QR Code */}
            <div className='flex flex-col items-center gap-3'>
              <div className='rounded-xl border border-border/40 bg-white p-3'>
                <img src={qrCode} alt='2FA QR Code' className='h-44 w-44' />
              </div>
              <p className='text-center text-xs text-muted-foreground'>
                {t('2fa.cantScan')}
              </p>

              {/* Manual secret */}
              <div className='flex w-full items-center gap-2 rounded-lg border border-border/40 bg-muted px-3 py-2'>
                <code className='flex-1 select-all font-mono text-xs text-foreground'>
                  {secret}
                </code>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7 shrink-0'
                  onClick={copySecret}>
                  {copied ? (
                    <Check size={13} className='text-green-500' />
                  ) : (
                    <Copy size={13} />
                  )}
                </Button>
              </div>
            </div>

            {/* Apps */}
            <p className='text-center text-xs text-muted-foreground'>
              {t('2fa.useApp')}
            </p>

            <div className='flex gap-2'>
              <Button variant='outline' className='flex-1' onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button className='flex-1' onClick={() => setStep('verify')}>
                {t('2fa.nextVerify')}
              </Button>
            </div>
          </>
        )}

        {/* ── VERIFY ───────────────────────────────────── */}
        {step === 'verify' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('2fa.verifyTitle')}</DialogTitle>
              <DialogDescription>{t('2fa.verifyDesc')}</DialogDescription>
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
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
            </div>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => setStep('scan')}>
                {t('2fa.back')}
              </Button>
              <Button
                className='flex-1 gap-2'
                disabled={code.length !== 6 || enable.isPending}
                onClick={handleVerify}>
                {enable.isPending && (
                  <Loader2 size={14} className='animate-spin' />
                )}
                {t('2fa.verify')}
              </Button>
            </div>
          </>
        )}

        {/* ── DONE ─────────────────────────────────────── */}
        {step === 'done' && (
          <>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2 text-green-500'>
                <ShieldCheck size={20} />
                {t('2fa.doneTitle')}
              </DialogTitle>
              <DialogDescription>{t('2fa.doneDesc')}</DialogDescription>
            </DialogHeader>

            {backups.length > 0 && (
              <div className='space-y-2'>
                <p className='text-sm font-medium'>
                  {t('2fa.backupCodesTitle')}
                </p>
                <div className='grid grid-cols-2 gap-1.5 rounded-lg border border-border/40 bg-muted p-3'>
                  {backups.map((code) => (
                    <code
                      key={code}
                      className='font-mono text-xs text-foreground'>
                      {code}
                    </code>
                  ))}
                </div>
                <p className='text-xs text-destructive'>
                  {t('2fa.backupCodesWarning')}
                </p>
              </div>
            )}

            <Button className='w-full' onClick={onClose}>
              {t('2fa.done')}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
