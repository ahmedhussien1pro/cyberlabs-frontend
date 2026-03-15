import { describe, it, expect } from 'vitest';
import { TEAM_MEMBERS } from '../constants/members';

describe('TEAM_MEMBERS constant', () => {
  it('should have 4 members', () => {
    expect(TEAM_MEMBERS).toHaveLength(4);
  });

  it('every member has a key', () => {
    TEAM_MEMBERS.forEach((m) => {
      expect(m.key).toBeTruthy();
      expect(typeof m.key).toBe('string');
    });
  });

  it('every member has an img', () => {
    TEAM_MEMBERS.forEach((m) => {
      expect(m.img).toBeTruthy();
    });
  });

  it('every member has fb, twitter, linkedin links', () => {
    TEAM_MEMBERS.forEach((m) => {
      expect(m.links.fb).toBeTruthy();
      expect(m.links.twitter).toBeTruthy();
      expect(m.links.linkedin).toBeTruthy();
    });
  });

  it('all link values are valid URLs', () => {
    TEAM_MEMBERS.forEach((m) => {
      Object.values(m.links).forEach((url) => {
        expect(() => new URL(url)).not.toThrow();
      });
    });
  });

  it('member keys are unique', () => {
    const keys = TEAM_MEMBERS.map((m) => m.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('contains expected member keys', () => {
    const keys = TEAM_MEMBERS.map((m) => m.key);
    expect(keys).toContain('ahmed');
    expect(keys).toContain('emad');
    expect(keys).toContain('nasar');
    expect(keys).toContain('laila');
  });
});
