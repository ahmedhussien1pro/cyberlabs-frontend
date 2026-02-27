import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Clock,
  Zap,
  ArrowRight,
  CheckCircle2,
  Timer,
  TrendingUp,
  Gauge,
  Flame,
  Unlock,
  Crown,
  Gem,
  Terminal,
  Trophy,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import type { Lab } from '../types/lab.types';

const DIFF = {
  BEGINNER: {
    Icon: TrendingUp,
    label: 'Beginner',
    badge: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    ring: 'hover:ring-emerald-500/25',
    bg: 'from-emerald-950 to-emerald-900/80 border-emerald-800/50',
    text: 'text-emerald-400',
  },
  INTERMEDIATE: {
    Icon: Gauge,
    label: 'Intermediate',
    badge: 'border-yellow-500/40  text-yellow-400  bg-yellow-500/10',
    ring: 'hover:ring-yellow-500/25',
    bg: 'from-yellow-950  to-yellow-900/80  border-yellow-800/50',
    text: 'text-yellow-400',
  },
  ADVANCED: {
    Icon: Flame,
    label: 'Advanced',
    badge: 'border-red-500/40     text-red-400     bg-red-500/10',
    ring: 'hover:ring-red-500/25',
    bg: 'from-red-950     to-red-900/80     border-red-800/50',
    text: 'text-red-400',
  },
} as const;

const ACCESS_BADGE = {
  free: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  pro: 'border-blue-500/40    text-blue-400    bg-blue-500/10',
  premium: 'border-violet-500/40  text-violet-400  bg-violet-500/10',
};
const ACCESS_ICON = { free: Unlock, pro: Crown, premium: Gem };

interface LabCardProps {
  lab: Lab;
  index?: number;
}

export function LabCard({ lab, index = 0 }: LabCardProps) {
  const { i18n } = useTranslation('labs');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();

  const title = lang === 'ar' ? lab.ar_title : lab.title;
  const desc = lang === 'ar' ? lab.ar_description : lab.description;

  const diff = DIFF[lab.difficulty] ?? DIFF.BEGINNER;
  const progress = lab.usersProgress?.[0];
  const isCompleted = !!progress?.flagSubmitted;
  const isStarted = !!progress && !isCompleted;
  // labs don't have access field from backend yet — default free
  const access = 'free' as 'free' | 'pro' | 'premium';
  const AccessIcon = ACCESS_ICON[access];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.06 }}
      className={cn(
        'group relative flex flex-col rounded-2xl border bg-card overflow-hidden',
        'transition-all duration-300 ring-1 ring-transparent cursor-pointer',
        diff.ring,
        'hover:shadow-xl hover:-translate-y-0.5',
      )}
      onClick={() => navigate(ROUTES.LABS.DETAIL(lab.id))}>
      {/* ── Thumbnail ───────────────────────────────── */}
      <div className='relative aspect-video overflow-hidden bg-muted'>
        <div
          className={cn(
            'w-full h-full flex flex-col items-center justify-center gap-2',
            'bg-gradient-to-br border',
            diff.bg,
          )}>
          <Terminal className={cn('h-9 w-9', diff.text)} />
          <p
            className={cn(
              'text-[11px] font-bold uppercase tracking-widest px-4',
              diff.text,
            )}>
            {lab.category.replace(/_/g, ' ')}
          </p>
        </div>

        {/* Status pill — top start */}
        <div className='absolute top-3 start-3'>
          {isCompleted ? (
            <span
              className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm
                             px-2.5 py-1 text-[11px] font-bold text-white shadow-md'>
              <span className='h-1.5 w-1.5 rounded-full bg-white' />
              Solved
            </span>
          ) : isStarted ? (
            <span
              className='inline-flex items-center gap-1.5 rounded-full bg-yellow-500/90 backdrop-blur-sm
                             px-2.5 py-1 text-[11px] font-bold text-white shadow-md'>
              <Timer className='h-3 w-3' />
              In Progress
            </span>
          ) : (
            <span
              className='inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm
                             border border-white/10 px-2.5 py-1 text-[11px] font-bold text-white/70'>
              <span className='h-1.5 w-1.5 rounded-full bg-white/50' />
              New
            </span>
          )}
        </div>

        {/* XP pill — top end */}
        <div className='absolute top-3 end-3'>
          <span
            className='inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm
                           border border-yellow-500/30 px-2.5 py-1 text-[11px] font-bold text-yellow-400'>
            <Zap className='h-3 w-3' />
            {lab.xpReward} XP
          </span>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────── */}
      <div className='flex flex-col flex-1 p-4 gap-3'>
        {/* Title */}
        <h3 className='text-sm font-bold text-foreground leading-snug line-clamp-2'>
          {title}
        </h3>

        {/* Description */}
        <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
          {desc}
        </p>

        {/* Skill tags */}
        {lab.skills?.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {lab.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className='text-[10px] px-2 py-0.5 rounded-full bg-muted/60
                           border border-border/40 text-muted-foreground'>
                {s}
              </span>
            ))}
            {lab.skills.length > 3 && (
              <span
                className='text-[10px] px-2 py-0.5 rounded-full bg-muted/60
                               border border-border/40 text-muted-foreground'>
                +{lab.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Badges row */}
        <div className='flex flex-wrap items-center gap-1.5'>
          {/* Difficulty */}
          <Badge
            variant='outline'
            className={cn('gap-1 text-[10px] font-semibold', diff.badge)}>
            <diff.Icon className='h-3 w-3' />
            {diff.label}
          </Badge>

          {/* Access */}
          <Badge
            variant='outline'
            className={cn('gap-1 text-[10px] font-bold', ACCESS_BADGE[access])}>
            <AccessIcon className='h-3 w-3' />
            {access.toUpperCase()}
          </Badge>

          {/* Duration */}
          <Badge
            variant='outline'
            className='gap-1 text-[10px] font-semibold text-primary border-primary/30 bg-primary/5'>
            <Clock className='h-3 w-3' />
            {lab.duration}m
          </Badge>

          {/* Points */}
          <Badge
            variant='outline'
            className='gap-1 text-[10px] text-muted-foreground border-border/40'>
            <Trophy className='h-3 w-3' />
            {lab.pointsReward} pts
          </Badge>
        </div>

        {/* Hints count */}
        {lab.hints?.length > 0 && (
          <p className='text-[11px] text-muted-foreground/60'>
            {lab.hints.length} hint{lab.hints.length > 1 ? 's' : ''} available
          </p>
        )}

        {/* Progress bar — if started */}
        {isStarted && progress && (
          <div className='space-y-1'>
            <div className='flex justify-between text-[10px] text-muted-foreground'>
              <span>
                {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
              </span>
              <span className='text-yellow-400'>In progress</span>
            </div>
            <div className='h-1 w-full rounded-full bg-muted overflow-hidden'>
              <div className='h-full w-1/2 rounded-full bg-yellow-500/70' />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className='mt-auto pt-1'>
          <Button
            size='sm'
            className='w-full h-9 text-xs'
            variant={isCompleted ? 'outline' : 'default'}
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.LABS.DETAIL(lab.id));
            }}>
            {isCompleted ? (
              <>
                <CheckCircle2 className='h-3.5 w-3.5 me-1.5' />
                Try Again
              </>
            ) : isStarted ? (
              <>
                <Zap className='h-3.5 w-3.5 me-1.5' />
                Resume Lab
              </>
            ) : (
              <>
                Start Lab
                <ArrowRight className='h-3.5 w-3.5 ms-1.5' />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
