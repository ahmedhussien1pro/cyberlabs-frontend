import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { TeamSection } from '../components/team-section';
import { TEAM_MEMBERS } from '../constants/members';

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));

// Mock SectionHeader — it’s a shared component, not under test here
vi.mock('@/shared/components/common', () => ({
  SectionHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('TeamSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<TeamSection />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it(`renders ${TEAM_MEMBERS.length} team member cards`, () => {
    render(<TeamSection />);
    // each TeamCard renders at least 1 img
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBeGreaterThanOrEqual(TEAM_MEMBERS.length);
  });

  it('renders section heading via SectionHeader', () => {
    render(<TeamSection />);
    expect(screen.getByText('team.label')).toBeInTheDocument();
  });

  it('renders section subtitle via SectionHeader', () => {
    render(<TeamSection />);
    expect(screen.getByText('team.title')).toBeInTheDocument();
  });

  it('renders team.subtitle divider text', () => {
    render(<TeamSection />);
    expect(screen.getByText('team.subtitle')).toBeInTheDocument();
  });
});
