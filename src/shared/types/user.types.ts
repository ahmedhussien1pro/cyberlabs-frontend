export interface UserStats {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  // XP & Points
  totalPoints: number;
  totalXP: number;
  level: number;
  // Learning
  enrolledCourses: number;
  completedCourses: number;
  completedLabs: number;
  badgesCount: number;
  certificationsCount: number;
  // Activity
  totalHours: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
}

export interface UserPoints {
  totalXP: number;
  totalPoints: number;
  level: number;
  pointsToNextLevel: number;
  xpForNextLevel: number;
}

export interface UserActivity {
  date: string;
  activeMinutes: number;
  completedTasks: number;
  labsSolved: number;
}

export interface CompletedLab {
  id: string;
  attempts: number;
  hintsUsed: number;
  startedAt: string;
  completedAt: string;
  lab: {
    id: string;
    title: string;
    ar_title?: string;
    difficulty: string;
    pointsReward: number;
    xpReward: number;
  };
}

export interface EnrolledCourse {
  id: string;
  progress: number;
  isCompleted: boolean;
  enrolledAt: string;
  lastAccessedAt?: string;
  course: {
    id: string;
    title: string;
    ar_title?: string;
    thumbnail?: string;
    difficulty: string;
    duration?: number;
  };
}
