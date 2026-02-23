// src/features/paths/components/path-roadmap.tsx
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  FlaskConical,
  HelpCircle,
  FolderKanban,
  Lock,
  CheckCircle2,
  Clock3,
} from 'lucide-react';
import type { PathModule, ModuleType } from '../types/path.types';

// ── Module type config ────────────────────────────────────────────────
const MODULE_TYPE_CONFIG: Record<
  ModuleType,
  { icon: React.ReactNode; labelKey: string; color: string }
> = {
  course: {
    icon: <BookOpen className='h-3.5 w-3.5' />,
    labelKey: 'detail.course',
    color: 'text-blue-500 bg-blue-500/10   border-blue-500/20',
  },
  lab: {
    icon: <FlaskConical className='h-3.5 w-3.5' />,
    labelKey: 'detail.lab',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  quiz: {
    icon: <HelpCircle className='h-3.5 w-3.5' />,
    labelKey: 'detail.quiz',
    color: 'text-amber-500 bg-amber-500/10   border-amber-500/20',
  },
  project: {
    icon: <FolderKanban className='h-3.5 w-3.5' />,
    labelKey: 'detail.project',
    color: 'text-violet-500 bg-violet-500/10  border-violet-500/20',
  },
};

interface PathRoadmapProps {
  modules: PathModule[];
}

export function PathRoadmap({ modules }: PathRoadmapProps) {
  const { t, i18n } = useTranslation('paths');
  const isAr = i18n.language === 'ar';

  return (
    <section className='container mx-auto px-4 py-10'>
      {/* Section header */}
      <div className='mb-6'>
        <h2 className='text-xl font-bold'>{t('detail.pathRoadmap')}</h2>
        <p className='mt-1 text-xs text-muted-foreground'>
          {modules.length} {t('detail.followOrderSuffix')}
        </p>
      </div>

      {/* Roadmap list */}
      <div className='relative'>
        {/* Vertical connector line */}
        <div
          className='absolute start-[22px] top-4 bottom-4 w-px bg-border/50'
          aria-hidden='true'
        />

        <ol className='space-y-3'>
          {modules.map((mod, idx) => {
            const cfg = MODULE_TYPE_CONFIG[mod.type];
            const isComingSoon = mod.status === 'coming_soon';
            const isDone = false; // Replace with actual user progress check when backend ready

            return (
              <li
                key={mod.id}
                className={cn(
                  'relative flex items-start gap-4 rounded-xl border bg-card p-4 transition-all',
                  mod.isLocked
                    ? 'border-border/30 opacity-70'
                    : 'border-border/50 hover:border-border hover:shadow-sm',
                )}>
                {/* Step circle */}
                <div
                  className={cn(
                    'relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold',
                    isDone
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                      : mod.isLocked
                        ? 'border-border bg-muted text-muted-foreground'
                        : 'border-primary bg-primary/10 text-primary',
                  )}>
                  {isDone ? <CheckCircle2 className='h-5 w-5' /> : idx + 1}
                </div>

                {/* Module info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    {/* Type badge */}
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                        cfg.color,
                      )}>
                      {cfg.icon}
                      {t(cfg.labelKey)}
                    </span>

                    {/* Coming soon badge */}
                    {isComingSoon && (
                      <span className='inline-flex items-center gap-1 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-500'>
                        <Clock3 className='h-2.5 w-2.5' />
                        {t('detail.soon')}
                      </span>
                    )}
                  </div>

                  <h3 className='mt-1.5 text-sm font-semibold text-foreground'>
                    {isAr ? mod.ar_title : mod.title}
                  </h3>
                  <p className='mt-0.5 line-clamp-1 text-xs text-muted-foreground'>
                    {isAr ? mod.ar_description : mod.description}
                  </p>

                  {/* Hours */}
                  <span className='mt-1.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground'>
                    <BookOpen className='h-2.5 w-2.5' />
                    {mod.estimatedHours}h
                  </span>
                </div>

                {/* Lock icon */}
                {mod.isLocked && (
                  <Lock className='h-4 w-4 shrink-0 self-center text-muted-foreground/50' />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
