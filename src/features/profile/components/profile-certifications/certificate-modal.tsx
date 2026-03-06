// src/features/profile/components/profile-certifications/certificate-modal.tsx
import { useMemo, useState } from 'react';
import { Download, Link2, Check, X } from 'lucide-react';
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

export function CertificateModal({
  cert,
  userName,
  open,
  onClose,
}: CertificateModalProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [copied, setCopied] = useState(false);

  // HTML للـ iframe preview — يُعاد حسابه لما يتغير الـ cert أو اللغة
  const certHtml = useMemo(() => {
    if (!cert) return '';
    return generateCertPrintHTML({
      recipientName: userName,
      title: isAr ? (cert.ar_title ?? cert.title) : cert.title,
      certType: cert.certType ?? 'COURSE',
      completedAt: cert.issueDate,
      certId: cert.credentialId ?? cert.id,
      language: isAr ? 'ar' : 'en',
    });
  }, [cert, userName, isAr]);

  if (!cert) return null;

  const displayTitle = isAr ? (cert.ar_title ?? cert.title) : cert.title;

  const handleDownload = () =>
    openCertPrint(
      {
        recipientName: userName,
        title: isAr ? (cert.ar_title ?? cert.title) : cert.title,
        certType: cert.certType ?? 'COURSE',
        completedAt: cert.issueDate,
        certId: cert.credentialId ?? cert.id,
      },
      isAr ? 'ar' : 'en',
    );

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
      prompt(isAr ? 'انسخ الرابط:' : 'Copy this link:', url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl gap-0 p-0 overflow-hidden rounded-2xl'>
        {/* ── Header ── */}
        <DialogHeader className='flex-row items-start justify-between px-5 py-3 border-b border-border/40'>
          <div className='min-w-0'>
            <DialogTitle className='text-sm font-bold truncate'>
              {displayTitle}
            </DialogTitle>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {isAr ? 'شهادة إتمام' : 'Certificate of Completion'}
              {' · '}CyberLabs Academy
            </p>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7 shrink-0 -mt-0.5'
            onClick={onClose}>
            <X className='h-3.5 w-3.5' />
          </Button>
        </DialogHeader>

        {/* ── Certificate Preview via iframe ── */}
        <div className='bg-zinc-100 dark:bg-zinc-900 px-5 py-4'>
          <div
            className='w-full rounded-xl overflow-hidden shadow-md border border-border/20'
            style={{ aspectRatio: '297 / 210' }}>
            <iframe
              srcDoc={certHtml}
              title='Certificate Preview'
              className='w-full h-full border-0 block'
              sandbox='allow-same-origin'
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className='flex flex-wrap items-center gap-2 px-5 py-3 border-t border-border/40 bg-muted/10'>
          <Button size='sm' onClick={handleDownload} className='gap-1.5'>
            <Download className='h-3.5 w-3.5' />
            {isAr ? 'تنزيل PDF' : 'Download PDF'}
          </Button>

          <Button
            size='sm'
            variant='outline'
            onClick={handleShare}
            className={cn(
              'gap-1.5 transition-all',
              copied && 'border-green-500/50 text-green-600 bg-green-500/5',
            )}>
            {copied ? (
              <>
                <Check className='h-3.5 w-3.5' />
                {isAr ? 'تم النسخ!' : 'Copied!'}
              </>
            ) : (
              <>
                <Link2 className='h-3.5 w-3.5' />
                {isAr ? 'مشاركة الرابط' : 'Share Link'}
              </>
            )}
          </Button>

          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='ms-auto text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors'>
              {isAr ? 'التحقق من الشهادة' : 'Verify credential'}
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
