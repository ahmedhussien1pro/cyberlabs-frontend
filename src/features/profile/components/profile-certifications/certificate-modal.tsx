// src/features/profile/components/profile-certifications/certificate-modal.tsx
import { useMemo, useState } from 'react';
import { Download, Link2, Check, X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { generateCertPrintHTML, openCertPrint } from './certificate-template';
import type { UserCertification } from '../../types/profile.types';

interface CertificateModalProps {
  cert: UserCertification | null;
  userName: string;
  open: boolean;
  onClose: () => void;
}

export function CertificateModal({ cert, userName, open, onClose }: CertificateModalProps) {
  const { t, i18n } = useTranslation('profile');
  const isAr = i18n.language === 'ar';
  const [copied, setCopied] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);

  const lang = isAr ? 'ar' : 'en';

  const certHtml = useMemo(() => {
    if (!cert) return '';
    return generateCertPrintHTML({
      recipientName: userName,
      title: isAr ? (cert.ar_title ?? cert.title) : cert.title,
      certType: cert.certType ?? 'COURSE',
      completedAt: cert.issueDate,
      certId: cert.credentialId ?? cert.id,
      language: lang,
    });
  }, [cert, userName, isAr, lang]);

  if (!cert) return null;

  const displayTitle = isAr ? (cert.ar_title ?? cert.title) : cert.title;

  const handleDownload = () => {
    setPopupBlocked(false);
    openCertPrint(
      {
        recipientName: userName,
        title: isAr ? (cert.ar_title ?? cert.title) : cert.title,
        certType: cert.certType ?? 'COURSE',
        completedAt: cert.issueDate,
        certId: cert.credentialId ?? cert.id,
      },
      lang,
      () => setPopupBlocked(true),
    );
  };

  const handleShare = async () => {
    const url =
      cert.credentialUrl ??
      (cert.credentialId
        ? `${window.location.origin}/certificates/${cert.credentialId}`
        : window.location.href);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard API غير متاحة — fallback بدون alert
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl gap-0 overflow-hidden rounded-2xl p-0'>
        {/* ── Header ── */}
        <DialogHeader className='flex-row items-start justify-between border-b border-border/40 px-5 py-3'>
          <div className='min-w-0'>
            <DialogTitle className='truncate text-sm font-bold'>
              {displayTitle}
            </DialogTitle>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              {t('certifications.completionCert')}
              {' · '}
              {t('certifications.academy')}
            </p>
          </div>
          <Button variant='ghost' size='icon' className='-mt-0.5 h-7 w-7 shrink-0' onClick={onClose}>
            <X className='h-3.5 w-3.5' />
          </Button>
        </DialogHeader>

        {/* ── Certificate Preview ── */}
        <div className='bg-zinc-100 px-5 py-4 dark:bg-zinc-900'>
          <div
            className='w-full overflow-hidden rounded-xl border border-border/20 shadow-md'
            style={{ aspectRatio: '297 / 210' }}>
            <iframe
              srcDoc={certHtml}
              title='Certificate Preview'
              className='block h-full w-full border-0'
              sandbox='allow-same-origin'
            />
          </div>
        </div>

        {/* ── Popup blocked warning ── */}
        {popupBlocked && (
          <div className='flex items-center gap-2 border-t border-yellow-500/20 bg-yellow-500/5 px-5 py-2.5 text-xs text-yellow-600 dark:text-yellow-400'>
            <AlertTriangle className='h-3.5 w-3.5 shrink-0' />
            {t('certifications.popupWarning')}
          </div>
        )}

        {/* ── Actions ── */}
        <div className='flex flex-wrap items-center gap-2 border-t border-border/40 bg-muted/10 px-5 py-3'>
          <Button size='sm' onClick={handleDownload} className='gap-1.5'>
            <Download className='h-3.5 w-3.5' />
            {t('certifications.downloadPdf')}
          </Button>

          <Button
            size='sm'
            variant='outline'
            onClick={handleShare}
            className={cn(
              'gap-1.5 transition-all',
              copied && 'border-green-500/50 bg-green-500/5 text-green-600',
            )}>
            {copied ? (
              <><Check className='h-3.5 w-3.5' /> {t('certifications.copied')}</>
            ) : (
              <><Link2 className='h-3.5 w-3.5' /> {t('certifications.shareLink')}</>
            )}
          </Button>

          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='ms-auto text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline'>
              {t('certifications.verifyLink')}
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
