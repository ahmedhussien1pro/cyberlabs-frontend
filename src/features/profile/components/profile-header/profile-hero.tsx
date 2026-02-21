import { motion } from 'framer-motion';
import { MapPin, Calendar, Shield, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserProfile, UserPoints } from '../../types/profile.types';
import { ProfileAvatar } from './profile-avatar';
import { ProfileSocialLinks } from './profile-social-links';

const ROLE_STYLE: Record<string, string> = {
  ADMIN: 'bg-red-500/10 text-red-500 border-red-500/20',
  INSTRUCTOR: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  CONTENT_CREATOR: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  STUDENT: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  USER: 'bg-primary/10 text-primary border-primary/20',
};

const INTERNAL_ICON: Record<string, string> = {
  RED_TEAM: '🔴',
  BLUE_TEAM: '🔵',
  PENTEST: '🛡️',
  SOC: '🖥️',
  GRC: '📋',
  SECURITY_ANALYST: '🔍',
  STUDENT: '🎓',
};

interface Props {
  profile: UserProfile;
  points?: UserPoints;
  isOwner?: boolean;
  onEdit?: () => void;
}

export function ProfileHero({ profile, points, isOwner, onEdit }: Props) {
  const { t } = useTranslation('profile');

  const level = points?.level ?? 1;
  const xpInLevel = level * 1000;
  const xpProgress = points
    ? ((points.totalXP % xpInLevel) / xpInLevel) * 100
    : 0;

  return (
    <div className='relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm'>
      {/* Cover */}
      <div className='relative h-28 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background md:h-44'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.2),transparent_70%)]' />
        {/* Scanning line */}
        <motion.div
          className='absolute inset-x-0 h-px bg-primary/30'
          animate={{ top: ['0%', '100%'] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        />
        {/* Grid pattern */}
        <div
          className='absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Body */}
      <div className='px-4 pb-5 md:px-8'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          {/* Avatar + Name */}
          <div className='-mt-10 flex items-end gap-3 md:-mt-14'>
            <ProfileAvatar
              name={profile.name}
              avatarUrl={profile.avatarUrl}
              level={level}
              editable={isOwner}
              size='md'
            />
            <div className='mb-1'>
              <h1 className='text-lg font-bold text-foreground md:text-2xl'>
                {profile.name}
              </h1>
              <div className='mt-1 flex flex-wrap items-center gap-1.5'>
                {profile.role && (
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                      ROLE_STYLE[profile.role] ?? ROLE_STYLE.USER,
                    )}>
                    {profile.role}
                  </span>
                )}
                {profile.internalRole && (
                  <span className='rounded-full border border-border/40 bg-muted px-2.5 py-0.5 text-xs text-muted-foreground'>
                    {INTERNAL_ICON[profile.internalRole]}{' '}
                    {profile.internalRole.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2 pb-1'>
            {points && (
              <div className='flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/60 px-3 py-1.5 text-xs font-bold text-foreground'>
                <Trophy className='h-3.5 w-3.5 text-yellow-500' />
                {points.totalXP.toLocaleString()} XP
              </div>
            )}
            {isOwner && (
              <Button
                size='sm'
                onClick={onEdit}
                className='gap-1.5 rounded-full text-xs shadow-sm shadow-primary/20 hover:scale-[1.02] transition-transform'>
                {t('editProfile')}
              </Button>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className='mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground'>
            {profile.bio}
          </p>
        )}

        {/* Meta */}
        <div className='mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground'>
          {profile.address && (
            <span className='flex items-center gap-1'>
              <MapPin className='h-3.5 w-3.5 text-primary/60' />{' '}
              {profile.address}
            </span>
          )}
          {profile.createdAt && (
            <span className='flex items-center gap-1'>
              <Calendar className='h-3.5 w-3.5 text-primary/60' />
              {t('joinedAt')} {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          )}
          {points && (
            <span className='flex items-center gap-1 font-semibold text-primary'>
              <Shield className='h-3.5 w-3.5' />
              {t('level')} {points.level}
            </span>
          )}
        </div>

        {/* XP Level Bar */}
        {points && (
          <div className='mt-4 space-y-1'>
            <div className='flex justify-between text-[11px] text-muted-foreground'>
              <span className='font-mono'>
                {t('level')} {level} → {level + 1}
              </span>
              <span className='font-mono'>
                {(points.totalXP % xpInLevel).toLocaleString()} /{' '}
                {xpInLevel.toLocaleString()} XP
              </span>
            </div>
            <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
              <motion.div
                className='h-full rounded-full bg-gradient-to-r from-primary to-cyan-400'
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>
        )}

        {/* Social Links */}
        <ProfileSocialLinks links={profile.socialLinks ?? []} />
      </div>
    </div>
  );
}
