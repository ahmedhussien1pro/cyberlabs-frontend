// src/features/paths/utils/path-mapper.ts
//
// Normalises raw backend responses into typed LearningPath objects.
// Kept separate so it can be unit-tested in isolation.

import type { LearningPath, PathModule, ModuleType, ModuleStatus } from '../types';

const TYPE_MAP: Record<string, ModuleType> = {
  COURSE: 'course',
  LAB: 'lab',
  QUIZ: 'quiz',
  PROJECT: 'project',
};

const STATUS_MAP: Record<string, ModuleStatus> = {
  PUBLISHED: 'published',
  COMING_SOON: 'coming_soon',
  DRAFT: 'draft',
};

export function normalizeModule(mod: Record<string, unknown>): PathModule {
  return {
    id: (mod.id as string) ?? (mod._id as string) ?? '',
    order: (mod.order as number) ?? 0,
    title:
      (mod.title as string) ??
      ((mod.course as Record<string, unknown>)?.title as string) ??
      ((mod.lab as Record<string, unknown>)?.title as string) ??
      '',
    ar_title:
      (mod.ar_title as string) ??
      ((mod.course as Record<string, unknown>)?.ar_title as string) ??
      ((mod.lab as Record<string, unknown>)?.ar_title as string) ??
      '',
    description:
      (mod.description as string) ??
      ((mod.course as Record<string, unknown>)?.description as string) ??
      '',
    ar_description:
      (mod.ar_description as string) ??
      ((mod.course as Record<string, unknown>)?.ar_description as string) ??
      '',
    type: TYPE_MAP[(mod.type as string) ?? ''] ?? 'course',
    status: STATUS_MAP[(mod.status as string) ?? ''] ?? 'published',
    estimatedHours: (mod.estimatedHours as number) ?? 0,
    isLocked: (mod.isLocked as boolean) ?? false,
    slug:
      ((mod.course as Record<string, unknown>)?.slug as string) ??
      ((mod.lab as Record<string, unknown>)?.slug as string) ??
      undefined,
    course: mod.course
      ? {
          ...(mod.course as object),
          id:
            ((mod.course as Record<string, unknown>).id as string) ??
            ((mod.course as Record<string, unknown>)._id as string) ??
            '',
        }
      : undefined,
    lab: mod.lab
      ? {
          ...(mod.lab as object),
          id:
            ((mod.lab as Record<string, unknown>).id as string) ??
            ((mod.lab as Record<string, unknown>)._id as string) ??
            '',
        }
      : undefined,
    userProgress: (mod.userProgress as PathModule['userProgress']) ?? undefined,
  };
}

export function mapBackendPath(path: Record<string, unknown>): LearningPath {
  return {
    ...(path as Partial<LearningPath>),
    id: (path.id as string) ?? '',
    slug: (path.slug as string) ?? '',
    title: (path.title as string) ?? '',
    ar_title: (path.ar_title as string) ?? '',
    description: (path.description as string) ?? '',
    ar_description: (path.ar_description as string) ?? '',
    longDescription: (path.longDescription as string) ?? '',
    ar_longDescription: (path.ar_longDescription as string) ?? '',
    iconName: (path.iconName as string) ?? 'shield',
    color: ((path.color as string | undefined)?.toLowerCase() ?? 'blue') as LearningPath['color'],
    difficulty: path.difficulty
      ? (((path.difficulty as string).charAt(0).toUpperCase() +
          (path.difficulty as string).slice(1).toLowerCase()) as LearningPath['difficulty'])
      : 'Beginner',
    order: (path.order as number) ?? 0,
    totalModules: (path.totalModules as number) ?? 0,
    totalCourses: (path.totalCourses as number) ?? 0,
    totalLabs: (path.totalLabs as number) ?? 0,
    estimatedHours: (path.estimatedHours as number) ?? 0,
    tags: Array.isArray(path.tags) ? (path.tags as string[]) : [],
    ar_tags: Array.isArray(path.ar_tags) ? (path.ar_tags as string[]) : [],
    prerequisites: Array.isArray(path.prerequisites) ? (path.prerequisites as string[]) : [],
    ar_prerequisites: Array.isArray(path.ar_prerequisites) ? (path.ar_prerequisites as string[]) : [],
    skills: Array.isArray(path.skills) ? (path.skills as string[]) : [],
    ar_skills: Array.isArray(path.ar_skills) ? (path.ar_skills as string[]) : [],
    modules: Array.isArray(path.modules)
      ? (path.modules as Record<string, unknown>[]).map(normalizeModule)
      : [],
  } as LearningPath;
}
