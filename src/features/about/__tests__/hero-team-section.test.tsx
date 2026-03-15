import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { HeroTeamSection } from '../components/hero-team-section';

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
    t: (key: string, opts?: { returnObjects?: boolean }) => {
      if (opts?.returnObjects) {
        // return a fake stat object for stats array
        if (key.includes('members')) return { value: '10+', label: 'Members' };
        if (key.includes('labs'))    return { value: '50+', label: 'Labs' };
        if (key.includes('users'))   return { value: '1k+', label: 'Users' };
      }
      return key;
    },
    i18n: { language: 'en' },
  }),
}));

describe('HeroTeamSection', () => {
  it('renders without crashing', () => {
    render(<HeroTeamSection />);
    expect(screen.getByRole('region') ?? document.querySelector('section')).toBeTruthy();
  });

  it('renders the hero label from i18n', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('hero.label')).toBeInTheDocument();
  });

  it('renders the hero title from i18n', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('hero.title')).toBeInTheDocument();
  });

  it('renders 3 stat cards', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('1k+')).toBeInTheDocument();
  });

  it('renders 4 icon boxes (Security, Technology, Monitoring, Targeting)', () => {
    render(<HeroTeamSection />);
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Targeting')).toBeInTheDocument();
  });

  it('renders connecting SVG lines', () => {
    const { container } = render(<HeroTeamSection />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    const lines = svg?.querySelectorAll('line');
    expect(lines?.length).toBe(2);
  });
});
