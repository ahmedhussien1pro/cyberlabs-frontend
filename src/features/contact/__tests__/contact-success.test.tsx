import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { ContactSuccess } from '../components/contact-success';

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

describe('ContactSuccess', () => {
  it('renders without crashing', () => {
    const { container } = render(<ContactSuccess onReset={() => {}} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders success title from i18n', () => {
    render(<ContactSuccess onReset={() => {}} />);
    expect(screen.getByText('success.title')).toBeInTheDocument();
  });

  it('renders success message from i18n', () => {
    render(<ContactSuccess onReset={() => {}} />);
    expect(screen.getByText('success.message')).toBeInTheDocument();
  });

  it('renders a reset button', () => {
    render(<ContactSuccess onReset={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onReset when button is clicked', () => {
    const onReset = vi.fn();
    render(<ContactSuccess onReset={onReset} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
