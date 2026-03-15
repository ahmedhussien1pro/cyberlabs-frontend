import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { StatsSection } from '../components/stats-section';

vi.mock('@/shared/components/common', () => ({
  SectionHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  ),
}));
vi.mock('../hooks/use-count-up', () => ({
  useCountUp: ({ end }: { end: number }) => ({
    count: end,
    isVisible: true,
    elementRef: { current: null },
  }),
}));

describe('StatsSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<StatsSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders section title and subtitle', () => {
    render(<StatsSection />);
    expect(screen.getByText('stats.title')).toBeInTheDocument();
    expect(screen.getByText('stats.subtitle')).toBeInTheDocument();
  });

  it('renders all 4 stat labels', () => {
    render(<StatsSection />);
    ['stats.students', 'stats.courses', 'stats.events', 'stats.trainers'].forEach(
      (key) => expect(screen.getByText(key)).toBeInTheDocument(),
    );
  });

  it('renders correct stat values', () => {
    render(<StatsSection />);
    expect(screen.getByText('1,232')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
  });

  it('renders updated-at note', () => {
    render(<StatsSection />);
    expect(screen.getByText(/stats.updated/)).toBeInTheDocument();
  });
});
