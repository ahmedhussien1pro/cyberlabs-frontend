import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { HeroSection } from '../components/hero-section';

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));
vi.mock('../components/particles-background', () => ({
  ParticlesBackground: () => <div data-testid='particles' />,
}));
vi.mock('../styles/landing.css', () => ({}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));
vi.mock('@/shared/constants', () => ({
  ROUTES: { HOME: '/' },
  landingImage: '/landing.png',
}));
vi.mock('@/shared/constants/constants', () => ({
  landingImage: '/landing.png',
}));

describe('HeroSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeroSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders h3 header text key', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('hero.header');
  });

  it('renders h1 headline text key', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('hero.headline');
  });

  it('renders description paragraph', () => {
    render(<HeroSection />);
    expect(screen.getByText('hero.description')).toBeInTheDocument();
  });

  it('renders CTA button link', () => {
    render(<HeroSection />);
    expect(screen.getByText('hero.cta')).toBeInTheDocument();
  });

  it('renders Watch Demo button', () => {
    render(<HeroSection />);
    expect(screen.getByText('hero.demo')).toBeInTheDocument();
  });

  it('renders the hero image', () => {
    render(<HeroSection />);
    expect(screen.getByAltText('Cybersecurity Banner')).toBeInTheDocument();
  });

  it('renders particles background', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('particles')).toBeInTheDocument();
  });
});
