import { motion } from 'framer-motion';
import type { UserSkill } from '../../types/profile.types';

const LEVEL_GRADIENT: Record<string, string> = {
  BEGINNER: 'from-green-500/60 to-green-400',
  INTERMEDIATE: 'from-blue-500/60 to-blue-400',
  ADVANCED: 'from-purple-500/60 to-purple-400',
  EXPERT: 'from-primary/80 to-cyan-400',
};

const LEVEL_DOT: Record<string, string> = {
  BEGINNER: 'bg-green-400',
  INTERMEDIATE: 'bg-blue-400',
  ADVANCED: 'bg-purple-400',
  EXPERT: 'bg-primary',
};

export function SkillBar({
  skill,
  delay = 0,
}: {
  skill: UserSkill;
  delay?: number;
}) {
  const gradient = LEVEL_GRADIENT[skill.level] ?? LEVEL_GRADIENT.BEGINNER;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className='space-y-1.5 rounded-xl border border-border/40 bg-card p-3 transition-all
                 hover:border-primary/20'>
      <div className='flex items-center justify-between text-xs'>
        <span className='font-semibold text-foreground'>
          {skill.skill.name}
        </span>
        <span className='flex items-center gap-1 text-muted-foreground'>
          <span
            className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[skill.level]}`}
          />
          {skill.level}
        </span>
      </div>
      <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${skill.progress}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  );
}
