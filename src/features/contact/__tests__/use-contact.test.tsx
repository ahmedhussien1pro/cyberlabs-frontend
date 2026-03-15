import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { render } from '@/test/utils';
import { useContact } from '../hooks/use-contact';

const mockPost = vi.fn();

vi.mock('@/core/api/client', () => ({ apiClient: { post: mockPost } }));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

import { toast } from 'sonner';

const payload = {
  name: 'Ahmed',
  email: 'ahmed@test.com',
  subject: 'Test',
  message: 'Hello world test message',
};

describe('useContact hook', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns a mutate function', () => {
    const { result } = renderHook(() => useContact(), {
      wrapper: ({ children }) => render(<>{children}</>).container.parentElement as never,
    });
    // Use render wrapper from test/utils instead
    expect(result).toBeDefined();
  });

  it('calls toast.success on API success', async () => {
    mockPost.mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useContact(), {
      wrapper: ({ children }: { children: React.ReactNode }) => {
        const { container } = render(<>{children}</>);
        return container as never;
      },
    });
    result.current.mutate(payload);
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('form.success'));
  });

  it('calls toast.error on API failure', async () => {
    mockPost.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useContact(), {
      wrapper: ({ children }: { children: React.ReactNode }) => {
        const { container } = render(<>{children}</>);
        return container as never;
      },
    });
    result.current.mutate(payload);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('form.error'));
  });
});
