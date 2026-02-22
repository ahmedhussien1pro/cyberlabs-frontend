import { CheckCircle2, Flame, FlaskConical, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import type { UserLab } from '../../types/dashboard.types';

const DIFF: Record<string, string> = {
  EASY: 'border-green-500/20  bg-green-500/10  text-green-500',
  MEDIUM: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500',
  HARD: 'border-red-500/20    bg-red-500/10    text-red-500',
};

const STATUS_DOT: Record<string, string> = {
  not_started: 'bg-muted-foreground/30',
  active: 'bg-yellow-400 animate-pulse',
  completed: 'bg-green-500',
};

interface Props {
  lab: UserLab;
  index: number;
}

export function LabCard({ lab, index }: Props) {
  const { t, i18n } = useTranslation('dashboard');
  const isAr = i18n.language === 'ar';
  const title = isAr ? (lab.ar_title ?? lab.title) : lab.title;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className='group flex flex-col overflow-hidden rounded-xl border border-border/40
                 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'>
      {/* Thumbnail */}
      <div
        className='relative flex h-28 items-center justify-center
                      overflow-hidden bg-gradient-to-br from-primary/10 to-cyan-500/10'>
        {lab.thumbnail ? (
          <img
            src={lab.thumbnail}
            alt=''
            className='h-full w-full object-cover'
          />
        ) : (
          <FlaskConical size={36} className='text-primary/30' />
        )}
        {/* Status indicator */}
        <span
          className={cn(
            'absolute right-2.5 top-2.5 h-2 w-2 rounded-full',
            STATUS_DOT[lab.status],
          )}
          title={t(`labs.status.${lab.status}`)}
        />
        {/* Progress bar for active */}
        {lab.status === 'active' && lab.progress !== undefined && (
          <div className='absolute inset-x-0 bottom-0 h-1 bg-black/20'>
            <div
              className='h-full bg-gradient-to-r from-primary to-cyan-400'
              style={{ width: `${lab.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className='flex flex-1 flex-col gap-2 p-3'>
        <p className='line-clamp-2 text-sm font-semibold leading-snug'>
          {title}
        </p>
        <div className='flex flex-wrap gap-1.5'>
          <Badge
            className={cn('border text-[10px]', DIFF[lab.difficulty] ?? '')}>
            {lab.difficulty}
          </Badge>
          <Badge variant='secondary' className='text-[10px]'>
            {lab.category}
          </Badge>
        </div>
      </div>

      {/* Footer */}
      <div
        className='flex items-center justify-between
                      border-t border-border/30 px-3 py-2.5'>
        <span className='flex items-center gap-1 font-mono text-xs text-muted-foreground'>
          <Flame size={12} className='text-orange-400' />+{lab.xpReward} XP
        </span>

        {lab.status === 'completed' ? (
          <span className='flex items-center gap-1 text-xs text-green-500'>
            <CheckCircle2 size={13} />
            {t('labs.status.completed')}
          </span>
        ) : (
          <Button asChild size='sm' className='h-6 gap-1 px-2.5 text-xs'>
            <Link to={ROUTES.LABS.DETAIL(lab.id)}>
              <Play size={9} />
              {lab.status === 'active' ? t('labs.continue') : t('labs.start')}
            </Link>
          </Button>
        )}
      </div>
    </motion.article>
  );
}
