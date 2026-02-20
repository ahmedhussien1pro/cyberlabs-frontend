import { motion } from 'framer-motion';
import { FlaskConical, CheckCircle2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProfileLabs } from '../../hooks/use-profile-stats';

const DIFF_COLOR: Record<string, string> = {
  BEGINNER:
    'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20',
  INTERMEDIATE:
    'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  ADVANCED: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20',
};

export function ProfileLabsSection() {
  const { t } = useTranslation('profile');
  const { data: labs } = useProfileLabs();

  if (!labs?.length) return null;
  const recent = labs.slice(0, 6);

  return (
    <section className='space-y-3'>
      <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
        <FlaskConical className='h-4 w-4 text-primary' />
        {t('labs.title')}
        <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary'>
          {labs.length}
        </span>
      </h2>
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {recent.map((item, i) => (
          <motion.div
            key={item.labId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className='flex items-start gap-3 rounded-xl border border-border/40 bg-card p-3
                       transition-all hover:border-primary/20'>
            <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold text-foreground'>
                {item.lab.title}
              </p>
              <div className='mt-1 flex items-center gap-2'>
                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium
                  ${DIFF_COLOR[item.lab.difficulty] ?? DIFF_COLOR.BEGINNER}`}>
                  {item.lab.difficulty}
                </span>
                <span className='flex items-center gap-0.5 text-[11px] text-muted-foreground'>
                  <Clock className='h-3 w-3' />
                  {new Date(item.completedAt).toLocaleDateString()}
                </span>
                <span className='text-[11px] font-semibold text-primary'>
                  +{item.lab.xpReward} XP
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
