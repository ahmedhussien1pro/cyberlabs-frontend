// src/features/courses/hooks/use-curriculum.ts
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../services/courses.api';
import type { CurriculumData } from '../services/courses.api';

export function useCurriculum(slug: string) {
  return useQuery<CurriculumData>({
    queryKey: ['curriculum', slug],
    queryFn: () => coursesApi.getCurriculum(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}
