import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeCourse } from '../services/courses.api';

// ─── normalizeCourse unit tests ───────────────────────────────────────────
describe('normalizeCourse', () => {
  it('normalises color to lowercase', () => {
    const result = normalizeCourse({ id: '1', color: 'BLUE', sections: [] });
    expect(result.color).toBe('blue');
  });

  it('defaults sections to [] when missing', () => {
    const result = normalizeCourse({ id: '1', color: 'blue' });
    expect(result.sections).toEqual([]);
  });

  it('normalises section lessons to [] when not array', () => {
    const result = normalizeCourse({
      id: '1',
      color: 'blue',
      sections: [{ id: 's1', lessons: null }],
    });
    expect(result.sections[0].lessons).toEqual([]);
  });

  it('preserves valid lessons array', () => {
    const lesson = { id: 'l1', title: 'Intro' };
    const result = normalizeCourse({
      id: '1',
      color: 'blue',
      sections: [{ id: 's1', lessons: [lesson] }],
    });
    expect(result.sections[0].lessons).toHaveLength(1);
  });

  it('throws on null input', () => {
    expect(() => normalizeCourse(null)).toThrow();
  });

  it('throws on non-object input', () => {
    expect(() => normalizeCourse('bad')).toThrow();
  });
});
