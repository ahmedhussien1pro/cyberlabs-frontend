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

  /**
   * happy-dom does not fire mouseleave reliably on root elements.
   * We test the inverse: after mouseEnter bio text appears,
   * and we verify setHovered(false) path by directly checking
   * that the overlay is controlled by the `hovered` state —
   * tested via the onMouseLeave handler being wired to the root div.
   */
  it('overlay disappears on mouse leave — bio text gone', () => {
    const { container } = render(<TeamCard member={mockMember} index={0} />);
    const card = container.firstChild as HTMLElement;
    // enter
    fireEvent.mouseEnter(card);
    expect(screen.getByText('members.ahmed.bio')).toBeInTheDocument();
    // leave — trigger via the actual onMouseLeave on the element
    fireEvent(card, new MouseEvent('mouseleave', { bubbles: true, cancelable: true }));
    expect(screen.queryByText('members.ahmed.bio')).not.toBeInTheDocument();
  });

  it('renders different animation delay per index without crash', () => {
    const { unmount } = render(<TeamCard member={mockMember} index={3} />);
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(1);
    unmount();
  });
});
