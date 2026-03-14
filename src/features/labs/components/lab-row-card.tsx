// src/features/labs/components/lab-row-card.tsx
// Horizontal row-style card used ONLY in the public /labs list page.
// LabCard (grid card) is untouched.
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FlaskConical, Clock, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { DIFF_STYLES } from '../constants/diff-styles';
import type { Lab } from '../types/lab.types';

interface LabRowCardProps {
  lab: Lab;
  index?: number;
}

export function LabRowCard({ lab, index = 0 }: LabRowCardProps) {
  const { i18n } = useTranslation('labs');
  const lang  = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();

  const title      = lang === 'ar' ? lab.ar_title : lab.title;
  const diff       = DIFF_STYLES[lab.difficulty] ?? DIFF_STYLES.BEGINNER;
  const isCompleted = !!lab.usersProgress?.[0]?.flagSubmitted;
  const isStarted   = !!lab.usersProgress?.[0] && !isCompleted;
  const detailRoute = ROUTES.LABS.DETAIL(lab.slug ?? lab.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.03 }}
      onClick={() => navigate(detailRoute)}
      className={cn(
        'group flex items-center gap-3 px-4 py-3.5 rounded-xl',
        'border border-border/50 bg-card cursor-pointer',
        'hover:bg-card/80 hover:border-border transition-all duration-200',
        isCompleted && 'border-emerald-500/20 bg-emerald-500/5',
      )}>

      {/* Icon bubble */}
      <div className={cn(
        'h-9 w-9 shrink-0 rounded-lg flex items-center justify-center border',
        isCompleted
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-muted/60 border-border/40',
      )}>
        {isCompleted
          ? <CheckCircle2 className='h-4.5 w-4.5 text-emerald-400' />
          : <FlaskConical className={cn('h-4 w-4', diff.textCls)} />
        }
      </div>

      {/* Title + badges */}
      <div className='flex-1 min-w-0 space-y-1'>
        <p className={cn(
          'text-sm font-semibold leading-snug truncate',
          isCompleted ? 'text-emerald-400/80' : 'text-foreground',
        )}>
          {title}
        </p>
        <div className='flex items-center gap-2 flex-wrap'>
          {/* Difficulty badge */}
          <span className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            diff.badgeCls,
          )}>
            <diff.Icon className='h-2.5 w-2.5' />
            {diff.label}
          </span>

          {/* Duration */}
          {lab.duration && (
            <span className='inline-flex items-center gap-1 text-[11px] text-muted-foreground'>
              <Clock className='h-3 w-3' />
              {lab.duration}m
            </span>
          )}

          {/* XP */}
          {lab.xpReward > 0 && (
            <span className='inline-flex items-center gap-1 text-[11px] text-yellow-400/80'>
              <Zap className='h-3 w-3' />
              {lab.xpReward} XP
            </span>
          )}

          {/* In progress */}
          {isStarted && (
            <span className='inline-flex items-center gap-1 text-[10px] text-yellow-400 font-semibold'>
              In Progress
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className='h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 rtl:rotate-180' />
    </motion.div>
  );
}
