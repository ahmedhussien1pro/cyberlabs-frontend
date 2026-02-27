import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ENV } from '@/shared/constants/env';
import MainLayout from '@/shared/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStartLabMutation } from '../api/labQueries';
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
  },
  INTERMEDIATE: {
    Icon: Gauge,
    label: 'Intermediate',
    cls: 'border-yellow-500/40  text-yellow-400  bg-yellow-500/10',
  },
  ADVANCED: {
    Icon: Flame,
    label: 'Advanced',
    cls: 'border-red-500/40     text-red-400     bg-red-500/10',
  },
} as const;

export default function LabDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation('labs');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const { mutate: launchLab } = useStartLabMutation();
  const isLaunching = useLabStore((s) => s.isLaunching);

  const { data, isLoading, isError } = useQuery<{ success: boolean; lab: Lab }>(
    {
      queryKey: ['lab', slug],
      queryFn: async () => {
        const res = await axios.get(`${ENV.API_URL}/practice-labs/${slug}`, {
          withCredentials: true,
        });
        return res.data;
      },
      enabled: !!slug,
    },
  );

  const lab = data?.lab;
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

  /* ── Loading ── */
  if (isLoading) {
    return (
      <MainLayout>
        <div className='flex h-[60vh] items-center justify-center'>
          <Loader2 className='h-8 w-8 text-primary animate-spin' />
        </div>
      </MainLayout>
    );
  }

  /* ── Error / Not found ── */
  if (isError || !lab || !diff) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16 text-center'>
          <h1 className='text-2xl font-bold mb-3'>Lab Not Found</h1>
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
        {/* ── Back ── */}
        <button
          onClick={() => navigate(ROUTES.LABS.LIST)}
          className='flex items-center gap-2 text-sm text-muted-foreground
                     hover:text-foreground transition-colors'>
          <ArrowLeft className='h-4 w-4' />
          Back to Labs
        </button>

        {/* ── Header ── */}
        <div className='flex flex-col sm:flex-row sm:items-start gap-5'>
          <div
            className={cn(
              'h-16 w-16 shrink-0 rounded-2xl border flex items-center justify-center',
              'bg-gradient-to-br',
              lab.difficulty === 'BEGINNER'
                ? 'from-emerald-950 border-emerald-800/50'
                : lab.difficulty === 'INTERMEDIATE'
                  ? 'from-yellow-950 border-yellow-800/50'
                  : 'from-red-950 border-red-800/50',
            )}>
            <Terminal
              className={cn(
                'h-7 w-7',
                `text-${lab.difficulty === 'BEGINNER' ? 'emerald' : lab.difficulty === 'INTERMEDIATE' ? 'yellow' : 'red'}-400`,
              )}
            />
          </div>
          <div className='flex-1 space-y-2'>
            <h1 className='text-2xl font-bold leading-tight'>{title}</h1>
            <p className='text-muted-foreground leading-relaxed'>{desc}</p>
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
                <Badge className='gap-1 text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30'>
                  ✅ Solved
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* ── Two-column grid ── */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {/* Left col (2/3) */}
          <div className='md:col-span-2 space-y-5'>
            {/* Scenario */}
            <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
              <div className='flex items-center gap-2 font-bold text-sm'>
                <BookOpen className='h-4 w-4 text-primary' />
                Scenario
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {lab.scenario ?? desc}
              </p>
            </div>

            {/* Objective */}
            <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
              <div className='flex items-center gap-2 font-bold text-sm'>
                <Target className='h-4 w-4 text-primary' />
                Objective
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Access the administrator dashboard without knowing the password.
              </p>
            </div>

            {/* Skills */}
            {lab.skills?.length > 0 && (
              <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-3'>
                <div className='flex items-center gap-2 font-bold text-sm'>
                  <Code2 className='h-4 w-4 text-primary' />
                  Skills You'll Practice
                </div>
                <div className='flex flex-wrap gap-2'>
                  {lab.skills.map((s) => (
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

          {/* Right col (1/3) */}
          <div className='space-y-4'>
            {/* Hints count */}
            {lab.hints?.length > 0 && (
              <div className='rounded-2xl border border-border/50 bg-card p-5 space-y-2'>
                <div className='flex items-center gap-2 font-bold text-sm'>
                  <Lightbulb className='h-4 w-4 text-yellow-400' />
                  Hints Available
                </div>
                <div className='space-y-1.5'>
                  {lab.hints.map((h, i) => (
                    <div
                      key={h.id}
                      className='flex items-center justify-between
                                 text-xs text-muted-foreground'>
                      <span>Hint {i + 1}</span>
                      <span className='text-yellow-400 font-bold'>
                        -{h.xpCost} XP
                      </span>
                    </div>
                  ))}
                </div>
                <p className='text-[11px] text-muted-foreground/70 pt-1'>
                  Hints cost XP. Use them wisely inside the lab.
                </p>
              </div>
            )}

            {/* Progress if started */}
            {isStarted && progress && (
              <div className='rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5 space-y-2'>
                <p className='text-xs font-bold text-yellow-400'>
                  ⏳ In Progress
                </p>
                <p className='text-xs text-muted-foreground'>
                  {progress.attempts} attempt
                  {progress.attempts !== 1 ? 's' : ''} so far.
                  {progress.hintsUsed > 0 &&
                    ` ${progress.hintsUsed} hint(s) used.`}
                </p>
              </div>
            )}

            {/* Launch CTA */}
            <div className='rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3'>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                The lab environment will open in a <strong>new tab</strong>.
                Your session is tracked automatically.
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
