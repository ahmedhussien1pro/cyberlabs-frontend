import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import type { UserBadge } from '../../types/profile.types';

const TYPE_COLOR: Record<string, string> = {
  COURSE_COMPLETION: 'text-blue-500  bg-blue-500/10  border-blue-500/20',
  LAB_SOLVED: 'text-primary   bg-primary/10   border-primary/20',
  STREAK: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  COMMUNITY: 'text-green-500 bg-green-500/10 border-green-500/20',
  CONTRIBUTION: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  CUSTOM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
};

export function BadgeCard({
  badge,
  delay = 0,
}: {
  badge: UserBadge;
  delay?: number;
}) {
  const colors = TYPE_COLOR[badge.badge.type] ?? TYPE_COLOR.CUSTOM;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      title={badge.badge.description}
      className='group flex flex-col items-center gap-2 rounded-xl border border-border/40
                 bg-card p-3 text-center transition-all duration-200
                 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5'>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border ${colors}`}>
        {badge.badge.iconUrl ? (
          <img
            src={badge.badge.iconUrl}
            alt={badge.badge.title}
            className='h-6 w-6 object-contain'
          />
        ) : (
          <Award className='h-5 w-5' />
        )}
      </div>
      <p className='text-[11px] font-semibold leading-tight text-foreground'>
        {badge.badge.title}
      </p>
      <p className='text-[10px] text-muted-foreground'>
        +{badge.badge.xpReward} XP
      </p>
    </motion.div>
  );
}
