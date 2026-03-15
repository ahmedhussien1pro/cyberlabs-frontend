import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCourses, coursesQueryKeys } from '../hooks/use-courses';
import { createWrapper } from '@/test/utils';

vi.mock('../services/courses.api', () => ({
  coursesApi: {
    list: vi.fn(),
  },
}));

import { coursesApi } from '../services/courses.api';

const mockList = coursesApi.list as ReturnType<typeof vi.fn>;

const fakePage = {
  data: [
    {
      id: 'c1',
      slug: 'web-security',
      title: 'Web Security',
      color: 'blue',
      sections: [],
    },
  ],
  meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
};

beforeEach(() => vi.clearAllMocks());

describe('coursesQueryKeys', () => {
  it('all returns ["courses"]', () => {
    expect(coursesQueryKeys.all).toEqual(['courses']);
  });

  it('list includes filters', () => {
    const key = coursesQueryKeys.list({ search: 'sql' });
    expect(key).toContain('list');
    expect(key[2]).toEqual({ search: 'sql' });
  });

  it('detail includes slug', () => {
    expect(coursesQueryKeys.detail('web-sec')).toContain('web-sec');
  });
});

describe('useCourses', () => {
  it('returns data on success', async () => {
    mockList.mockResolvedValueOnce(fakePage);
    const { result } = renderHook(() => useCourses(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fakePage);
  });

  it('passes filters to api', async () => {
    mockList.mockResolvedValueOnce(fakePage);
    renderHook(() => useCourses({ search: 'sql' }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(mockList).toHaveBeenCalledWith({ search: 'sql' }));
  });

  it('is in error state when api throws', async () => {
    mockList.mockRejectedValueOnce(new Error('500'));
    const { result } = renderHook(() => useCourses(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
