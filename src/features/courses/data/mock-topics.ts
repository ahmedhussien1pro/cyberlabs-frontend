import type { Topic } from '@/core/types/curriculumCourses.types';

import sqlInjectionRaw from './json/sql-injection.json';

// ── Type guard ────────────────────────────────────────────────────────
interface CourseJson {
  courseId: string;
  topics: Topic[];
}

function isCourseJson(v: unknown): v is CourseJson {
  return (
    typeof v === 'object' &&
    v !== null &&
    'topics' in v &&
    Array.isArray((v as CourseJson).topics)
  );
}

// ── Registry: slug → raw JSON ─────────────────────────────────────────
const JSON_REGISTRY: Record<string, unknown> = {
  'sql-injection': sqlInjectionRaw,
  // Add more as JSON files become available:
  // 'ethical-hacking-101': ethicalHackingRaw,
  // 'web-application-security': webAppSecRaw,
};

// ── Public API ────────────────────────────────────────────────────────

export function getTopicsByCourse(slug: string): Topic[] {
  const raw = JSON_REGISTRY[slug];
  if (!raw) return [];
  if (isCourseJson(raw)) return raw.topics;
  return [];
}

/** Returns a single topic by ID */
export function getTopicById(slug: string, topicId: string): Topic | null {
  return getTopicsByCourse(slug).find((t) => t.id === topicId) ?? null;
}

export function getFirstTopicId(slug: string): string | null {
  return getTopicsByCourse(slug)[0]?.id ?? null;
}

export function getAvailableSlugs(): string[] {
  return Object.keys(JSON_REGISTRY);
}
