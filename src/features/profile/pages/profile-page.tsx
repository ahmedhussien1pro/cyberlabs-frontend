// src/features/profile/pages/profile-page.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

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
import { useProfileBadges } from '../hooks/use-profile-badges';
import { useProfilePaths } from '../hooks/use-profile-paths';
import { useProfileCertifications } from '../hooks/use-profile-certifications';

import { ProfileHero } from '../components/profile-header/profile-hero';
import { ProfileCompletionBar } from '../components/profile-header/profile-completion-bar';
import { ProfileStatsGrid } from '../components/profile-stats/profile-stats-grid';
import { XpProgressBar } from '../components/profile-activity/xp-progress-bar';
import { ActivityHeatmap } from '../components/profile-activity/activity-heatmap';
import { ProfileBadgesSection } from '../components/profile-badges/profile-badges-section';
import { ProfileAchievementsSection } from '../components/profile-achievements/profile-achievements-section';
import { ProfileCertificationsSection } from '../components/profile-certifications/profile-certifications-section';
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

  // ── Core profile data ─────────────────────────────────────────────
  const { data: profile, isLoading, isError } = useProfile();
  const { data: stats } = useProfileStats();
  const { data: points } = useProfilePoints();
  const { data: activity } = useProfileActivity();

  // ── Dedicated API hooks — no longer read from profile object ────────
  const { data: badges = [] } = useProfileBadges(); // GET /badges/my
  const { data: careerPaths = [] } = useProfilePaths(); // GET /paths/me
  const { data: certifications = [] } = useProfileCertifications(); // GET /certificates/my

  if (isLoading) return <ProfilePageSkeleton />;
  if (isError || !profile) return <ProfilePageError />;

  const { percentage, checks } = calcProfileCompletion(profile);

  return (
    <div className='relative min-h-screen bg-background'>
      {/* ── Ambient background ─────────────────────────────────────── */}
      <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute -left-40 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/[0.05] blur-3xl' />
        <div className='absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.04] blur-3xl' />
        <div className='absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-violet-500/[0.03] blur-3xl' />
      </div>

      {/* ── Sticky header ──────────────────────────────────────────── */}
      <header className='sticky top-0 z-40 flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-2.5 backdrop-blur-md'>
        <Button
          variant='ghost'
          size='sm'
          className='gap-1.5 text-muted-foreground hover:text-foreground'
          onClick={() => navigate(ROUTES.DASHBOARD.DashboardPage)}>
          <ArrowLeft size={16} />
          <span className='text-xs font-medium'>{t('nav.back')}</span>
        </Button>
        <span className='text-sm font-semibold tracking-tight'>
          {t('nav.title')}
        </span>
        <div className='flex items-center gap-1'>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────────── */}
      <div className='container max-w-4xl space-y-6 py-6'>
        {/* Share button */}
        <div className='flex justify-end'>
          <ShareProfileButton userId={profile.id} />
        </div>

        {/* ① Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}>
          <ProfileHero
            profile={profile}
            points={points}
            isOwner
            onEdit={() => setEditOpen(true)}
          />
        </motion.div>

        {/* ② Completion bar (hidden at 100%) */}
        <ProfileCompletionBar
          percentage={percentage}
          checks={checks}
          onEdit={() => setEditOpen(true)}
        />

        {/* ③ Stats + XP */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className='space-y-4'>
          <ProfileStatsGrid stats={stats} points={points} />
          {points && <XpProgressBar points={points} />}
        </motion.div>

        {/* ④ Activity heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}>
          <ActivityHeatmap activities={activity} />
        </motion.div>

        {/* ── Section divider ── */}
        <div className='h-px bg-gradient-to-r from-transparent via-border/60 to-transparent' />

        {/* ⑤ Badges — earned only, from GET /badges/my */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}>
          <ProfileBadgesSection badges={badges} showLocked={false} />
        </motion.div>

        {/* ⑥ Achievements — Coming Soon */}
        <ProfileAchievementsSection achievements={[]} />

        {/* ⑦ Certifications — from GET /certificates/my */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}>
          <ProfileCertificationsSection
            certifications={certifications}
            userName={profile.name}
          />
        </motion.div>

        {/* ⑧ Skills — Coming Soon */}
        <ProfileSkillsSection skills={[]} />

        {/* ── Section divider ── */}
        <div className='h-px bg-gradient-to-r from-transparent via-border/60 to-transparent' />

        {/* ⑨ Completed Labs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}>
          <ProfileLabsSection />
        </motion.div>

        {/* ⑩ Courses */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}>
          <ActiveCoursesCard />
        </motion.div>

        {/* ⑪ Career Paths — from GET /paths/me */}
        {careerPaths.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
            className='space-y-3'>
            <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
              <span className='h-1.5 w-1.5 rounded-full bg-violet-500' />
              {t('sections.careerPaths')}
              <span className='rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-500'>
                {careerPaths.length}
              </span>
            </h2>
            <div className='grid gap-2 sm:grid-cols-2'>
              {careerPaths.map((cp, i) => (
                <CareerPathCard key={cp.id} path={cp} delay={i * 0.06} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ── Edit modal ─────────────────────────────────────────────── */}
      <EditProfileForm
        profile={profile}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────
function ProfilePageSkeleton(): React.ReactElement {
  return (
    <>
      <header className='sticky top-0 z-40 flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-2.5 backdrop-blur-md'>
        <Skeleton className='h-7 w-16 rounded-md' />
        <Skeleton className='h-4 w-20' />
        <div className='flex gap-1'>
          <Skeleton className='h-7 w-7 rounded-md' />
          <Skeleton className='h-7 w-7 rounded-md' />
        </div>
      </header>
      <div className='container max-w-4xl space-y-6 py-6'>
        <Skeleton className='ml-auto h-8 w-28 rounded-full' />
        <Skeleton className='h-64 w-full rounded-2xl' />
        <Skeleton className='h-20 w-full rounded-xl' />
        <div className='grid grid-cols-6 gap-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-24 rounded-xl' />
          ))}
        </div>
        <Skeleton className='h-16 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
        <Skeleton className='h-48 w-full rounded-xl' />
        <Skeleton className='h-32 w-full rounded-xl' />
        <Skeleton className='h-32 w-full rounded-xl' />
      </div>
    </>
  );
}

// ─── Error state ───────────────────────────────────────────────────────────
function ProfilePageError(): React.ReactElement {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  return (
    <div className='container flex min-h-screen flex-col items-center justify-center gap-4'>
      <p className='text-sm text-muted-foreground'>{t('loadError')}</p>
      <Button
        variant='outline'
        className='gap-2 rounded-full'
        onClick={() => navigate(ROUTES.DASHBOARD.DashboardPage)}>
        <ArrowLeft className='h-4 w-4' />
        {t('nav.back')}
      </Button>
    </div>
  );
}
