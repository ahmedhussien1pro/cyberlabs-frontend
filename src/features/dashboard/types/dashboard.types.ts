export interface WeeklyProgressPoint {
  day: string;
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
