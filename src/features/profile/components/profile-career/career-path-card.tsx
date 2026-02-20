import { motion } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';
import type { UserCareerPath } from '../../types/profile.types';

export function CareerPathCard({
  path,
  delay = 0,
}: {
  path: UserCareerPath;
  delay?: number;
}) {
  const isComplete = !!path.completedAt;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className='space-y-2.5 rounded-xl border border-border/40 bg-card p-4 transition-all
                 hover:border-primary/20 hover:shadow-sm'>
      <div className='flex items-center gap-3'>
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border
          ${
            isComplete
              ? 'border-green-500/20 bg-green-500/10 text-green-500'
              : 'border-primary/20 bg-primary/10 text-primary'
          }`}>
          {path.careerPath.iconUrl ? (
            <img src={path.careerPath.iconUrl} alt='' className='h-5 w-5' />
          ) : isComplete ? (
            <CheckCircle2 className='h-4 w-4' />
          ) : (
            <Target className='h-4 w-4' />
          )}
        </div>
        <div className='flex-1'>
          <p className='text-sm font-bold text-foreground'>
            {path.careerPath.name}
          </p>
          {path.careerPath.description && (
            <p className='text-xs text-muted-foreground line-clamp-1'>
              {path.careerPath.description}
            </p>
          )}
        </div>
        <span
          className={`text-xs font-black ${isComplete ? 'text-green-500' : 'text-primary'}`}>
          {path.progress}%
        </span>
      </div>
      <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
        <motion.div
          className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-primary to-cyan-400'}`}
          initial={{ width: 0 }}
          animate={{ width: `${path.progress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.3 }}
        />
      </div>
    </motion.div>
  );
}
