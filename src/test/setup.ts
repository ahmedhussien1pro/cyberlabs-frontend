/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

const originalError = console.error;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') ||
        args[0].includes('act(') ||
        args[0].includes('Not implemented'))
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
