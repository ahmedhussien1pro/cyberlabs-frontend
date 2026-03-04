// src/features/courses/hooks/use-course.ts
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../services/courses.api';
import type { CurriculumData } from '../services/courses.api';
import type { Course, CourseSection } from '../types/course.types';

export const courseQueryKeys = {
  detail: (slug: string) => ['courses', 'detail', slug] as const,
  curriculum: (slug: string) => ['courses', 'curriculum', slug] as const,
  sections: (slug: string) => ['courses', 'sections', slug] as const,
};

export function useCourse(slug: string) {
  return useQuery<Course | null>({
    queryKey: courseQueryKeys.detail(slug),
    queryFn: () => coursesApi.get(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

// ✅ Fix: CurriculumData (topics-based JSON) — ليس CourseSection[]
export function useCourseCurriculum(slug: string) {
  return useQuery<CurriculumData>({
    queryKey: courseQueryKeys.curriculum(slug),
    queryFn: () => coursesApi.getCurriculum(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCourseSections(slug: string) {
  return useQuery<CourseSection[]>({
    queryKey: courseQueryKeys.sections(slug),
    queryFn: () => coursesApi.getSections(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}
