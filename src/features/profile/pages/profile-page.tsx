import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfile } from '../hooks/use-profile';
import {
  useProfileStats,
  useProfileActivity,
} from '../hooks/use-profile-stats';
import { useProfilePoints } from '../hooks/use-profile-points';
import { ProfileHero } from '../components/profile-header/profile-hero';
import { ProfileStatsGrid } from '../components/profile-stats/profile-stats-grid';
import { XpProgressBar } from '../components/profile-activity/xp-progress-bar';
import { ActivityHeatmap } from '../components/profile-activity/activity-heatmap';
import { ProfileBadgesSection } from '../components/profile-badges/profile-badges-section';
import { ProfileSkillsSection } from '../components/profile-skills/profile-skills-section';
import { ProfileLabsSection } from '../components/profile-labs/profile-labs-section';
import { CareerPathCard } from '../components/profile-career/career-path-card';
import { EditProfileForm } from '../components/profile-edit/edit-profile-form';
import { ShareProfileButton } from '../components/profile-share/share-profile-button';

export default function ProfilePage(): React.ReactElement {
  const [editOpen, setEditOpen] = useState(false);
  const { data: profile, isLoading } = useProfile();
  const { data: stats } = useProfileStats();
  const { data: points } = useProfilePoints();
  const { data: activity } = useProfileActivity();

  if (isLoading) return <ProfilePageSkeleton />;
  if (!profile) return <></>;

  return (
    <div className='relative min-h-screen bg-background'>
      <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-3xl' />
        <div className='absolute -right-40 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.03] blur-3xl' />
      </div>

      <div className='container max-w-4xl space-y-5 py-8'>
        <div className='flex justify-end'>
          <ShareProfileButton userId={profile.id} />
        </div>

        <ProfileHero
          profile={profile}
          points={points}
          isOwner
          onEdit={() => setEditOpen(true)}
        />

        <ProfileStatsGrid stats={stats} points={points} />

        {points && <XpProgressBar points={points} />}

        <ActivityHeatmap activities={activity} />

        <ProfileBadgesSection badges={profile.badges ?? []} />
        <ProfileSkillsSection skills={profile.skills ?? []} />
        <ProfileLabsSection />

        {!!profile.careerPaths?.length && (
          <section className='space-y-3'>
            <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
              <span className='h-1.5 w-1.5 rounded-full bg-primary' />
              Career Paths
            </h2>
            <div className='grid gap-2 sm:grid-cols-2'>
              {profile.careerPaths.map((cp, i) => (
                <CareerPathCard key={cp.id} path={cp} delay={i * 0.06} />
              ))}
            </div>
          </section>
        )}
      </div>

      <EditProfileForm
        profile={profile}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}

function ProfilePageSkeleton(): React.ReactElement {
  return (
    <div className='container max-w-4xl space-y-5 py-8'>
      <Skeleton className='ml-auto h-8 w-28 rounded-full' />
      <Skeleton className='h-64 w-full rounded-2xl' />
      <div className='grid grid-cols-6 gap-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-xl' />
        ))}
      </div>
      <Skeleton className='h-16 w-full rounded-xl' />
      <Skeleton className='h-40 w-full rounded-xl' />
    </div>
  );
}
