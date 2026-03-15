import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ServicesSection } from '../components/services-section';

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));
vi.mock('@/shared/constants', () => ({
  ROUTES: { HOME: '/' },
}));
vi.mock('@/shared/components/common', () => ({
  SectionHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  ),
}));

describe('ServicesSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<ServicesSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders section title and subtitle via SectionHeader', () => {
    render(<ServicesSection />);
    expect(screen.getByText('services.title')).toBeInTheDocument();
    expect(screen.getByText('services.subtitle')).toBeInTheDocument();
  });

  it('renders 6 service cards', () => {
    render(<ServicesSection />);
    // 6 readMore links — one per service card
    expect(screen.getAllByText('services.readMore')).toHaveLength(6);
  });

  it('renders service keys: paths, labs, threat, hacking, cert, projects', () => {
    render(<ServicesSection />);
    const keys = ['paths', 'labs', 'threat', 'hacking', 'cert', 'projects'];
    keys.forEach((key) => {
      expect(screen.getByText(`services.items.${key}.title`)).toBeInTheDocument();
    });
  });

  it('each service card has a link with href="/"', () => {
    render(<ServicesSection />);
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
