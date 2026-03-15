import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useContact } from '../hooks/use-contact';

// IMPORTANT: vi.mock factory must NOT reference variables declared outside
// because vi.mock is hoisted. Use inline vi.fn() instead.
vi.mock('@/core/api/client', () => ({
  apiClient: { post: vi.fn() },
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

import { apiClient } from '@/core/api/client';
import { toast } from 'sonner';

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

const payload = {
  name: 'Ahmed',
  email: 'ahmed@test.com',
  subject: 'Test',
  message: 'Hello world test message',
};

describe('useContact hook', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns mutate, isPending, isSuccess', () => {
    const { result } = renderHook(() => useContact(), { wrapper });
    expect(typeof result.current.mutate).toBe('function');
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('calls toast.success on API success', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useContact(), { wrapper });
    result.current.mutate(payload);
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('form.success'));
  });

  it('calls toast.error on API failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useContact(), { wrapper });
    result.current.mutate(payload);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('form.error'));
  });

  it('isSuccess becomes true after successful mutation', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useContact(), { wrapper });
    result.current.mutate(payload);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
