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
    const img = screen.getAllByRole('img')[0];
    expect(img).toHaveAttribute('src', mockMember.img);
  });

  it('renders 3 social links (Facebook, Twitter, LinkedIn)', () => {
    render(<TeamCard member={mockMember} index={0} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it('social links have target=_blank and rel=noopener noreferrer', () => {
    render(<TeamCard member={mockMember} index={0} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('Facebook link has correct href', () => {
    render(<TeamCard member={mockMember} index={0} />);
    const fbLink = screen.getByRole('link', { name: /facebook/i });
    expect(fbLink).toHaveAttribute('href', mockMember.links.fb);
  });

  it('LinkedIn link has correct href', () => {
    render(<TeamCard member={mockMember} index={0} />);
    const liLink = screen.getByRole('link', { name: /linkedin/i });
    expect(liLink).toHaveAttribute('href', mockMember.links.linkedin);
  });

  it('Twitter link has correct href', () => {
    render(<TeamCard member={mockMember} index={0} />);
    const twLink = screen.getByRole('link', { name: /twitter/i });
    expect(twLink).toHaveAttribute('href', mockMember.links.twitter);
  });

  it('shows bio overlay on hover — renders 2 images', () => {
    const { container } = render(<TeamCard member={mockMember} index={0} />);
    const card = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(card);
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBe(2);
  });

  it('hides bio overlay on mouse leave — back to 1 image', () => {
    const { container } = render(<TeamCard member={mockMember} index={0} />);
    const card = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBe(1);
  });

  it('renders different animation delay per index without crash', () => {
    const { unmount } = render(<TeamCard member={mockMember} index={3} />);
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(1);
    unmount();
  });
});
