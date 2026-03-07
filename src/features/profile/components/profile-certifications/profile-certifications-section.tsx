// src/features/profile/components/profile-certifications/profile-certifications-section.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  ExternalLink,
  Calendar,
  ShieldCheck,
  ShieldOff,
  GraduationCap,
  Route,
  FlaskConical,
  ScrollText,
  FileText,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CertificateModal } from './certificate-modal';
import type { UserCertification } from '../../types/profile.types';

const PLATFORM_ISSUER = 'CyberLabs';

function CertTypeIcon({
  type,
  className,
}: {
  type?: string;
  className?: string;
}) {
  switch (type) {
    case 'COURSE':
      return <GraduationCap className={className} />;
    case 'PATH':
      return <Route className={className} />;
    case 'LAB':
      return <FlaskConical className={className} />;
    default:
      return <ScrollText className={className} />;
  }
}

interface Props {
  certifications: UserCertification[];
  userName: string;
}

export function ProfileCertificationsSection({
  certifications,
  userName,
}: Props) {
  const { t, i18n } = useTranslation('profile');
  const isAr = i18n.language === 'ar';
  const [selected, setSelected] = useState<UserCertification | null>(null);

  if (!certifications.length) return null;

  const now = new Date();

  const platformCerts = certifications.filter(
    (c) => c.issuer === PLATFORM_ISSUER,
  );
  const externalCerts = certifications
    .filter((c) => c.issuer !== PLATFORM_ISSUER)
    .sort((a, b) => {
      const aExp = a.expireDate ? new Date(a.expireDate) : null;
      const bExp = b.expireDate ? new Date(b.expireDate) : null;
      if ((!aExp || aExp > now) && bExp && bExp <= now) return -1;
      if (aExp && aExp <= now && (!bExp || bExp > now)) return 1;
      return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    });

  return (
    <>
      <section className='space-y-4'>
        {/* ── Header ── */}
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <FileText className='h-4 w-4 text-teal-500' />
          {t('certifications.title')}
          <span className='rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-semibold text-teal-500'>
            {certifications.length}
          </span>
        </h2>

        {/* ── Platform Certificates ── */}
        {platformCerts.length > 0 && (
          <div className='space-y-2'>
            {platformCerts.length > 0 && externalCerts.length > 0 && (
              <p className='px-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50'>
                {t('certifications.platformSection')}
              </p>
            )}
            <div className='grid gap-3 sm:grid-cols-2'>
              {platformCerts.map((cert, i) => {
                const title = isAr ? (cert.ar_title ?? cert.title) : cert.title;
                const dateStr = cert.issueDate
                  ? new Date(cert.issueDate).toLocaleDateString(
                      isAr ? 'ar-EG' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' },
                    )
                  : '';

                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={cn(
                      'relative flex flex-col gap-3 rounded-xl border p-4 bg-card',
                      'border-teal-500/25 bg-gradient-to-br from-teal-500/[0.07] to-transparent',
                      'transition-all hover:border-teal-500/40 hover:shadow-sm hover:shadow-teal-500/10',
                    )}>
                    {/* Top */}
                    <div className='flex items-start gap-3'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20'>
                        <CertTypeIcon
                          type={cert.certType}
                          className='h-5 w-5 text-teal-500'
                        />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='font-semibold text-sm text-foreground leading-snug line-clamp-2'>
                          {title}
                        </p>
                        <p className='text-xs text-teal-600/80 dark:text-teal-400/70 mt-0.5 font-medium'>
                          {t('certifications.academy')}
                        </p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className='flex items-center gap-2 text-[10px] text-muted-foreground'>
                      <Calendar size={10} />
                      <span>{dateStr}</span>
                      {cert.credentialId && (
                        <>
                          <span className='opacity-30'>·</span>
                          <span className='font-mono'>
                            #{cert.credentialId}
                          </span>
                        </>
                      )}
                    </div>

                    {/* CTA */}
                    <Button
                      size='sm'
                      variant='outline'
                      className='h-8 gap-1.5 w-full border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 hover:text-teal-500'
                      onClick={() => setSelected(cert)}>
                      <Award className='h-3.5 w-3.5' />
                      {t('certifications.viewDownload')}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── External Certifications ── */}
        {externalCerts.length > 0 && (
          <div className='space-y-2'>
            {platformCerts.length > 0 && (
              <p className='px-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50'>
                {t('certifications.externalSection')}
              </p>
            )}
            <div className='grid gap-2 sm:grid-cols-2'>
              {externalCerts.map((cert, i) => {
                const isExpired =
                  !!cert.expireDate && new Date(cert.expireDate) < now;
                const expireSoon =
                  !isExpired &&
                  !!cert.expireDate &&
                  (new Date(cert.expireDate).getTime() - now.getTime()) /
                    (1000 * 60 * 60 * 24) <
                    30;

                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/20',
                      isExpired
                        ? 'border-border/20 opacity-60'
                        : 'border-border/40',
                    )}>
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                        isExpired ? 'bg-muted' : 'bg-blue-500/10',
                      )}>
                      <Award
                        className={cn(
                          'h-5 w-5',
                          isExpired ? 'text-muted-foreground' : 'text-blue-500',
                        )}
                      />
                    </div>

                    <div className='min-w-0 flex-1 space-y-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <p className='line-clamp-1 text-sm font-semibold text-foreground'>
                          {isAr ? (cert.ar_title ?? cert.title) : cert.title}
                        </p>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='shrink-0 text-muted-foreground hover:text-primary transition-colors'>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {cert.issuer}
                      </p>
                      <div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
                        <span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                          <Calendar size={9} />
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </span>
                        {cert.expireDate ? (
                          <Badge
                            variant='outline'
                            className={cn(
                              'gap-1 text-[10px]',
                              isExpired
                                ? 'border-red-500/20    bg-red-500/5    text-red-500'
                                : expireSoon
                                  ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500'
                                  : 'border-green-500/20  bg-green-500/5  text-green-500',
                            )}>
                            {isExpired ? (
                              <>
                                <ShieldOff size={8} />{' '}
                                {t('certifications.expired')}
                              </>
                            ) : expireSoon ? (
                              <>
                                <ShieldCheck size={8} />{' '}
                                {t('certifications.expiresSoon')}
                              </>
                            ) : (
                              <>
                                <ShieldCheck size={8} />{' '}
                                {t('certifications.valid')}
                              </>
                            )}
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='gap-1 border-green-500/20 bg-green-500/5 text-[10px] text-green-500'>
                            <ShieldCheck size={8} />{' '}
                            {t('certifications.noExpiry')}
                          </Badge>
                        )}
                        {cert.credentialId && (
                          <span className='font-mono text-[10px] text-muted-foreground'>
                            #{cert.credentialId}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <CertificateModal
        cert={selected}
        userName={userName}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
