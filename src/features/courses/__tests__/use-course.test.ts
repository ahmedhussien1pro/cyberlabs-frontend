import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCourse, useCourseCurriculum, courseQueryKeys } from '../hooks/use-course';
import { createWrapper } from '@/test/utils';

vi.mock('../services/courses.api', () => ({
  coursesApi: {
    get: vi.fn(),
    getCurriculum: vi.fn(),
    getSections: vi.fn(),
  },
}));

import { coursesApi } from '../services/courses.api';

const mockGet = coursesApi.get as ReturnType<typeof vi.fn>;
const mockGetCurriculum = coursesApi.getCurriculum as ReturnType<typeof vi.fn>;

const fakeCourse = {
  id: 'c1',
  slug: 'web-sec',
  title: 'Web Security',
  color: 'blue',
  sections: [],
};

const fakeCurriculum = {
  topics: [{ id: 't1', title: { en: 'Intro', ar: 'مقدمة' }, elements: [] }],
  totalTopics: 1,
  landingData: null,
};

beforeEach(() => vi.clearAllMocks());

describe('courseQueryKeys', () => {
  it('detail key contains slug', () => {
    expect(courseQueryKeys.detail('web-sec')).toContain('web-sec');
  });
  it('curriculum key contains slug', () => {
    expect(courseQueryKeys.curriculum('web-sec')).toContain('web-sec');
  });
});

describe('useCourse', () => {
  it('fetches course by slug', async () => {
    mockGet.mockResolvedValueOnce(fakeCourse);
    const { result } = renderHook(() => useCourse('web-sec'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fakeCourse);
    expect(mockGet).toHaveBeenCalledWith('web-sec');
  });

  it('is disabled when slug is empty', () => {
    const { result } = renderHook(() => useCourse(''), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('sets error on failure', async () => {
    mockGet.mockRejectedValueOnce(new Error('404'));
    const { result } = renderHook(() => useCourse('missing'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useCourseCurriculum', () => {
  it('fetches curriculum topics', async () => {
    mockGetCurriculum.mockResolvedValueOnce(fakeCurriculum);
    const { result } = renderHook(() => useCourseCurriculum('web-sec'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.topics).toHaveLength(1);
    expect(result.current.data?.totalTopics).toBe(1);
  });

  it('is disabled when slug is empty', () => {
    const { result } = renderHook(() => useCourseCurriculum(''), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
  });
});
