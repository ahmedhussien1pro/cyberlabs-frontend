export interface WeeklyProgressPoint {
  day: string;
  labs: number;
  xp: number;
}

export interface MonthlyProgressPoint {
  month: string;
  labs: number;
  xp: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatarUrl?: string;
  totalXP: number;
  level: number;
  isCurrentUser?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'labs' | 'courses' | 'xp' | 'streak' | 'custom';
  dueDate?: string;
  isCompleted: boolean;
}
export type GoalCategory = Goal['category'];

export interface UserLab {
  id: string;
  title: string;
  ar_title?: string;
  description: string;
  ar_description?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  xpReward: number;
  category: string;
  thumbnail?: string;
  status: 'not_started' | 'active' | 'completed';
  progress?: number;
  completedAt?: string;
  startedAt?: string;
}
export type LabStatus = UserLab['status'];
