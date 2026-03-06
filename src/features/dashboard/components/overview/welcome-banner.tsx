// src/features/dashboard/components/overview/welcome-banner.tsx
import { motion } from 'framer-motion';
import { Zap, Flame, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/features/auth/store/auth.store';
import { useUserPoints, useUserStats } from '@/shared/hooks/use-user-data';
import { ROUTES } from '@/shared/constants';

export function WelcomeBanner() {
  const { t } = useTranslation('dashboard');
  const { user } = useAuthStore();
  const { data: points } = useUserPoints();
  const { data: stats } = useUserStats();

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('greeting.morning')
      : hour < 18
        ? t('greeting.afternoon')
        : t('greeting.evening');

  // ✅ Fix: fallback to translated 'there' when name is missing
  const rawName = user?.name?.trim();
  const firstName = rawName
    ? rawName.split(' ')[0]
    : t('greeting.user', 'there');

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='relative overflow-hidden rounded-2xl border border-border/40
                 bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 p-6'>
      {/* Ambient glow */}
      <div className='pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/8 blur-3xl' />
      <div className='pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl' />

      <div className='relative flex items-start justify-between gap-4'>
        <div className='space-y-2'>
          <p className='text-sm text-muted-foreground'>{greeting}</p>
          <h1 className='text-2xl font-black tracking-tight text-foreground'>
            {firstName} 👋
          </h1>

          {/* XP + Streak badges inline */}
          <div className='flex flex-wrap items-center gap-2 pt-1'>
            {points && (
              <Badge
                variant='outline'
                className='gap-1.5 border-primary/30 bg-primary/5 text-primary'>
                <Zap size={11} />
                {t('level')} {points.level} · {points.totalXP.toLocaleString()}{' '}
                XP
              </Badge>
            )}
            {stats && stats.currentStreak > 0 && (
              <Badge
                variant='outline'
                className='gap-1.5 border-orange-500/30 bg-orange-500/5 text-orange-500'>
                <Flame size={11} />
                {stats.currentStreak} {t('stats.streakDays', 'day streak')} 🔥
              </Badge>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className='flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center'>
          <Button asChild size='sm' className='gap-2'>
            <Link to={ROUTES.LABS.LIST}>
              <Zap size={14} />
              {t('overview.startLab')}
            </Link>
          </Button>
          <Button
            asChild
            variant='ghost'
            size='sm'
            className='gap-1 text-muted-foreground'>
            <Link to={ROUTES.COURSES.LIST}>
              {t('overview.exploreCourses', 'Explore')}
              <ChevronRight size={13} />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
