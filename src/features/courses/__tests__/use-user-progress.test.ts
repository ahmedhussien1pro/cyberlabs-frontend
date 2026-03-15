import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useUserProgress,
  ENROLLMENTS_KEY,
  PROGRESS_KEY,
} from '../hooks/use-user-progress';
import { createWrapper } from '@/test/utils';

vi.mock('../services/courses.api', () => ({
  coursesApi: {
    getMyEnrollments: vi.fn(),
    getMyProgress: vi.fn(),
    enroll: vi.fn(),
    syncFavorite: vi.fn(),
    resetProgress: vi.fn(),
  },
}));

import { coursesApi } from '../services/courses.api';

const mockEnrollments = coursesApi.getMyEnrollments as ReturnType<typeof vi.fn>;
const mockProgress = coursesApi.getMyProgress as ReturnType<typeof vi.fn>;

const fakeEnrollments = [
  {
    id: 'e1',
    userId: 'u1',
    courseId: 'c1',
    progress: 60,
    isCompleted: false,
    enrolledAt: '2025-01-01',
    completedAt: null,
    lastAccessedAt: null,
    course: {
      id: 'c1',
      slug: 'web-sec',
      title: 'Web Security',
      ar_title: null,
      thumbnail: null,
      color: 'blue',
      difficulty: 'BEGINNER',
    },
  },
];

const fakeProgressData = {
  enrolled: ['c1'],
  completed: { c1: ['t1', 't2'] },
  favorites: ['c2'],
  enrollments: [{ courseId: 'c1', progress: 60, isCompleted: false }],
};

beforeEach(() => vi.clearAllMocks());

describe('ENROLLMENTS_KEY / PROGRESS_KEY', () => {
  it('ENROLLMENTS_KEY is correct', () => {
    expect(ENROLLMENTS_KEY).toEqual(['enrollments', 'me']);
  });
  it('PROGRESS_KEY is correct', () => {
    expect(PROGRESS_KEY).toEqual(['courses', 'me', 'progress']);
  });
});

describe('useUserProgress', () => {
  beforeEach(() => {
    mockEnrollments.mockResolvedValue(fakeEnrollments);
    mockProgress.mockResolvedValue(fakeProgressData);
  });

  it('returns isEnrolled true for enrolled course', async () => {
    const { result } = renderHook(() => useUserProgress(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isEnrolled('c1')).toBe(true);
    expect(result.current.isEnrolled('c99')).toBe(false);
  });

  it('getProgress returns correct value', async () => {
    const { result } = renderHook(() => useUserProgress(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.getProgress('c1')).toBe(60);
    expect(result.current.getProgress('c99')).toBe(0);
  });

  it('isTopicCompleted works correctly', async () => {
    const { result } = renderHook(() => useUserProgress(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isTopicCompleted('c1', 't1')).toBe(true);
    expect(result.current.isTopicCompleted('c1', 't99')).toBe(false);
  });

  it('getCompletedCount returns correct count', async () => {
    const { result } = renderHook(() => useUserProgress(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.getCompletedCount('c1')).toBe(2);
    expect(result.current.getCompletedCount('c99')).toBe(0);
  });

  it('isFavorite works correctly', async () => {
    const { result } = renderHook(() => useUserProgress(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isFavorite('c2')).toBe(true);
    expect(result.current.isFavorite('c1')).toBe(false);
  });

  it('isCourseCompleted returns true when all topics done', async () => {
    const { result } = renderHook(() => useUserProgress(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isCourseCompleted('c1', 2)).toBe(true);
    expect(result.current.isCourseCompleted('c1', 5)).toBe(false);
  });

  it('handles API error gracefully', async () => {
    mockEnrollments.mockRejectedValueOnce(new Error('401'));
    mockProgress.mockRejectedValueOnce(new Error('401'));
    const { result } = renderHook(() => useUserProgress(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
