import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    pool: 'forks',
    forks: {
      singleFork: false,
      execArgv: ['--max-old-space-size=1024'],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/main.tsx',
        'src/App.tsx',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
});
