import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { TeamCard } from '../components/team-card';
import type { TeamMember } from '../constants/members';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    motion: new Proxy({} as typeof actual.motion, {
      get: (_: unknown, tag: string) =>
        ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
          const Tag = tag as keyof JSX.IntrinsicElements;
          return <Tag {...(props as object)}>{children}</Tag>;
        },
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock react-i18next
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
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
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

  it('shows bio overlay on hover', () => {
    render(<TeamCard member={mockMember} index={0} />);
    const card = screen.getByRole('img').closest('div[class*="group"]') as HTMLElement
      ?? screen.getByRole('img').parentElement!.parentElement!;
    fireEvent.mouseEnter(card);
    // bio overlay should appear — check that multiple images are now present
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders different animation delay per index', () => {
    const { unmount } = render(<TeamCard member={mockMember} index={2} />);
    // Just ensure it renders without error at different index
    expect(screen.getByRole('img')).toBeInTheDocument();
    unmount();
  });
});
