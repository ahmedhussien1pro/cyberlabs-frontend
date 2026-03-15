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

  // Suppress ZodError unhandled rejections from @hookform/resolvers
  // These are expected when testing form validation (empty submit).
  // react-hook-form catches them internally — the unhandled rejection
  // is a false positive from the promise chain in happy-dom.
  if (typeof process !== 'undefined') {
    process.on('unhandledRejection', (reason) => {
      if (
        reason != null &&
        typeof reason === 'object' &&
        '_zod' in reason
      ) {
        // swallow ZodError unhandled rejections silently
        return;
      }
      // re-throw everything else
      throw reason;
    });
  }
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
