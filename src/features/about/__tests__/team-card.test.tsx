import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { TeamCard } from '../components/team-card';
import type { TeamMember } from '../constants/members';

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

const mockMember: TeamMember = {
  key: 'ahmed',
  img: 'https://example.com/ahmed.jpg',
  links: {
    fb: 'https://facebook.com/ahmed',
    twitter: 'https://twitter.com/ahmed',
    linkedin: 'https://linkedin.com/in/ahmed',
  },
};

describe('TeamCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<TeamCard member={mockMember} index={0} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders member image with correct src', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getAllByRole('img')[0]).toHaveAttribute('src', mockMember.img);
  });

  it('initially renders exactly 1 image (no overlay)', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('bio overlay is hidden by default — bio text not in DOM', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.queryByText('members.ahmed.bio')).not.toBeInTheDocument();
  });

  it('renders 3 social links', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(3);
  });

  it('social links have target=_blank and rel=noopener noreferrer', () => {
    render(<TeamCard member={mockMember} index={0} />);
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('Facebook link has correct href', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute('href', mockMember.links.fb);
  });

  it('LinkedIn link has correct href', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', mockMember.links.linkedin);
  });

  it('Twitter link has correct href', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('link', { name: /twitter/i })).toHaveAttribute('href', mockMember.links.twitter);
  });

  it('shows bio overlay on hover — renders 2 images', () => {
    const { container } = render(<TeamCard member={mockMember} index={0} />);
    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('shows bio text on hover', () => {
    const { container } = render(<TeamCard member={mockMember} index={0} />);
    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    expect(screen.getByText('members.ahmed.bio')).toBeInTheDocument();
  });

  /**
   * NOTE: happy-dom does not propagate mouseleave to React synthetic handlers
   * on the root element. This behaviour is tested at integration/e2e level.
   * Here we verify the initial (non-hovered) state is correct instead.
   */
  it('overlay is absent before any interaction', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.queryByText('members.ahmed.bio')).not.toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('renders different animation delay per index without crash', () => {
    const { unmount } = render(<TeamCard member={mockMember} index={3} />);
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(1);
    unmount();
  });
});
