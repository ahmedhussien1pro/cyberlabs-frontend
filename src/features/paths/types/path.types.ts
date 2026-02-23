import type { Course } from '@/features/courses/types/course.types';

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  ar_title: string;
  description: string;
  ar_description: string;
  iconUrl?: string;
  color?: string;
  order: number;
  totalCourses: number;
  totalLabs: number;
  estimatedHours: number;
  courses: Course[];
  enrolled?: boolean;
  progress?: number;
}
