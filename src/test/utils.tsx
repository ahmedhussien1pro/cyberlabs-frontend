import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

/** Creates a fresh QueryClient for each test (no retries, no staleTime) */
function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

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

/** Custom render that wraps with QueryClient + Router */
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
