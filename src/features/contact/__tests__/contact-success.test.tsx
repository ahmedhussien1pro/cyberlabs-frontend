import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { ContactSuccess } from '../components/contact-success';

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));

// contact-success uses t('form.success'), t('form.successDesc'), t('form.submit')
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

describe('ContactSuccess', () => {
  it('renders without crashing', () => {
    const { container } = render(<ContactSuccess onReset={() => {}} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders success title (form.success key)', () => {
    render(<ContactSuccess onReset={() => {}} />);
    expect(screen.getByText('form.success')).toBeInTheDocument();
  });

  it('renders success description (form.successDesc key)', () => {
    render(<ContactSuccess onReset={() => {}} />);
    expect(screen.getByText('form.successDesc')).toBeInTheDocument();
  });

  it('renders a reset/submit button', () => {
    render(<ContactSuccess onReset={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onReset when button is clicked', () => {
    const onReset = vi.fn();
    render(<ContactSuccess onReset={onReset} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('renders check icon (svg)', () => {
    const { container } = render(<ContactSuccess onReset={() => {}} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
