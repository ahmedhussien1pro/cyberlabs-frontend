// src/features/paths/utils/path-helpers.ts
//
// Pure helper functions for path/module logic. No React — tree-shakeable.

import { ROUTES } from '@/shared/constants';
import type { PathModule, ModuleState } from '../types';

/** Derives visual / interaction state of a single module card. */
export function getModuleState(
  mod: PathModule,
  completedIds: string[],
): ModuleState {
  if (completedIds.includes(mod.id) || mod.userProgress?.isCompleted)
    return 'done';
  if (mod.status === 'coming_soon') return 'soon';
  if (mod.isLocked) return 'locked';
  return 'active';
}

/** Resolves the navigation href for a module card. */
export function resolveModuleHref(mod: PathModule): string | undefined {
  if (!mod.slug) return undefined;
  if (mod.type === 'course') return ROUTES.COURSES.DETAIL(mod.slug);
  if (mod.type === 'lab') return ROUTES.LABS.DETAIL(mod.slug);
  return undefined;
}

/** Total estimated hours across all modules in a path. */
export function totalPathHours(modules: PathModule[]): number {
  return modules.reduce((sum, m) => sum + (m.estimatedHours ?? 0), 0);
}

/** Progress percentage (0-100) based on completed module ids. */
export function pathProgressPct(
  modules: PathModule[],
  completedIds: string[],
): number {
  if (!modules.length) return 0;
  const done = modules.filter(
    (m) => completedIds.includes(m.id) || !!m.userProgress?.isCompleted,
  ).length;
  return Math.round((done / modules.length) * 100);
}
