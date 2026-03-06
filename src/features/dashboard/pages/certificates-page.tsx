// src/features/dashboard/pages/certificates-page.tsx
import { useState } from 'react';
import {
  Award,
  Share2,
  Download,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Copy,
  Printer,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useMyCertificates, type IssuedCertificate } from '../hooks/use-certificates-data';
import { ROUTES } from '@/shared/constants';

const DIFF_COLORS: Record<string, string> = {
  BEGINNER: 'text-green-500 bg-green-500/10 border-green-500/20',
  INTERMEDIATE: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  ADVANCED: 'text-red-500 bg-red-500/10 border-red-500/20',
};

function CertCard({
  cert,
  index,
}: {
  cert: IssuedCertificate;
  index: number;
}) {
  const { i18n } = useTranslation('dashboard');
  const [copied, setCopied] = useState(false);
  const isAr = i18n.language === 'ar';

  const courseTitle = isAr
    ? (cert.course.ar_title ?? cert.course.title)
    : cert.course.title;
  const diffColor =
    DIFF_COLORS[cert.course.difficulty?.toUpperCase() ?? ''] ??
    'text-muted-foreground bg-muted border-border/40';

  const shareUrl = `${window.location.origin}/verify/${cert.verificationId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: create a temp input element
      const el = document.createElement('input');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    if (cert.certificateUrl) {
      window.open(cert.certificateUrl, '_blank');
    } else {
      window.print();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className='group relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all hover:border-primary/20 hover:shadow-md'>
      {/* Top accent */}
      <div className='h-1 w-full bg-gradient-to-r from-primary to-cyan-400' />

      <div className='p-5'>
        {/* Course thumbnail + info */}
        <div className='flex items-start gap-4'>
          <div className='flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10'>
            {cert.course.thumbnail ? (
              <img
                src={cert.course.thumbnail}
                alt={courseTitle}
                className='h-full w-full object-cover'
              />
            ) : (
              <BookOpen size={22} className='text-primary' />
            )}
          </div>

          <div className='min-w-0 flex-1'>
            <Link
              to={ROUTES.COURSES?.DETAIL?.(cert.course.id) ?? `/courses/${cert.course.slug}`}
              className='line-clamp-2 text-sm font-bold hover:text-primary transition-colors'>
              {courseTitle}
            </Link>

            <div className='mt-1.5 flex flex-wrap items-center gap-2'>
              {cert.course.difficulty && (
                <Badge className={`border text-[10px] ${diffColor}`}>
                  {cert.course.difficulty}
                </Badge>
              )}
              <span className='flex items-center gap-1 text-[10px] text-green-500 font-semibold'>
                <CheckCircle2 size={10} />
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Certificate meta */}
        <div className='mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-muted/30 px-3 py-2.5'>
          <div className='flex items-center gap-1.5 text-[11px] text-muted-foreground'>
            <Calendar size={11} />
            <span>Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
          </div>
          <div className='h-3 w-px bg-border/50' />
          <div className='flex items-center gap-1.5 text-[11px] text-muted-foreground'>
            <ShieldCheck size={11} className='text-green-500' />
            <span className='font-mono text-[10px]'>{cert.verificationId}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className='mt-4 flex items-center gap-2'>
          {/* Share / Copy link */}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size='sm'
                  variant={copied ? 'default' : 'outline'}
                  onClick={handleCopy}
                  className={cn(
                    'h-8 gap-1.5 flex-1 text-xs',
                    copied && 'bg-green-500 hover:bg-green-600 border-green-500',
                  )}>
                  {copied ? (
                    <><CheckCircle2 size={12} /> Copied!</>
                  ) : (
                    <><Copy size={12} /> Share Link</>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-xs'>{shareUrl}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Download / Print */}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={handleDownload}
                  className='h-8 w-8 p-0 shrink-0'>
                  {cert.certificateUrl ? (
                    <Download size={13} />
                  ) : (
                    <Printer size={13} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-xs'>
                  {cert.certificateUrl
                    ? 'Download Certificate'
                    : 'Save as PDF (Print)'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Verify public link */}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size='sm'
                  variant='ghost'
                  asChild
                  className='h-8 w-8 p-0 shrink-0'>
                  <a href={shareUrl} target='_blank' rel='noopener noreferrer'>
                    <ExternalLink size={13} />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-xs'>View Certificate Page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}

export default function CertificatesPage(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, isError } = useMyCertificates();

  return (
    <div className='container max-w-5xl space-y-6 py-6'>
      {/* Header */}
      <div className='flex flex-col gap-1'>
        <h1 className='flex items-center gap-2 text-xl font-black tracking-tight'>
          <Award className='text-yellow-500' size={24} />
          {t('certificates.title', 'My Certificates')}
          {data && data.length > 0 && (
            <span className='ml-1 rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-sm font-semibold text-yellow-500'>
              {data.length}
            </span>
          )}
        </h1>
        <p className='text-sm text-muted-foreground'>
          {t(
            'certificates.subtitle',
            'Your earned certificates — shareable and verifiable',
          )}
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-56 rounded-2xl' />
          ))}
        </div>
      ) : isError ? (
        <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-destructive/30 py-16 text-destructive'>
          <AlertCircle size={32} className='opacity-50' />
          <p className='text-sm font-medium'>
            {t('common.errorLoading', 'Failed to load certificates')}
          </p>
        </div>
      ) : !data || data.length === 0 ? (
        <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 py-20 text-center text-muted-foreground'>
          <Award size={36} className='opacity-25' />
          <p className='text-sm font-semibold'>
            {t('certificates.empty', 'No certificates yet')}
          </p>
          <p className='text-xs max-w-xs'>
            {t(
              'certificates.emptyHint',
              'Complete a course to earn your first certificate!',
            )}
          </p>
          <Button asChild variant='outline' size='sm' className='mt-2'>
            <Link to={ROUTES.COURSES?.LIST ?? '/courses'}>
              {t('certificates.exploreCourses', 'Explore Courses')}
            </Link>
          </Button>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {data.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      )}

      {/* Info bar */}
      <div className='flex items-start gap-3 rounded-xl border border-border/30 bg-muted/20 p-4'>
        <ShieldCheck size={16} className='mt-0.5 shrink-0 text-green-500' />
        <div className='space-y-0.5'>
          <p className='text-xs font-semibold text-foreground'>
            {t('certificates.verifyTitle', 'All certificates are publicly verifiable')}
          </p>
          <p className='text-xs text-muted-foreground'>
            {t(
              'certificates.verifyDesc',
              'Share your certificate link with employers. Anyone can verify authenticity without an account.',
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
