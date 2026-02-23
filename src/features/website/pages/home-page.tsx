import {
  HeroSection,
  StatsSection,
  FaqSection,
  ServicesSection,
  TestimonialsSection,
} from '@/features/landing/components';
import MainLayout from '@/shared/components/layout/main-layout';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <FaqSection />
      <ServicesSection />
      <TestimonialsSection />
    </MainLayout>
  );
}
