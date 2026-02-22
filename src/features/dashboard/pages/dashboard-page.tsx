import { useUserPoints } from '@/shared/hooks/use-user-data';
import { XpProgressBar } from '@/features/profile/components/profile-activity/xp-progress-bar';
import { WelcomeBanner } from '../components/overview/welcome-banner';
import { StatsRow } from '../components/overview/stats-row';
import { ActiveCoursesCard } from '../components/overview/active-courses-card';
import { RecentLabsCard } from '../components/overview/recent-labs-card';
import { ProgressChart } from '../components/overview/progress-chart';
import { LeaderboardWidget } from '../components/overview/leaderboard-widget';
import { QuickGoals } from '../components/overview/quick-goals';

export default function DashboardPage(): React.ReactElement {
  const { data: points } = useUserPoints();

  return (
    <div className='container max-w-5xl space-y-5 py-6'>
      {/* Row 1: Welcome banner */}
      <WelcomeBanner />

      {/* Row 2: Stats cards */}
      <StatsRow />

      {/* Row 3: XP progress */}
      {points && <XpProgressBar points={points} />}

      {/* Row 4: Weekly chart + Goals */}
      <div className='grid gap-5 lg:grid-cols-2'>
        <ProgressChart />
        <QuickGoals />
      </div>

      {/* Row 5: Active courses + Recent labs */}
      <div className='grid gap-5 lg:grid-cols-2'>
        <ActiveCoursesCard />
        <RecentLabsCard />
      </div>

      {/* Row 6: Leaderboard */}
      <LeaderboardWidget />
    </div>
  );
}
