import { HeroTeamSection } from '@/features/about/components/hero-team-section';
import { TeamSection } from '@/features/about/components/team-section';
import MainLayout from '@/shared/components/layout/main-layout';

export default function AboutPage() {
  return (
    <MainLayout>
      <main>
        <HeroTeamSection />
        <TeamSection />
      </main>
    </MainLayout>
  );
}
