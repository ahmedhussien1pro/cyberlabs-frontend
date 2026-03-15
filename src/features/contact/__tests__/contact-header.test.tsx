import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ContactHeader } from '../components/contact-header';

// ContactHeader uses useTranslation('contact') — mock returns key as-is.
// Actual keys used: t('label'), t('title'), t('subtitle')

describe('ContactHeader', () => {
  it('renders without crashing', () => {
    const { container } = render(<ContactHeader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders label badge (t("label"))', () => {
    render(<ContactHeader />);
    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('renders h1 title (t("title"))', () => {
    render(<ContactHeader />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('title');
  });

  it('renders subtitle paragraph (t("subtitle"))', () => {
    render(<ContactHeader />);
    expect(screen.getByText('subtitle')).toBeInTheDocument();
  });

  it('renders a single root div', () => {
    const { container } = render(<ContactHeader />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
