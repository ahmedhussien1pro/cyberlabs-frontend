import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  enrolledCourses: string[];
  completedTopics: Record<string, string[]>; // courseId → topicId[]
  favoriteCourses: string[];

  // Enrollment
  enrollCourse: (courseId: string) => void;
  unenrollCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;

  // Progress
  markTopicComplete: (courseId: string, topicId: string) => void;
  isTopicCompleted: (courseId: string, topicId: string) => boolean;
  getProgress: (courseId: string, total: number) => number;
  getCompletedCount: (courseId: string) => number;
  isCourseCompleted: (courseId: string, total: number) => boolean;
  resetProgress: (courseId: string) => void;

  // Favorites
  toggleFavorite: (courseId: string) => void;
  isFavorite: (courseId: string) => boolean;
}

export const useCourseProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      enrolledCourses: [],
      completedTopics: {},
      favoriteCourses: [],

      // ── Enrollment ──────────────────────────────────────
      enrollCourse: (courseId) =>
        set((s) => ({
          enrolledCourses: s.enrolledCourses.includes(courseId)
            ? s.enrolledCourses
            : [...s.enrolledCourses, courseId],
          completedTopics: s.completedTopics[courseId]
            ? s.completedTopics
            : { ...s.completedTopics, [courseId]: [] },
        })),

      unenrollCourse: (courseId) =>
        set((s) => ({
          enrolledCourses: s.enrolledCourses.filter((id) => id !== courseId),
        })),

      isEnrolled: (courseId) => get().enrolledCourses.includes(courseId),

      // ── Progress ────────────────────────────────────────
      markTopicComplete: (courseId, topicId) =>
        set((s) => {
          const prev = s.completedTopics[courseId] ?? [];
          if (prev.includes(topicId)) return s;
          return {
            completedTopics: {
              ...s.completedTopics,
              [courseId]: [...prev, topicId],
            },
          };
        }),

      isTopicCompleted: (courseId, topicId) =>
        (get().completedTopics[courseId] ?? []).includes(topicId),

      getProgress: (courseId, total) => {
        if (!total) return 0;
        const done = get().completedTopics[courseId]?.length ?? 0;
        return Math.round((done / total) * 100);
      },

      getCompletedCount: (courseId) =>
        get().completedTopics[courseId]?.length ?? 0,

      isCourseCompleted: (courseId, total) =>
        total > 0 && (get().completedTopics[courseId]?.length ?? 0) >= total,

      resetProgress: (courseId) =>
        set((s) => ({
          completedTopics: { ...s.completedTopics, [courseId]: [] },
        })),

      // ── Favorites ───────────────────────────────────────
      toggleFavorite: (courseId) =>
        set((s) => ({
          favoriteCourses: s.favoriteCourses.includes(courseId)
            ? s.favoriteCourses.filter((id) => id !== courseId)
            : [...s.favoriteCourses, courseId],
        })),

      isFavorite: (courseId) => get().favoriteCourses.includes(courseId),
    }),
    { name: 'cyb-course-progress-v1' },
  ),
);
