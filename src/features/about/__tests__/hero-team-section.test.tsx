import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { HeroTeamSection } from '../components/hero-team-section';

describe('HeroTeamSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeroTeamSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the about.hero.header i18n key', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('about.hero.header')).toBeInTheDocument();
  });

  it('renders the about.hero.title i18n key', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('about.hero.title')).toBeInTheDocument();
  });

  it('renders the about.hero.description i18n key', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('about.hero.description')).toBeInTheDocument();
  });

  it('renders the about.hero.mission.title i18n key', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('about.hero.mission.title')).toBeInTheDocument();
  });

  it('renders the about.hero.mission.description i18n key', () => {
    render(<HeroTeamSection />);
    expect(
      screen.getByText('about.hero.mission.description'),
    ).toBeInTheDocument();
  });

  it('renders the about.hero.vision.title i18n key', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('about.hero.vision.title')).toBeInTheDocument();
  });

  it('renders the about.hero.vision.description i18n key', () => {
    render(<HeroTeamSection />);
    expect(
      screen.getByText('about.hero.vision.description'),
    ).toBeInTheDocument();
  });

  it('renders the hero section element', () => {
    render(<HeroTeamSection />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});
