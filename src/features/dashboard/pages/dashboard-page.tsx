import { useUserPoints } from '@/shared/hooks/use-user-data';
import { XpProgressBar } from '@/features/profile/components/profile-activity/xp-progress-bar';
import { WelcomeBanner } from '../components/overview/welcome-banner';
import { StatsRow } from '../components/overview/stats-row';
import { ActiveCoursesCard } from '../components/overview/active-courses-card';
import { RecentLabsCard } from '../components/overview/recent-labs-card';

export default function DashboardPage(): React.ReactElement {
  const { data: points } = useUserPoints();

  return (
    <div className='container max-w-5xl space-y-5 py-6'>
      <WelcomeBanner />
      <StatsRow />
      {points && <XpProgressBar points={points} />}
      <div className='grid gap-5 lg:grid-cols-2'>
        <ActiveCoursesCard />
        <RecentLabsCard />
      </div>
    </div>
  );
}
