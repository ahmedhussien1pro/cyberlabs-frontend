// src/features/dashboard/pages/dashboard-page.tsx
import { Timer, Award, Swords, CalendarDays, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WelcomeBanner } from '../components/overview/welcome-banner';
import { SubscriptionBanner } from '../components/overview/subscription-banner';
import { StatsRow } from '../components/overview/stats-row';
import { ActiveCoursesCard } from '../components/overview/active-courses-card';
import { RecentLabsCard } from '../components/overview/recent-labs-card';
import { ProgressChart } from '../components/overview/progress-chart';
import { LeaderboardWidget } from '../components/overview/leaderboard-widget';
import { QuickGoals } from '../components/overview/quick-goals';
import { PathsCard } from '../components/overview/paths-card';
import { LevelProgressBar } from '../components/overview/level-progress-bar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/* ── Coming Soon Placeholder Card ── */
interface ComingSoonCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  accent?: string;
}

function ComingSoonCard({
  icon: Icon,
  title,
  description,
  accent = 'text-muted-foreground',
}: ComingSoonCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 rounded-xl',
        'border border-dashed border-border/50 bg-muted/20 p-6 text-center',
        'select-none opacity-60',
      )}>
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
        <Icon size={20} className={accent} />
      </div>
      <div>
        <p className='text-sm font-semibold text-foreground'>{title}</p>
        <p className='mt-0.5 text-xs text-muted-foreground'>{description}</p>
      </div>
      <Badge
        variant='outline'
        className='absolute right-3 top-3 gap-1 border-border/50 text-[10px] text-muted-foreground'>
        <Lock size={9} />
        Coming Soon
      </Badge>
    </div>
  );
}

export default function DashboardPage(): React.ReactElement {
  const { t } = useTranslation('dashboard');

  return (
    <div className='container max-w-5xl space-y-5 py-6'>
      {/* Row 1: Welcome */}
      <WelcomeBanner />

      {/* Row 2: Subscription status */}
      <SubscriptionBanner />

      {/* Row 3: 6 Stats cards */}
      <StatsRow />

      {/* Row 4: XP level bar — ✅ Fix: replaced XpProgressBar (was using stale level) */}
      {/* with LevelProgressBar that reads xpIntoCurrentLevel from the new /me/points shape */}
      <LevelProgressBar />

      {/* Row 5: Weekly chart + Goals */}
      <div className='grid gap-5 lg:grid-cols-2'>
        <ProgressChart />
        <QuickGoals />
      </div>

      {/* Row 6: Courses + Labs */}
      <div className='grid gap-5 lg:grid-cols-2'>
        <ActiveCoursesCard />
        <RecentLabsCard />
      </div>

      {/* Row 7: Learning Paths — ✅ Fix: now reads from GET /paths/me */}
      <PathsCard />

      {/* Row 8: Leaderboard */}
      <LeaderboardWidget />

      {/* Row 9: Coming Soon */}
      <section className='space-y-3'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-border' />
          {t('overview.comingSoon', 'Coming Soon')}
        </h2>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <ComingSoonCard
            icon={Timer}
            title={t('comingSoon.studyTimer', 'Study Timer')}
            description={t('comingSoon.studyTimerDesc', 'Pomodoro focus sessions with XP rewards')}
            accent='text-orange-500'
          />
          <ComingSoonCard
            icon={Award}
            title={t('comingSoon.certificates', 'Certificates')}
            description={t('comingSoon.certificatesDesc', 'Earn & share your achievements')}
            accent='text-yellow-500'
          />
          <ComingSoonCard
            icon={Swords}
            title={t('comingSoon.ctf', 'CTF Challenges')}
            description={t('comingSoon.ctfDesc', 'Compete in capture-the-flag events')}
            accent='text-red-500'
          />
          <ComingSoonCard
            icon={CalendarDays}
            title={t('comingSoon.schedule', 'Study Schedule')}
            description={t('comingSoon.scheduleDesc', 'Plan your learning calendar')}
            accent='text-blue-500'
          />
        </div>
      </section>
    </div>
  );
}
