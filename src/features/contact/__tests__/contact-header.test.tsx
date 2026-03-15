import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ContactHeader } from '../components/contact-header';

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));

// contact-header uses t('label'), t('title'), t('subtitle') — no namespace prefix
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

describe('ContactHeader', () => {
  it('renders without crashing', () => {
    const { container } = render(<ContactHeader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders label text from i18n', () => {
    render(<ContactHeader />);
    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('renders title heading from i18n', () => {
    render(<ContactHeader />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('title');
  });

  it('renders subtitle paragraph from i18n', () => {
    render(<ContactHeader />);
    expect(screen.getByText('subtitle')).toBeInTheDocument();
  });

  it('renders a decorative span line element', () => {
    const { container } = render(<ContactHeader />);
    expect(container.querySelector('span.h-px')).toBeInTheDocument();
  });
});
