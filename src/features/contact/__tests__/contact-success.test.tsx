import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { ContactSuccess } from '../components/contact-success';

// ContactSuccess uses useTranslation('contact').
// Actual keys: t('form.success'), t('form.successDesc'), t('form.submit')

describe('ContactSuccess', () => {
  it('renders without crashing', () => {
    const { container } = render(<ContactSuccess onReset={vi.fn()} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders success title (t("form.success"))', () => {
    render(<ContactSuccess onReset={vi.fn()} />);
    expect(screen.getByText('form.success')).toBeInTheDocument();
  });

  it('renders success description (t("form.successDesc"))', () => {
    render(<ContactSuccess onReset={vi.fn()} />);
    expect(screen.getByText('form.successDesc')).toBeInTheDocument();
  });

  it('renders reset button (t("form.submit"))', () => {
    render(<ContactSuccess onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'form.submit' })).toBeInTheDocument();
  });

  it('calls onReset when button is clicked', () => {
    const onReset = vi.fn();
    render(<ContactSuccess onReset={onReset} />);
    fireEvent.click(screen.getByRole('button', { name: 'form.submit' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('renders a success icon (svg)', () => {
    const { container } = render(<ContactSuccess onReset={vi.fn()} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
