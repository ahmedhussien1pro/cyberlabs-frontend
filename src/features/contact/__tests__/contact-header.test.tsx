import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ContactHeader } from '../components/contact-header';

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

describe('ContactHeader', () => {
  it('renders without crashing', () => {
    const { container } = render(<ContactHeader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders header label from i18n', () => {
    render(<ContactHeader />);
    expect(screen.getByText('header.label')).toBeInTheDocument();
  });

  it('renders header title from i18n', () => {
    render(<ContactHeader />);
    expect(screen.getByText('header.title')).toBeInTheDocument();
  });

  it('renders header subtitle from i18n', () => {
    render(<ContactHeader />);
    expect(screen.getByText('header.subtitle')).toBeInTheDocument();
  });
});
