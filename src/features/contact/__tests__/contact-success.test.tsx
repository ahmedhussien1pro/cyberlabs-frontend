import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { ContactSuccess } from '../components/contact-success';

describe('ContactSuccess', () => {
  it('renders without crashing', () => {
    const { container } = render(<ContactSuccess onReset={vi.fn()} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders success.title i18n key', () => {
    render(<ContactSuccess onReset={vi.fn()} />);
    expect(screen.getByText('success.title')).toBeInTheDocument();
  });

  it('renders success.description i18n key', () => {
    render(<ContactSuccess onReset={vi.fn()} />);
    expect(screen.getByText('success.description')).toBeInTheDocument();
  });

  it('renders success.sendAnother i18n key button', () => {
    render(<ContactSuccess onReset={vi.fn()} />);
    expect(screen.getByText('success.sendAnother')).toBeInTheDocument();
  });

  it('calls onReset when button is clicked', () => {
    const onReset = vi.fn();
    render(<ContactSuccess onReset={onReset} />);
    fireEvent.click(screen.getByText('success.sendAnother'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('renders a checkmark or success icon', () => {
    const { container } = render(<ContactSuccess onReset={vi.fn()} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
