import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/shared/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStartLabMutation, useLabDetailQuery } from '../api/labQueries';
import { useLabStore } from '../store/useLabStore';
import {
  ArrowLeft,
  Clock,
  Zap,
  Trophy,
  Terminal,
  TrendingUp,
  Gauge,
  Flame,
  Loader2,
  BookOpen,
  Target,
  Lightbulb,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { useTranslation } from 'react-i18next';
import type { Lab } from '../types/lab.types';

const DIFF_STYLES = {
  BEGINNER: {
    Icon: TrendingUp,
    label: 'Beginner',
    cls: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    iconCls: 'text-emerald-400',
    gradientCls: 'from-emerald-950 border-emerald-800/50',
  },
  INTERMEDIATE: {
    Icon: Gauge,
    label: 'Intermediate',
    cls: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10',
    iconCls: 'text-yellow-400',
    gradientCls: 'from-yellow-950 border-yellow-800/50',
  },
  ADVANCED: {
    Icon: Flame,
    label: 'Advanced',
    cls: 'border-red-500/40 text-red-400 bg-red-500/10',
    iconCls: 'text-red-400',
    gradientCls: 'from-red-950 border-red-800/50',
  },
} as const;

export default function LabDetailsPage() {
  const { slug: labId } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation('labs');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const { mutate: launchLab } = useStartLabMutation();
  const isLaunching = useLabStore((s) => s.isLaunching);

  // ✅ apiClient بـ JWT interceptor
  const { data, isLoading, isError } = useLabDetailQuery(labId);

  const lab = data?.lab as Lab | undefined;
  const diff = lab
    ? (DIFF_STYLES[lab.difficulty] ?? DIFF_STYLES.BEGINNER)
    : null;
  const progress = lab?.usersProgress?.[0];
  const title = lab ? (lang === 'ar' ? lab.ar_title : lab.title) : '';
  const desc = lab
    ? lang === 'ar'
      ? lab.ar_description
      : lab.description
    : '';

  if (isLoading) {
    return (
      <MainLayout>
        <div className='flex h-[60vh] items-center justify-center'>
          <Loader2 className='h-8 w-8 text-primary animate-spin' />
        </div>
      </MainLayout>
    );
  }

  if (isError || !lab || !diff) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16 text-center space-y-4'>
          <h1 className='text-2xl font-bold'>Lab Not Found</h1>
          <p className='text-sm text-muted-foreground'>
            ID:{' '}
            <code className='bg-muted px-2 py-1 rounded text-xs'>{labId}</code>
          </p>
          <Button variant='outline' onClick={() => navigate(ROUTES.LABS.LIST)}>
            ← Back to Labs
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isCompleted = !!progress?.flagSubmitted;
  const isStarted = !!progress && !isCompleted;

  return (
    <MainLayout>
      <div className='container mx-auto max-w-4xl px-4 py-10 space-y-8'>
        {/* Back */}
        <button
          onClick={() => navigate(ROUTES.LABS.LIST)}
          className='flex items-center gap-2 text-sm text-muted-foreground
                     hover:text-foreground transition-colors'>
          <ArrowLeft className='h-4 w-4' />
          Back to Labs
        </button>

        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-start gap-5'>
          <div
            className={cn(
              'h-16 w-16 shrink-0 rounded-2xl border bg-gradient-to-br',
              'flex items-center justify-center',
              diff.gradientCls,
            )}>
            <Terminal className={cn('h-7 w-7', diff.iconCls)} />
          </div>
          <div className='flex-1 space-y-2'>
            <h1 className='text-2xl font-bold leading-tight'>{title}</h1>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {desc}
            </p>
            <div className='flex flex-wrap gap-2 pt-1'>
              <Badge
                variant='outline'
                className={cn('gap-1 text-xs', diff.cls)}>
                <diff.Icon className='h-3.5 w-3.5' />
                {diff.label}
              </Badge>
              <Badge
                variant='outline'
                className='gap-1 text-xs border-primary/30 text-primary bg-primary/5'>
                <Clock className='h-3.5 w-3.5' />
                {lab.duration}m
              </Badge>
              <Badge
                variant='outline'
                className='gap-1 text-xs text-yellow-400 border-yellow-500/30 bg-yellow-500/5'>
                <Zap className='h-3.5 w-3.5' />
                {lab.xpReward} XP
              </Badge>
              <Badge
                variant='outline'
                className='gap-1 text-xs text-muted-foreground'>
                <Trophy className='h-3.5 w-3.5' />
                {lab.pointsReward} pts
              </Badge>
              {isCompleted && (
                <Badge
                  className='gap-1 text-xs bg-emerald-500/20
                                  text-emerald-400 border border-emerald-500/30'>
                  ✅ Solved
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {/* Left 2/3 */}
          <div className='md:col-span-2 space-y-5'>
            <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
              <div className='flex items-center gap-2 text-sm font-bold'>
                <BookOpen className='h-4 w-4 text-primary' />
                Scenario
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {lab.scenario ?? desc}
              </p>
            </div>

            <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
              <div className='flex items-center gap-2 text-sm font-bold'>
                <Target className='h-4 w-4 text-primary' />
                Objective
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Bypass the login form and gain administrator access without
                knowing the password.
              </p>
            </div>

            {lab.skills?.length > 0 && (
              <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
                <div className='flex items-center gap-2 text-sm font-bold'>
                  <Code2 className='h-4 w-4 text-primary' />
                  Skills You'll Practice
                </div>
                <div className='flex flex-wrap gap-2'>
                  {lab.skills.map((s: string) => (
                    <span
                      key={s}
                      className='text-xs px-3 py-1 rounded-full bg-primary/10
                                 border border-primary/20 text-primary font-medium'>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right 1/3 */}
          <div className='space-y-4'>
            {lab.hints?.length > 0 && (
              <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
                <div className='flex items-center gap-2 text-sm font-bold'>
                  <Lightbulb className='h-4 w-4 text-yellow-400' />
                  Hints Available
                </div>
                <div className='space-y-1.5'>
                  {lab.hints.map((h: any, i: number) => (
                    <div
                      key={h.id}
                      className='flex justify-between text-xs text-muted-foreground'>
                      <span>Hint {i + 1}</span>
                      <span className='text-yellow-400 font-bold'>
                        −{h.xpCost} XP
                      </span>
                    </div>
                  ))}
                </div>
                <p className='text-[11px] text-muted-foreground/60 leading-relaxed'>
                  Unlocked inside the lab. Costs XP.
                </p>
              </div>
            )}

            {isStarted && progress && (
              <div className='rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5 space-y-1.5'>
                <p className='text-xs font-bold text-yellow-400'>
                  ⏳ In Progress
                </p>
                <p className='text-xs text-muted-foreground'>
                  {progress.attempts} attempt
                  {progress.attempts !== 1 ? 's' : ''}.
                  {progress.hintsUsed > 0
                    ? ` ${progress.hintsUsed} hint(s) used.`
                    : ''}
                </p>
              </div>
            )}

            {/* Launch Box */}
            <div className='rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3'>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                Opens in a <strong className='text-foreground'>new tab</strong>{' '}
                on the labs platform. Progress is tracked automatically.
              </p>
              <Button
                className='w-full h-11 font-bold text-sm rounded-xl'
                disabled={isLaunching}
                onClick={() => launchLab(lab.id)}>
                {isLaunching ? (
                  <>
                    <Loader2 className='h-4 w-4 me-2 animate-spin' />
                    Launching...
                  </>
                ) : isCompleted ? (
                  '🔁 Try Again'
                ) : isStarted ? (
                  '⚡ Resume Lab'
                ) : (
                  '🚀 Launch Lab'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
