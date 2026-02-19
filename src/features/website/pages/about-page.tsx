import Navbar from '@/shared/components/layout/navbar';
import Footer from '@/shared/components/layout/footer';
import { HeroTeamSection } from '@/features/about/components/hero-team-section';
import { TeamSection } from '@/features/about/components/team-section';

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <main>
        <HeroTeamSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
