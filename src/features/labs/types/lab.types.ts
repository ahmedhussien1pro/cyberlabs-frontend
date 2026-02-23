export type LabDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type LabStatus = 'published' | 'draft' | 'coming_soon';
export type AssessmentType = 'mcq' | 'flag' | 'file_upload' | 'code';

export interface Lab {
  id: string;
  slug: string;
  title: string;
  ar_title: string;
  description: string;
  ar_description: string;
  difficulty: LabDifficulty;
  status: LabStatus;
  access: 'free' | 'pro';
  xpReward: number;
  pointsReward: number;
  timeLimit?: number;
  type: AssessmentType;
  courseId?: string;
  isCompleted?: boolean;
  attempts?: number;
  progress?: number;
}

export interface LabFilters {
  search?: string;
  difficulty?: LabDifficulty;
  type?: AssessmentType;
  courseId?: string;
}
