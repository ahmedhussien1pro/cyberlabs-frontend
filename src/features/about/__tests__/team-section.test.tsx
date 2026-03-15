import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import TeamSection from '../components/team-section';
import { TEAM_MEMBERS } from '../constants/members';

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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('TeamSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<TeamSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it(`renders ${TEAM_MEMBERS.length} team member cards`, () => {
    render(<TeamSection />);
    // Each TeamCard renders at least one img
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBeGreaterThanOrEqual(TEAM_MEMBERS.length);
  });

  it('renders section heading from i18n', () => {
    render(<TeamSection />);
    expect(screen.getByText('team.title')).toBeInTheDocument();
  });
});
