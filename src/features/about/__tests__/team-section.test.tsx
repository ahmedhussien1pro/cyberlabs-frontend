import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { TeamSection } from '../components/team-section';
import { TEAM_MEMBERS } from '../data/members';

describe('TeamSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<TeamSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders team.subtitle divider text', () => {
    render(<TeamSection />);
    expect(screen.getByText('team.subtitle')).toBeInTheDocument();
  });

  it(`renders ${TEAM_MEMBERS.length} team member cards`, () => {
    render(<TeamSection />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(TEAM_MEMBERS.length);
  });

  it('renders 4 team member cards', () => {
    render(<TeamSection />);
    const memberNames = TEAM_MEMBERS.map((m) => screen.getByText(m.nameKey));
    memberNames.forEach((el) => expect(el).toBeInTheDocument());
  });

  it('renders team section heading', () => {
    render(<TeamSection />);
    expect(screen.getByText('team.title')).toBeInTheDocument();
  });
});
