export type LabDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface LabHint {
  id: string;
  order: number;
  xpCost: number;
}

export interface LabUserProgress {
  progress: number;
  attempts: number;
  hintsUsed: number;
  flagSubmitted: boolean;
  completedAt: string | null;
  startedAt: string;
  lastAccess: string;
}

export interface Lab {
  id: string;
  scenario: string;
  slug?: string;
  title: string;
  ar_title: string;
  description: string;
  ar_description: string;
  difficulty: LabDifficulty;
  category: string;
  executionMode: 'SHARED_BACKEND' | 'DOCKER' | 'VM';
  duration: number;
  xpReward: number;
  pointsReward: number;
  skills: string[];
  isPublished: boolean;
  hints: LabHint[];
  _count: { submissions: number; usersProgress: number };
  usersProgress?: LabUserProgress[];
}

export interface LabCategory {
  id: string;
  name: string;
  ar_name: string;
  labs: Lab[];
}

export interface LabsResponse {
  success: boolean;
  totalLabs: number;
  categories: LabCategory[];
}
