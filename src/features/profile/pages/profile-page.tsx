import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/shared/components/common/theme-toggle';
import { LanguageSwitcher } from '@/shared/components/common/language-switcher';
import { ROUTES } from '@/shared/constants';

import { useProfile } from '../hooks/use-profile';
import {
  useProfileStats,
  useProfileActivity,
} from '../hooks/use-profile-stats';
import { useProfilePoints } from '../hooks/use-profile-points';

import { ProfileHero } from '../components/profile-header/profile-hero';
import { ProfileCompletionBar } from '../components/profile-header/profile-completion-bar';
import { ProfileStatsGrid } from '../components/profile-stats/profile-stats-grid';
import { XpProgressBar } from '../components/profile-activity/xp-progress-bar';
import { ActivityHeatmap } from '../components/profile-activity/activity-heatmap';
import { ProfileBadgesSection } from '../components/profile-badges/profile-badges-section';
import { ProfileSkillsSection } from '../components/profile-skills/profile-skills-section';
import { ProfileLabsSection } from '../components/profile-labs/profile-labs-section';
import { CareerPathCard } from '../components/profile-career/career-path-card';
import { EditProfileForm } from '../components/profile-edit/edit-profile-form';
import { ShareProfileButton } from '../components/profile-share/share-profile-button';
import { ActiveCoursesCard } from '@/features/dashboard/components/overview/active-courses-card';

import { calcProfileCompletion } from '../utils/profile-completion';

export default function ProfilePage(): React.ReactElement {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  const { data: profile, isLoading } = useProfile();
  const { data: stats } = useProfileStats();
  const { data: points } = useProfilePoints();
  const { data: activity } = useProfileActivity();

  if (isLoading) return <ProfilePageSkeleton />;
  if (!profile) return <></>;

  const { percentage, checks } = calcProfileCompletion(profile);

  return (
    <div className='relative min-h-screen bg-background'>
      {/* Ambient bg */}
      <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-3xl' />
        <div className='absolute -right-40 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.03] blur-3xl' />
      </div>

      {/* Topbar */}
      <header
        className='sticky top-0 z-40 flex items-center justify-between
                         border-b border-border/40 bg-background/80 px-4 py-2 backdrop-blur-md'>
        <Button
          variant='ghost'
          size='sm'
          className='gap-1.5 text-muted-foreground hover:text-foreground'
          onClick={() => navigate(ROUTES.DASHBOARD.DashboardPage)}>
          <ArrowLeft size={16} />
          <span className='text-xs font-medium'>{t('nav.back', 'Back')}</span>
        </Button>
        <span className='text-sm font-semibold'>
          {t('nav.title', 'Profile')}
        </span>
        <div className='flex items-center gap-1'>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <div className='container max-w-4xl space-y-5 py-6'>
        <div className='flex justify-end'>
          <ShareProfileButton userId={profile.id} />
        </div>

        <ProfileHero
          profile={profile}
          points={points}
          isOwner
          onEdit={() => setEditOpen(true)}
        />

        {/* Profile completion bar (hidden if 100%) */}
        <ProfileCompletionBar
          percentage={percentage}
          checks={checks}
          onEdit={() => setEditOpen(true)}
        />

        <ProfileStatsGrid stats={stats} points={points} />

        {points && <XpProgressBar points={points} />}

        <ActivityHeatmap activities={activity} />

        <ProfileBadgesSection badges={profile.badges ?? []} />
        <ProfileSkillsSection skills={profile.skills ?? []} />
        <ProfileLabsSection />

        {/* Active courses (reused from Dashboard) */}
        <ActiveCoursesCard />

        {(profile.careerPaths ?? []).length > 0 && (
          <section className='space-y-3'>
            <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
              <span className='h-1.5 w-1.5 rounded-full bg-primary' />
              {t('sections.careerPaths', 'Career Paths')}
            </h2>
            <div className='grid gap-2 sm:grid-cols-2'>
              {(profile.careerPaths ?? []).map((cp, i) => (
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
    <>
      <header
        className='sticky top-0 z-40 flex items-center justify-between
                         border-b border-border/40 bg-background/80 px-4 py-2 backdrop-blur-md'>
        <Skeleton className='h-7 w-16 rounded-md' />
        <Skeleton className='h-4 w-16' />
        <div className='flex gap-1'>
          <Skeleton className='h-7 w-7' />
          <Skeleton className='h-7 w-7' />
        </div>
      </header>
      <div className='container max-w-4xl space-y-5 py-6'>
        <Skeleton className='h-64 w-full rounded-2xl' />
        <Skeleton className='h-20 w-full rounded-xl' />
        <div className='grid grid-cols-6 gap-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-24 rounded-xl' />
          ))}
        </div>
        <Skeleton className='h-16 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
      </div>
    </>
  );
}
