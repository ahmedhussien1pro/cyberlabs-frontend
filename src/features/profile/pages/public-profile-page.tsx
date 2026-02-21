import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { usePublicProfile } from '../hooks/use-profile';
import { ProfileHero } from '../components/profile-header/profile-hero';
import { ProfileBadgesSection } from '../components/profile-badges/profile-badges-section';
import { ProfileSkillsSection } from '../components/profile-skills/profile-skills-section';
import { CareerPathCard } from '../components/profile-career/career-path-card';
import { ShareProfileButton } from '../components/profile-share/share-profile-button';

export default function PublicProfilePage() {
  const { userId = '' } = useParams<{ userId: string }>();
  const { data: profile, isLoading, isError } = usePublicProfile(userId);

  if (isLoading)
    return (
      <div className='container max-w-4xl space-y-5 py-8'>
        <Skeleton className='h-64 w-full rounded-2xl' />
        <div className='grid grid-cols-6 gap-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-24 rounded-xl' />
          ))}
        </div>
      </div>
    );

  if (isError || !profile)
    return (
      <div className='container flex min-h-[60vh] flex-col items-center justify-center gap-4'>
        <p className='text-muted-foreground'>Profile not found.</p>
        <Button asChild variant='outline' className='gap-2 rounded-full'>
          <Link to='/'>
            <ArrowLeft className='h-4 w-4' /> Go Home
          </Link>
        </Button>
      </div>
    );

  return (
    <div className='relative min-h-screen bg-background'>
      <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-3xl' />
      </div>

      <div className='container max-w-4xl space-y-5 py-8'>
        <div className='flex items-center justify-between'>
          <Button
            asChild
            variant='ghost'
            size='sm'
            className='gap-1.5 rounded-full text-muted-foreground'>
            <Link to='/'>
              <ArrowLeft className='h-3.5 w-3.5' /> Back
            </Link>
          </Button>
          <ShareProfileButton userId={profile.id} />
        </div>

        <ProfileHero profile={profile} isOwner={false} />
        <ProfileBadgesSection badges={profile.badges ?? []} />
        <ProfileSkillsSection skills={profile.skills ?? []} />

        {!!profile.careerPaths?.length && (
          <section className='space-y-3'>
            <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
              <span className='h-1.5 w-1.5 rounded-full bg-primary' /> Career
              Paths
            </h2>
            <div className='grid gap-2 sm:grid-cols-2'>
              {profile.careerPaths.map((cp, i) => (
                <CareerPathCard key={cp.id} path={cp} delay={i * 0.06} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
