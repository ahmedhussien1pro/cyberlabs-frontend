import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// ─── QueryClient factory ───────────────────────────────────────────────────
export function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

// ─── createWrapper ─────────────────────────────────────────────────────────
/**
 * Returns a stable React wrapper component that provides:
 *   - A fresh QueryClient (one per createWrapper() call, NOT per render)
 *   - MemoryRouter
 *
 * Use with renderHook: `renderHook(() => useMyHook(), { wrapper: createWrapper() })`
 */
export function createWrapper(initialEntries: string[] = ['/']) {
  const qc = makeTestQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };
}

// ─── AllProviders (used by customRender) ──────────────────────────────────
interface WrapperProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

function AllProviders({ children, initialEntries = ['/'] }: WrapperProps) {
  const qc = makeTestQueryClient();
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

// ─── customRender ─────────────────────────────────────────────────────────
/**
 * Drop-in replacement for @testing-library/react `render`.
 * Wraps the component with QueryClient + MemoryRouter.
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] },
) {
  const { initialEntries, ...rest } = options ?? {};
  return render(ui, {
    wrapper: (props) => (
      <AllProviders {...props} initialEntries={initialEntries} />
    ),
    ...rest,
  });
}

export * from '@testing-library/react';
export { customRender as render };
