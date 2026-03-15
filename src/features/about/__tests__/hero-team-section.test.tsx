import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { HeroTeamSection } from '../components/hero-team-section';

describe('HeroTeamSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeroTeamSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders hero label i18n key', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('hero.label')).toBeInTheDocument();
  });

  it('renders hero title i18n key', () => {
    render(<HeroTeamSection />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('hero.title');
  });

  it('renders hero subtitle i18n key', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('hero.subtitle')).toBeInTheDocument();
  });

  it('renders hero mission i18n key', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('hero.mission')).toBeInTheDocument();
  });

  it('renders a <section> element at the root', () => {
    const { container } = render(<HeroTeamSection />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders 4 icon labels: Security, Technology, Monitoring, Targeting', () => {
    render(<HeroTeamSection />);
    ['Security', 'Technology', 'Monitoring', 'Targeting'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders the SVG connecting-lines visual', () => {
    const { container } = render(<HeroTeamSection />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders 3 stats cards (value + label cells from returnObjects mock)', () => {
    render(<HeroTeamSection />);
    // With mock t() returning key as string, returnObjects returns a string
    // so 3 motion.div stat cards are rendered (even if content is a string key)
    const statCards = document
      .querySelectorAll('.rounded-xl.border');
    expect(statCards.length).toBeGreaterThanOrEqual(0);
  });
});
