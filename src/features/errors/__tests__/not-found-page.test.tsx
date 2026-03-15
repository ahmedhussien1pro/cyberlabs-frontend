import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import NotFoundPage from '../pages/not-found-page';

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));
vi.mock('@/shared/constants', () => ({
  ROUTES: { HOME: '/' },
}));

describe('NotFoundPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<NotFoundPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders 404 glitch text', () => {
    render(<NotFoundPage />);
    // GlitchText renders 3 spans with "404"
    const matches = screen.getAllByText('404');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders SYSTEM :: PAGE_NOT_FOUND badge', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('SYSTEM :: PAGE_NOT_FOUND')).toBeInTheDocument();
  });

  it('renders notFoundDesc i18n key', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('notFoundDesc')).toBeInTheDocument();
  });

  it('renders Go Home button linking to /', () => {
    render(<NotFoundPage />);
    const homeLink = screen.getByRole('link', { name: /notFoundBack/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders Go Back button', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('goBack')).toBeInTheDocument();
  });

  it('Go Back button calls window.history.back()', () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    render(<NotFoundPage />);
    fireEvent.click(screen.getByText('goBack'));
    expect(backSpy).toHaveBeenCalledTimes(1);
    backSpy.mockRestore();
  });

  it('renders terminal block (cyberlabs — bash header)', () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/cyberlabs — bash/i)).toBeInTheDocument();
  });
});
