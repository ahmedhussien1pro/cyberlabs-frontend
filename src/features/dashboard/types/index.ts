// src/features/dashboard/types/index.ts

// ==================== User Stats ====================
export interface UserStats {
  coursesCompleted: number;
  coursesInProgress: number;
  totalCourses: number;
  achievements: number;
  certificates: number;
  streak: number;
  totalXp: number;
  rank: number;
  studyTime: number; // in minutes
}

// ==================== Course/Lab ====================
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  instructor: string;
  enrolledAt: string;
  lastAccessed?: string;
  estimatedTime: number; // in hours
}

export interface Lab {
  id: string;
  courseId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'completed' | 'locked';
  progress: number;
  timeLimit?: number; // in minutes
  startedAt?: string;
  completedAt?: string;
}

// ==================== Progress & Activity ====================
export interface ProgressData {
  date: string;
  xp: number;
  lessonsCompleted: number;
  timeSpent: number; // in minutes
}

export interface ActivityItem {
  id: string;
  type: 'course_completed' | 'lesson_completed' | 'achievement' | 'certificate';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

// ==================== Achievements & Badges ====================
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// ==================== Leaderboard ====================
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  xp: number;
  coursesCompleted: number;
  streak: number;
  isCurrentUser?: boolean;
}

// ==================== Goals ====================
export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: 'courses' | 'lessons' | 'hours' | 'xp';
  deadline?: string;
  createdAt: string;
}

// ==================== Deadlines ====================
export interface Deadline {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  dueDate: string;
  status: 'pending' | 'submitted' | 'overdue';
}

// ==================== Heatmap ====================
export interface HeatmapData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no activity, 4 = max activity
}

// ==================== API Response Types ====================
export interface DashboardStatsResponse {
  stats: UserStats;
  recentActivity: ActivityItem[];
}

export interface EnrolledCoursesResponse {
  courses: Course[];
  totalCount: number;
}

export interface ActiveLabsResponse {
  labs: Lab[];
  totalCount: number;
}

export interface ProgressResponse {
  weekly: ProgressData[];
  monthly: ProgressData[];
  yearly: ProgressData[];
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  currentUserRank: number;
  totalUsers: number;
}

export interface AchievementsResponse {
  achievements: Achievement[];
  totalCount: number;
  unlockedCount: number;
}

export interface HeatmapResponse {
  data: HeatmapData[];
  currentStreak: number;
  longestStreak: number;
}

export interface GoalsResponse {
  goals: LearningGoal[];
}

// ==================== Store Types ====================
export interface DashboardStore {
  // State
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  activeView: 'grid' | 'list';

  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActiveView: (view: 'grid' | 'list') => void;
}

// ==================== Component Props ====================
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export interface ProgressChartProps {
  data: ProgressData[];
  period: 'weekly' | 'monthly' | 'yearly';
}

export interface CourseCardProps {
  course: Course;
  onContinue?: (courseId: string) => void;
}

export interface LabCardProps {
  lab: Lab;
  onStart?: (labId: string) => void;
}
