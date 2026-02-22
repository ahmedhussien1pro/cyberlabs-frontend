import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/features/auth/store/auth.store';
import { useUserPoints } from '@/shared/hooks/use-user-data';
import { ROUTES } from '@/shared/constants';

export function WelcomeBanner() {
  const { t } = useTranslation('dashboard');
  const { user } = useAuthStore();
  const { data: points } = useUserPoints();

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('greeting.morning')
      : hour < 18
        ? t('greeting.afternoon')
        : t('greeting.evening');

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='relative overflow-hidden rounded-2xl border border-border/40
                 bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 p-6'>
      {/* Glow */}
      <div
        className='pointer-events-none absolute -right-10 -top-10 h-40 w-40
                      rounded-full bg-primary/10 blur-3xl'
      />

      <div className='relative flex items-start justify-between gap-4'>
        <div className='space-y-1'>
          <p className='text-sm text-muted-foreground'>{greeting}</p>
          <h1 className='text-2xl font-black tracking-tight text-foreground'>
            {user?.name} 👋
          </h1>
          {points && (
            <Badge
              variant='outline'
              className='mt-1 gap-1 border-primary/30 bg-primary/5 text-primary'>
              <Zap size={11} />
              {t('level')} {points.level} · {points.totalXP.toLocaleString()} XP
            </Badge>
          )}
        </div>

        <Button asChild size='sm' className='shrink-0 gap-2'>
          <Link to={ROUTES.LABS.LIST}>
            <Zap size={14} />
            {t('overview.startLab')}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
