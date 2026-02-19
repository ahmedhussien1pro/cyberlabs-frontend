import Navbar from '@/shared/components/layout/navbar';
import Footer from '@/shared/components/layout/footer';
import {
  HeroSection,
  StatsSection,
  FaqSection,
  ServicesSection,
  TestimonialsSection,
} from '@/features/landing/components';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FaqSection />
      <ServicesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
