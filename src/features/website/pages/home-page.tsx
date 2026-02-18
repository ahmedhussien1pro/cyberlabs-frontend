import Navbar from '@/shared/components/layout/navbar';
import Footer from '@/shared/components/layout/footer';
import {
  HeroSection,
  StatsSection,
  ServicesSection,
} from '@/features/landing/components';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <Footer />
    </div>
  );
}
