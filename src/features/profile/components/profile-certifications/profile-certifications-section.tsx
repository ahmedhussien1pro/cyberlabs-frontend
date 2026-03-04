// src/features/profile/components/profile-certifications/profile-certifications-section.tsx
import { motion } from 'framer-motion';
import {
  Award,
  ExternalLink,
  Calendar,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { UserCertification } from '../../types/profile.types';

interface Props {
  certifications: UserCertification[];
}

export function ProfileCertificationsSection({ certifications }: Props) {
  const { t } = useTranslation('profile');

  if (!certifications.length) return null;

  const now = new Date();

  // مرتبة: valid أولاً، expired آخراً
  const sorted = [...certifications].sort((a, b) => {
    const aExp = a.expireDate ? new Date(a.expireDate) : null;
    const bExp = b.expireDate ? new Date(b.expireDate) : null;
    const aValid = !aExp || aExp > now;
    const bValid = !bExp || bExp > now;
    if (aValid && !bValid) return -1;
    if (!aValid && bValid) return 1;
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });

  return (
    <section className='space-y-3'>
      <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
        <Award className='h-4 w-4 text-blue-500' />
        {t('certifications.title', 'Certifications')}
        <span className='rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-500'>
          {certifications.length}
        </span>
      </h2>

      <div className='grid gap-2 sm:grid-cols-2'>
        {sorted.map((cert, i) => {
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
                isExpired ? 'border-border/20 opacity-60' : 'border-border/40',
              )}>
              {/* Icon */}
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

              {/* Content */}
              <div className='min-w-0 flex-1 space-y-1'>
                <div className='flex items-start justify-between gap-2'>
                  <p className='line-clamp-1 text-sm font-semibold text-foreground'>
                    {cert.title}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      title={t('certifications.verify', 'Verify credential')}
                      className='shrink-0 text-muted-foreground transition-colors hover:text-primary'>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <p className='text-xs text-muted-foreground'>{cert.issuer}</p>

                <div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
                  {/* Issue date */}
                  <span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                    <Calendar size={9} />
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </span>

                  {/* Validity badge */}
                  {cert.expireDate ? (
                    <Badge
                      variant='outline'
                      className={cn(
                        'gap-1 text-[10px]',
                        isExpired
                          ? 'border-red-500/20 bg-red-500/5   text-red-500'
                          : expireSoon
                            ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500'
                            : 'border-green-500/20 bg-green-500/5  text-green-500',
                      )}>
                      {isExpired ? (
                        <>
                          <ShieldOff size={8} />{' '}
                          {t('certifications.expired', 'Expired')}
                        </>
                      ) : expireSoon ? (
                        <>
                          <ShieldCheck size={8} />{' '}
                          {t('certifications.expiresSoon', 'Expires soon')}
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={8} />{' '}
                          {t('certifications.valid', 'Valid')}
                        </>
                      )}
                    </Badge>
                  ) : (
                    <Badge
                      variant='outline'
                      className='gap-1 border-green-500/20 bg-green-500/5 text-[10px] text-green-500'>
                      <ShieldCheck size={8} />
                      {t('certifications.noExpiry', 'No expiry')}
                    </Badge>
                  )}

                  {/* Credential ID */}
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
    </section>
  );
}
