// src/features/paths/components/path-roadmap.tsx
// Design reference: TryHackMe path roadmap + Coursera module list
// Features:
//   - Timeline connector مع ألوان حسب state
//   - Expand/collapse لكل module (accordion)
//   - State: done / active / locked / coming-soon
//   - Type icon + color per module type
//   - Progress summary header
//   - RTL support
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  FlaskConical,
  HelpCircle,
  FolderKanban,
  Lock,
  CheckCircle2,
  Clock3,
  ChevronDown,
  Play,
  Clock,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { PathModule, ModuleType } from '../types/path.types';

// ── Module type config ────────────────────────────────────────────────
const MODULE_CFG: Record<
  ModuleType,
  {
    icon: React.ReactNode;
    labelKey: string;
    dot: string; // timeline dot color
    badge: string; // type badge classes
    bg: string; // card bg accent
  }
> = {
  course: {
    icon: <BookOpen className='h-4 w-4' />,
    labelKey: 'detail.course',
    dot: 'bg-blue-500',
    badge: 'border-blue-500/25 bg-blue-500/10 text-blue-500',
    bg: 'hover:border-blue-500/30',
  },
  lab: {
    icon: <FlaskConical className='h-4 w-4' />,
    labelKey: 'detail.lab',
    dot: 'bg-emerald-500',
    badge: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-500',
    bg: 'hover:border-emerald-500/30',
  },
  quiz: {
    icon: <HelpCircle className='h-4 w-4' />,
    labelKey: 'detail.quiz',
    dot: 'bg-amber-500',
    badge: 'border-amber-500/25 bg-amber-500/10 text-amber-500',
    bg: 'hover:border-amber-500/30',
  },
  project: {
    icon: <FolderKanban className='h-4 w-4' />,
    labelKey: 'detail.project',
    dot: 'bg-violet-500',
    badge: 'border-violet-500/25 bg-violet-500/10 text-violet-500',
    bg: 'hover:border-violet-500/30',
  },
};

// ── Module state ──────────────────────────────────────────────────────
type ModuleState = 'done' | 'active' | 'locked' | 'soon';

function getModuleState(mod: PathModule, idx: number): ModuleState {
  if (mod.status === 'coming_soon') return 'soon';
  if (mod.isLocked) return 'locked';
  // TODO: replace with real user progress from backend
  // For now: first unlocked module = active, rest unlocked = done (mock)
  if (idx === 0 && !mod.isLocked) return 'active';
  return 'done';
}

// ── Props ─────────────────────────────────────────────────────────────
interface PathRoadmapProps {
  modules: PathModule[];
  /** Pass enrolled user's completed module IDs when backend is ready */
  completedIds?: string[];
}

export function PathRoadmap({ modules, completedIds = [] }: PathRoadmapProps) {
  const { t, i18n } = useTranslation('paths');
  const isAr = i18n.language === 'ar';
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  // Summary counts
  const doneCount = completedIds.length;
  const totalCount = modules.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const totalHours = modules.reduce((s, m) => s + m.estimatedHours, 0);

  return (
    <section className='container mx-auto px-4 py-10'>
      {/* ── Section header ──────────────────────────────────────── */}
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            {t('detail.pathRoadmap')}
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {totalCount} {t('detail.followOrderSuffix')}
          </p>
        </div>

        {/* Progress summary — right side */}
        <div className='flex shrink-0 items-center gap-4 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5'>
          <div className='text-right'>
            <p className='text-[11px] text-muted-foreground'>
              {t('detail.yourProgress')}
            </p>
            <p className='text-lg font-black leading-none text-foreground'>
              {pct}%
            </p>
          </div>
          <Progress value={pct} className='h-2 w-24 bg-muted' />
          <div className='text-right'>
            <p className='text-[11px] text-muted-foreground'>
              {t('detail.estTime')}
            </p>
            <p className='text-lg font-black leading-none text-foreground'>
              {totalHours}h
            </p>
          </div>
        </div>
      </div>

      {/* ── Module list with timeline ────────────────────────────── */}
      <div className='relative'>
        {/* Vertical timeline line */}
        <div
          aria-hidden='true'
          className={cn(
            'absolute top-5 bottom-5 w-px bg-border/40',
            isAr ? 'end-[27px]' : 'start-[27px]',
          )}
        />

        <ol className='space-y-2'>
          {modules.map((mod, idx) => {
            const cfg = MODULE_CFG[mod.type];
            const state = completedIds.includes(mod.id)
              ? 'done'
              : getModuleState(mod, idx);
            const isOpen = expanded === mod.id;
            const modTitle = isAr ? mod.ar_title : mod.title;
            const modDesc = isAr ? mod.ar_description : mod.description;
            const isLast = idx === modules.length - 1;

            return (
              <motion.li
                key={mod.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className='relative'>
                {/* ── Row layout: dot + card ──────────────────── */}
                <div className={cn('flex gap-4', isAr && 'flex-row-reverse')}>
                  {/* ── Timeline dot ────────────────────────── */}
                  <div className='relative flex shrink-0 flex-col items-center'>
                    <TimelineDot state={state} cfg={cfg} number={idx + 1} />
                    {/* Connector stub below dot (hidden for last) */}
                    {!isLast && (
                      <div
                        className={cn(
                          'mt-1 flex-1 w-px min-h-[8px]',
                          state === 'done'
                            ? 'bg-emerald-500/40'
                            : 'bg-border/0',
                        )}
                      />
                    )}
                  </div>

                  {/* ── Card ────────────────────────────────── */}
                  <div
                    className={cn(
                      'mb-2 flex-1 min-w-0 rounded-xl border bg-card',
                      'transition-all duration-200',
                      state === 'locked' || state === 'soon'
                        ? 'border-border/25 opacity-60'
                        : cn('border-border/50 cursor-pointer', cfg.bg),
                      isOpen && 'border-border shadow-sm',
                    )}>
                    {/* ── Card header (always visible) ──────── */}
                    <button
                      type='button'
                      onClick={() =>
                        state !== 'locked' && state !== 'soon' && toggle(mod.id)
                      }
                      disabled={state === 'locked' || state === 'soon'}
                      className='flex w-full items-center gap-3 px-4 py-3 text-start'
                      aria-expanded={isOpen}>
                      {/* Type icon pill */}
                      <span
                        className={cn(
                          'flex shrink-0 items-center justify-center',
                          'h-8 w-8 rounded-lg border',
                          state === 'done' &&
                            'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
                          state === 'active' && cn('border', cfg.badge),
                          state === 'locked' &&
                            'border-border bg-muted text-muted-foreground',
                          state === 'soon' &&
                            'border-border bg-muted text-muted-foreground',
                        )}>
                        {state === 'done' ? (
                          <CheckCircle2 className='h-4 w-4' />
                        ) : state === 'locked' ? (
                          <Lock className='h-3.5 w-3.5' />
                        ) : state === 'soon' ? (
                          <Clock3 className='h-3.5 w-3.5' />
                        ) : (
                          cfg.icon
                        )}
                      </span>

                      {/* Title + badges */}
                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-1.5'>
                          {/* Type badge */}
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full border',
                              'px-1.5 py-px text-[9px] font-bold uppercase tracking-wide',
                              state === 'locked' || state === 'soon'
                                ? 'border-border bg-muted text-muted-foreground'
                                : cfg.badge,
                            )}>
                            {t(cfg.labelKey)}
                          </span>

                          {/* Coming soon */}
                          {state === 'soon' && (
                            <span className='inline-flex items-center gap-1 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-zinc-500'>
                              <Sparkles className='h-2 w-2' />
                              {t('detail.soon')}
                            </span>
                          )}

                          {/* Done badge */}
                          {state === 'done' && (
                            <Badge
                              variant='outline'
                              className='rounded-full border-emerald-500/25 bg-emerald-500/10 px-1.5 py-px text-[9px] font-bold uppercase text-emerald-500'>
                              ✓ Done
                            </Badge>
                          )}
                        </div>

                        <p
                          className={cn(
                            'mt-0.5 text-sm font-semibold leading-snug',
                            state === 'done'
                              ? 'text-muted-foreground line-through decoration-muted-foreground/50'
                              : 'text-foreground',
                          )}>
                          {modTitle}
                        </p>
                      </div>

                      {/* Right meta: hours + chevron */}
                      <div
                        className={cn(
                          'flex shrink-0 items-center gap-2 text-xs text-muted-foreground',
                          isAr && 'flex-row-reverse',
                        )}>
                        <span className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {mod.estimatedHours}h
                        </span>
                        {state !== 'locked' && state !== 'soon' && (
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform duration-200',
                              isOpen && 'rotate-180',
                            )}
                          />
                        )}
                      </div>
                    </button>

                    {/* ── Expanded body ────────────────────────── */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key='body'
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          className='overflow-hidden'>
                          <div className='border-t border-border/40 px-4 pb-4 pt-3'>
                            {/* Description */}
                            <p className='mb-3 text-sm leading-relaxed text-muted-foreground'>
                              {modDesc}
                            </p>

                            {/* Meta row */}
                            <div className='mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground'>
                              <span className='flex items-center gap-1'>
                                <Clock className='h-3 w-3 text-primary' />
                                <strong className='text-foreground'>
                                  {mod.estimatedHours}
                                </strong>{' '}
                                hours
                              </span>
                              <span className='flex items-center gap-1'>
                                {cfg.icon}
                                <span className='text-foreground'>
                                  {t(cfg.labelKey)}
                                </span>
                              </span>
                            </div>

                            {/* CTA */}
                            <Button
                              size='sm'
                              className='h-7 gap-1.5 px-4 text-xs'>
                              <Play className='h-3 w-3' />
                              {state === 'done'
                                ? t('detail.continueLearning')
                                : t('detail.startThisPath')}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// ── File-private: Timeline Dot ────────────────────────────────────────

interface DotProps {
  state: ModuleState;
  cfg: (typeof MODULE_CFG)[ModuleType];
  number: number;
}

function TimelineDot({ state, cfg, number }: DotProps) {
  return (
    <div
      className={cn(
        'relative z-10 flex h-[55px] w-[55px] shrink-0 items-center justify-center',
        'rounded-full border-2 text-sm font-bold transition-all',
        state === 'done' &&
          'border-emerald-500 bg-emerald-500/15 text-emerald-500',
        state === 'active' && cn('border-2 shadow-lg', activeDotClass(cfg)),
        state === 'locked' &&
          'border-border/40 bg-muted/50 text-muted-foreground/50',
        state === 'soon' &&
          'border-dashed border-border/40 bg-muted/30 text-muted-foreground/40',
      )}>
      {state === 'done' ? (
        <CheckCircle2 className='h-5 w-5' />
      ) : state === 'locked' ? (
        <Lock className='h-4 w-4' />
      ) : state === 'soon' ? (
        <Clock3 className='h-4 w-4' />
      ) : (
        <span>{number}</span>
      )}
    </div>
  );
}

function activeDotClass(cfg: (typeof MODULE_CFG)[ModuleType]): string {
  // Extracts the color from badge class e.g. "text-blue-500 ..." → border + bg
  if (cfg.badge.includes('blue-500'))
    return 'border-blue-500 bg-blue-500/15 text-blue-500 shadow-blue-500/25';
  if (cfg.badge.includes('emerald-500'))
    return 'border-emerald-500 bg-emerald-500/15 text-emerald-500 shadow-emerald-500/25';
  if (cfg.badge.includes('amber-500'))
    return 'border-amber-500 bg-amber-500/15 text-amber-500 shadow-amber-500/25';
  if (cfg.badge.includes('violet-500'))
    return 'border-violet-500 bg-violet-500/15 text-violet-500 shadow-violet-500/25';
  return 'border-primary bg-primary/15 text-primary shadow-primary/25';
}
