import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ContactHeader } from '../components/contact-header';

describe('ContactHeader', () => {
  it('renders without crashing', () => {
    const { container } = render(<ContactHeader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders header title i18n key', () => {
    render(<ContactHeader />);
    expect(screen.getByText('header.title')).toBeInTheDocument();
  });

  it('renders header subtitle i18n key', () => {
    render(<ContactHeader />);
    expect(screen.getByText('header.subtitle')).toBeInTheDocument();
  });

  it('renders email info key', () => {
    render(<ContactHeader />);
    expect(screen.getByText('info.email')).toBeInTheDocument();
  });

  it('renders location info key', () => {
    render(<ContactHeader />);
    expect(screen.getByText('info.location')).toBeInTheDocument();
  });
});
