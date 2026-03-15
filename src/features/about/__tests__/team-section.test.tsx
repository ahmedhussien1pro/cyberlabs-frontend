import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { TeamSection } from '../components/team-section';
import { TEAM_MEMBERS } from '../constants/members';

describe('TeamSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<TeamSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders all team member cards by name key', () => {
    render(<TeamSection />);
    TEAM_MEMBERS.forEach((m) => {
      expect(screen.getAllByText(`members.${m.key}.name`).length).toBeGreaterThanOrEqual(1);
    });
  });

  it(`renders ${TEAM_MEMBERS.length} member images`, () => {
    render(<TeamSection />);
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(TEAM_MEMBERS.length);
  });

  it('renders at least one social link', () => {
    render(<TeamSection />);
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(1);
  });

  it('renders a root container element', () => {
    const { container } = render(<TeamSection />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
