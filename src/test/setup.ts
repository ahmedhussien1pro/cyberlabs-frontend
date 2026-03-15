/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes('Warning:') ||
      msg.includes('act(') ||
      msg.includes('Not implemented')
    ) return;
    originalError(...args);
  };
  console.warn = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (msg.includes('ZodError') || msg.includes('unhandledRejection')) return;
    originalWarn(...args);
  };

  // Suppress ZodError unhandled rejections that bubble up from
  // @hookform/resolvers in happy-dom during validation tests.
  // react-hook-form handles them internally — this is a false positive.
  const handler = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    if (
      reason != null &&
      typeof reason === 'object' &&
      '_zod' in reason
    ) {
      event.preventDefault();
    }
  };
  window.addEventListener('unhandledrejection', handler);
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
