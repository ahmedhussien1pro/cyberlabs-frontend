// src/features/labs/pages/lab-detail-page.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, Terminal, ArrowLeft } from 'lucide-react';
import MainLayout from '@/shared/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { useStartLabMutation, useLabDetailQuery } from '../api/labQueries';
import { useLabStore } from '../store/useLabStore';
import { DIFF_STYLES } from '../constants/diff-styles';
import { LabDetailHeader } from '../components/lab-detail-header';
import { LabInfoCards } from '../components/lab-info-cards';
import { LabLaunchBox } from '../components/lab-launch-box';
import type { Lab } from '../types/lab.types';

export default function LabDetailsPage() {
  const { slug: labId } = useParams<{ slug: string }>();
  const navigate        = useNavigate();
  const { i18n }        = useTranslation('labs');
  const lang            = i18n.language === 'ar' ? 'ar' : 'en';

  const { mutate: launchLab } = useStartLabMutation();
  const isLaunching           = useLabStore((s) => s.isLaunching);

  const { data, isLoading, isError } = useLabDetailQuery(labId);
  const lab      = data?.lab as Lab | undefined;
  const diff     = lab ? (DIFF_STYLES[lab.difficulty] ?? DIFF_STYLES.BEGINNER) : null;
  const title    = lab ? (lang === 'ar' ? lab.ar_title       : lab.title)       : '';
  const desc     = lab ? (lang === 'ar' ? lab.ar_description : lab.description) : '';
  const progress = lab?.usersProgress?.[0];
  const isCompleted = !!progress?.flagSubmitted;
  const isStarted   = !!progress && !isCompleted;

  // ── Loading ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <MainLayout>
        <div className='flex h-[60vh] items-center justify-center'>
          <Loader2 className='h-8 w-8 text-primary animate-spin' />
        </div>
      </MainLayout>
    );
  }

  // ── Error / Not Found ─────────────────────────────────────────────────
  if (isError || !lab || !diff) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16 text-center space-y-4'>
          <div className='mx-auto h-14 w-14 rounded-2xl bg-muted flex items-center justify-center border border-border/40'>
            <Terminal className='h-7 w-7 text-muted-foreground' />
          </div>
          <h1 className='text-2xl font-bold'>Lab Not Found</h1>
          <p className='text-sm text-muted-foreground'>
            ID: <code className='bg-muted px-2 py-1 rounded text-xs'>{labId}</code>
          </p>
          <Button variant='outline' onClick={() => navigate(ROUTES.LABS.LIST)}>
            <ArrowLeft className='h-4 w-4 me-2' /> Back to Labs
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Color stripe */}
      <div className={cn('h-[3px] w-full', diff.stripeCls)} />

      <div className='container mx-auto max-w-4xl px-4 py-8 space-y-8'>
        {/* Back */}
        <button
          onClick={() => navigate(ROUTES.LABS.LIST)}
          className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'>
          <ArrowLeft className='h-4 w-4' /> Back to Labs
        </button>

        {/* Header */}
        <LabDetailHeader
          title={title}
          description={desc}
          difficulty={lab.difficulty}
          duration={lab.duration}
          xpReward={lab.xpReward}
          pointsReward={lab.pointsReward}
          isCompleted={isCompleted}
          isStarted={isStarted}
        />

        {/* Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {/* Left 2/3 — Scenario + Objective + Skills */}
          <div className='md:col-span-2'>
            <LabInfoCards
              scenario={lab.scenario}
              objective={lab.objective}
              skills={lab.skills}
              fallbackDesc={desc}
            />
          </div>

          {/* Right 1/3 — Hints + Launch */}
          <LabLaunchBox
            hints={lab.hints}
            progress={progress}
            isCompleted={isCompleted}
            isStarted={isStarted}
            isLaunching={isLaunching}
            onLaunch={() => launchLab(lab.id)}
          />
        </div>
      </div>
    </MainLayout>
  );
}
