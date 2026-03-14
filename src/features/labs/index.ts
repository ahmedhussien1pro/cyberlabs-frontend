// src/features/labs/index.ts
// Public API — import labs feature entities from here.

export type {
  Lab,
  LabDifficulty,
  LabHint,
  LabUserProgress,
  LabCategory,
  LabsResponse,
} from './types';

export { useLabs } from './hooks';
export { LabCard, LabCardSkeleton } from './components';
export { default as LabListPage } from './pages/labs-list-page';
export { default as LabDetailsPage } from './pages/lab-detail-page';
