/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ─── Suppress noisy console output ────────────────────────────────────────
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes('Warning:') ||
      msg.includes('act(') ||
      msg.includes('Not implemented')
    )
      return;
    originalError(...args);
  };
  console.warn = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (msg.includes('ZodError') || msg.includes('unhandledRejection')) return;
    originalWarn(...args);
  };

  // Suppress ZodError unhandled rejections from @hookform/resolvers (false positive)
  const handler = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    if (reason != null && typeof reason === 'object' && '_zod' in reason) {
      event.preventDefault();
    }
  };
  window.addEventListener('unhandledrejection', handler);
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// ─── Global mocks ──────────────────────────────────────────────────────────
// react-i18next: globally mocked so individual test files don't need to repeat it
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

// framer-motion: globally mocked to avoid animation overhead in tests
vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'));
