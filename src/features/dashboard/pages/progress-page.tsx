import { useTranslation } from 'react-i18next';
import { BarChart3, BrainCircuit } from 'lucide-react';
import { StatsRow } from '../components/overview/stats-row';
import { ProgressChart } from '../components/overview/progress-chart';
import { CourseProgressList } from '../components/progress/course-progress-list';
import { ComingSoonBanner } from '@/shared/components/common/coming-soon-banner';

export default function ProgressPage(): React.ReactElement {
  const { t } = useTranslation('dashboard');

  return (
    <div className='container max-w-5xl space-y-6 py-6'>
      {/* ── Header ──────────────────────────────────── */}
      <div>
        <h1 className='text-xl font-black tracking-tight'>
          {t('progress.title')}
        </h1>
        <p className='mt-0.5 text-sm text-muted-foreground'>
          {t('progress.subtitle')}
        </p>
      </div>

      {/* ── Stats Row ───────────────────────────────── */}
      <StatsRow />

      {/* ── Chart + Courses ─────────────────────────── */}
      <div className='grid gap-5 lg:grid-cols-2'>
        <ProgressChart />
        <CourseProgressList />
      </div>

      {/* ── Coming Soon ─────────────────────────────── */}
      <div className='grid gap-3 sm:grid-cols-2'>
        <ComingSoonBanner
          icon={<BarChart3 size={15} className='text-primary' />}
          title={t('progress.cs.monthlyTitle')}
          description={t('progress.cs.monthlyDesc')}
        />
        <ComingSoonBanner
          icon={<BrainCircuit size={15} className='text-primary' />}
          title={t('progress.cs.aiTitle')}
          description={t('progress.cs.aiDesc')}
        />
      </div>
    </div>
  );
}
