// src/features/paths/index.ts
// Public API of the paths feature — import from here outside this feature.

export type {
  LearningPath,
  PathModule,
  PathFilters,
  PathDifficulty,
  PathColor,
  ModuleType,
  ModuleStatus,
  ModuleState,
} from './types';

export { usePaths, usePath, pathsQueryKeys } from './hooks';
export { fetchPaths, fetchPathBySlug } from './api';
export { PathCard, PathCardSkeleton, PathDetailHero, PathRoadmap } from './components';
export { default as PathsPage } from './pages/paths-page';
export { default as PathDetailPage } from './pages/path-detail-page';
