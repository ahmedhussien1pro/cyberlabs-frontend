// src/features/labs/components/lab-card.tsx
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStartLabMutation } from '../api/labQueries';
import { useLabStore } from '../store/useLabStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { DIFF_STYLES } from '../constants/diff-styles';
import { LabThumbnail } from './lab-thumbnail';
import { LabMetaBadges } from './lab-meta-badges';
import { LabSkillTags } from './lab-skill-tags';
import { LabLaunchButton } from './lab-launch-button';
import type { Lab } from '../types/lab.types';

interface LabCardProps {
  lab: Lab;
  index?: number;
}

export function LabCard({ lab, index = 0 }: LabCardProps) {
  const { i18n } = useTranslation('labs');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();

  const title    = lang === 'ar' ? lab.ar_title    : lab.title;
  const desc     = lang === 'ar' ? lab.ar_description : lab.description;
  const diff     = DIFF_STYLES[lab.difficulty] ?? DIFF_STYLES.BEGINNER;
  const progress = lab.usersProgress?.[0];
  const isCompleted = !!progress?.flagSubmitted;
  const isStarted   = !!progress && !isCompleted;

  const { mutate: launchLab }      = useStartLabMutation();
  const isLaunching                = useLabStore((s) => s.isLaunching);
  const activeLab                  = useLabStore((s) => s.labId);
  const isThisLabLaunching         = isLaunching && activeLab === lab.id;

  const detailRoute = ROUTES.LABS.DETAIL(lab.slug ?? lab.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.06 }}
      className={cn(
        'group relative flex flex-col rounded-2xl border bg-card overflow-hidden',
        'transition-all duration-300 ring-1 ring-transparent cursor-pointer',
        diff.ringCls,
        'hover:shadow-xl hover:-translate-y-0.5',
      )}
      onClick={() => navigate(detailRoute)}>

      {/* ── Thumbnail + status/XP overlays ── */}
      <LabThumbnail
        difficulty={lab.difficulty}
        category={lab.category}
        xpReward={lab.xpReward}
        isCompleted={isCompleted}
        isStarted={isStarted}
      />

      {/* ── Body ── */}
      <div className='flex flex-col flex-1 p-4 gap-3'>
        <h3 className='text-sm font-bold text-foreground leading-snug line-clamp-2'>{title}</h3>
        <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>{desc}</p>

        <LabSkillTags skills={lab.skills} />

        <LabMetaBadges
          difficulty={lab.difficulty}
          duration={lab.duration}
          pointsReward={lab.pointsReward}
        />

        {/* Hints count */}
        {lab.hints?.length > 0 && (
          <p className='text-[11px] text-muted-foreground/60'>
            {lab.hints.length} hint{lab.hints.length > 1 ? 's' : ''} available
          </p>
        )}

        {/* Progress bar — only when in progress */}
        {isStarted && progress && (
          <div className='space-y-1'>
            <div className='flex justify-between text-[10px] text-muted-foreground'>
              <span>{progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}</span>
              <span className='text-yellow-400'>In progress</span>
            </div>
            <div className='h-1 w-full rounded-full bg-muted overflow-hidden'>
              <div className='h-full w-1/2 rounded-full bg-yellow-500/70' />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className='mt-auto pt-1'>
          <LabLaunchButton
            isCompleted={isCompleted}
            isStarted={isStarted}
            isLaunching={isThisLabLaunching}
            onLaunch={() => launchLab(lab.id)}
            onViewDetail={() => navigate(detailRoute)}
          />
        </div>
      </div>
    </motion.div>
  );
}
