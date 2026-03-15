import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEnrollment } from '../hooks/use-enrollment';
import { createWrapper } from '@/test/utils';

vi.mock('../services/courses.api', () => ({
  coursesApi: {
    enroll: vi.fn(),
    getMyEnrollments: vi.fn().mockResolvedValue([]),
    getMyProgress: vi.fn().mockResolvedValue({ enrolled: [], completed: {}, favorites: [], enrollments: [] }),
    resetProgress: vi.fn(),
    syncFavorite: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/features/paths/hooks/use-paths', () => ({
  pathsQueryKeys: { all: ['paths'] },
}));

import { coursesApi } from '../services/courses.api';
import { toast } from 'sonner';

const mockEnroll = coursesApi.enroll as ReturnType<typeof vi.fn>;
const mockToastSuccess = toast.success as ReturnType<typeof vi.fn>;
const mockToastError = toast.error as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

describe('useEnrollment', () => {
  it('calls enroll API and shows success toast', async () => {
    mockEnroll.mockResolvedValueOnce({ success: true, enrolledAt: '2025-01-01' });
    const { result } = renderHook(() => useEnrollment(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.mutate('c1'));
    await waitFor(() => expect(mockEnroll).toHaveBeenCalledWith('c1'));
    await waitFor(() => expect(mockToastSuccess).toHaveBeenCalledWith(
      'Enrolled! Start learning now.',
      { duration: 2000 },
    ));
  });

  it('shows error toast on failure', async () => {
    mockEnroll.mockRejectedValueOnce(new Error('403'));
    const { result } = renderHook(() => useEnrollment(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.mutate('c1'));
    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith(
      'Enrollment failed. Please try again.',
    ));
  });

  it('exposes isPending state', () => {
    const { result } = renderHook(() => useEnrollment(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(false);
  });
});
