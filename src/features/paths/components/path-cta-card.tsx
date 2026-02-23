import { useTranslation } from 'react-i18next';
import { CheckCircle2, Lock, ChevronRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LearningPath } from '../types/path.types';

interface PathCtaCardProps {
  path: LearningPath;
}

export function PathCtaCard({ path }: PathCtaCardProps) {
  const { t, i18n } = useTranslation('paths');
  const isAr = i18n.language === 'ar';
  const skills = isAr ? path.ar_skills : path.skills;
  const prereqs = isAr ? path.ar_prerequisites : path.prerequisites;
  const freeCount = path.modules.filter((m) => !m.isLocked).length;
  const lockedCount = path.modules.filter((m) => m.isLocked).length;

  return (
    <div className='w-full shrink-0 rounded-2xl border border-border/40 bg-card p-6 shadow-sm lg:w-72'>
      {/* What you'll learn */}
      <p className='text-sm font-semibold text-foreground'>
        {t('detail.whatYouLearn')}
      </p>
      <ul className='mt-3 space-y-2'>
        {skills.map((skill) => (
          <li
            key={skill}
            className='flex items-center gap-2 text-xs text-muted-foreground'>
            <CheckCircle2 className='h-3.5 w-3.5 shrink-0 text-primary' />
            {skill}
          </li>
        ))}
      </ul>

      {/* Prerequisites */}
      {prereqs.length > 0 && (
        <div className='mt-4 border-t border-border/40 pt-4'>
          <p className='text-xs font-semibold text-muted-foreground'>
            {t('detail.prerequisites')}
          </p>
          <ul className='mt-2 space-y-1'>
            {prereqs.map((p) => (
              <li
                key={p}
                className='flex items-start gap-2 text-xs text-muted-foreground'>
                <span className='mt-0.5 shrink-0'>•</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Free vs Pro breakdown */}
      <div className='mt-4 rounded-lg border border-border/40 bg-muted/50 p-3'>
        <div className='flex justify-between text-[11px]'>
          <span className='text-muted-foreground'>
            {t('detail.freeContent')}
          </span>
          <span className='font-semibold text-foreground'>
            {freeCount} {t('detail.modules')}
          </span>
        </div>
        {lockedCount > 0 && (
          <div className='mt-1 flex justify-between text-[11px]'>
            <span className='flex items-center gap-1 text-muted-foreground'>
              <Lock className='h-2.5 w-2.5' />
              {t('detail.requiresPro')}
            </span>
            <span className='font-semibold text-foreground'>
              {lockedCount} {t('detail.modules')}
            </span>
          </div>
        )}
      </div>

      {/* CTA button */}
      <Button className='mt-5 w-full gap-2' size='lg'>
        {path.enrolled
          ? t('detail.continueLearning')
          : t('detail.startThisPath')}
        <ChevronRight className='h-4 w-4' />
      </Button>

      {/* Completed badge */}
      {path.completedAt && (
        <div className='mt-3 flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400'>
          <Trophy className='h-3 w-3' />
          {t('detail.completedPath')}
        </div>
      )}
    </div>
  );
}
