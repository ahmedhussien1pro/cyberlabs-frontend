import { describe, it, expect } from 'vitest';
import {
  BADGE_REGISTRY,
  TIER_DESIGNS,
  UNKNOWN_BADGE_CONFIG,
  ALL_BADGE_SLUGS,
  getBadgeConfig,
} from '../constants/badge-registry';

describe('TIER_DESIGNS', () => {
  const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'] as const;

  it('contains all 5 tiers', () => {
    tiers.forEach((t) => expect(TIER_DESIGNS[t]).toBeDefined());
  });

  it('each tier has required fields: bg, ring, iconColor, glowColor, label_en, label_ar', () => {
    tiers.forEach((t) => {
      const d = TIER_DESIGNS[t];
      expect(d.bg).toBeTruthy();
      expect(d.ring).toBeTruthy();
      expect(d.iconColor).toBeTruthy();
      expect(d.glowColor).toBeTruthy();
      expect(d.label_en).toBeTruthy();
      expect(d.label_ar).toBeTruthy();
    });
  });
});

describe('BADGE_REGISTRY', () => {
  it('contains at least 50 badges', () => {
    expect(Object.keys(BADGE_REGISTRY).length).toBeGreaterThanOrEqual(50);
  });

  it('every badge has icon, tier, category, label_en, label_ar, desc_en, desc_ar', () => {
    Object.entries(BADGE_REGISTRY).forEach(([slug, badge]) => {
      expect(badge!.icon, `${slug} missing icon`).toBeDefined();
      expect(badge!.tier, `${slug} missing tier`).toBeTruthy();
      expect(badge!.category, `${slug} missing category`).toBeTruthy();
      expect(badge!.label_en, `${slug} missing label_en`).toBeTruthy();
      expect(badge!.label_ar, `${slug} missing label_ar`).toBeTruthy();
      expect(badge!.desc_en, `${slug} missing desc_en`).toBeTruthy();
      expect(badge!.desc_ar, `${slug} missing desc_ar`).toBeTruthy();
    });
  });

  it('every badge tier is one of the 5 valid tiers', () => {
    const valid = new Set(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND']);
    Object.entries(BADGE_REGISTRY).forEach(([slug, badge]) => {
      expect(valid.has(badge!.tier), `${slug} has invalid tier: ${badge!.tier}`).toBe(true);
    });
  });

  it('FIRST_COURSE badge is BRONZE / learning', () => {
    const b = BADGE_REGISTRY['FIRST_COURSE']!;
    expect(b.tier).toBe('BRONZE');
    expect(b.category).toBe('learning');
    expect(b.label_en).toBe('First Step');
  });

  it('LAB_100 badge is DIAMOND / labs', () => {
    const b = BADGE_REGISTRY['LAB_100']!;
    expect(b.tier).toBe('DIAMOND');
    expect(b.category).toBe('labs');
  });

  it('STREAK_100 badge is DIAMOND / streak', () => {
    const b = BADGE_REGISTRY['STREAK_100']!;
    expect(b.tier).toBe('DIAMOND');
    expect(b.category).toBe('streak');
  });

  it('XP_50000 badge is DIAMOND / xp', () => {
    expect(BADGE_REGISTRY['XP_50000']!.tier).toBe('DIAMOND');
  });

  it('covers all 7 expected categories', () => {
    const categories = new Set(
      Object.values(BADGE_REGISTRY).map((b) => b!.category),
    );
    ['learning', 'labs', 'paths', 'streak', 'xp', 'leaderboard', 'special'].forEach(
      (cat) => expect(categories.has(cat), `missing category: ${cat}`).toBe(true),
    );
  });
});

describe('ALL_BADGE_SLUGS', () => {
  it('is an array of all registry keys', () => {
    expect(ALL_BADGE_SLUGS).toEqual(Object.keys(BADGE_REGISTRY));
  });

  it('has length >= 50', () => {
    expect(ALL_BADGE_SLUGS.length).toBeGreaterThanOrEqual(50);
  });
});

describe('getBadgeConfig', () => {
  it('returns correct config for a known slug', () => {
    const config = getBadgeConfig('FIRST_COURSE');
    expect(config.label_en).toBe('First Step');
    expect(config.tier).toBe('BRONZE');
  });

  it('returns UNKNOWN_BADGE_CONFIG for an unknown slug', () => {
    const config = getBadgeConfig('NONEXISTENT_BADGE_XYZ');
    expect(config).toEqual(UNKNOWN_BADGE_CONFIG);
  });

  it('UNKNOWN_BADGE_CONFIG has all required fields', () => {
    expect(UNKNOWN_BADGE_CONFIG.icon).toBeDefined();
    expect(UNKNOWN_BADGE_CONFIG.tier).toBeTruthy();
    expect(UNKNOWN_BADGE_CONFIG.label_en).toBeTruthy();
    expect(UNKNOWN_BADGE_CONFIG.label_ar).toBeTruthy();
  });

  it('returns HACK_KING config correctly', () => {
    const config = getBadgeConfig('HACK_KING');
    expect(config.tier).toBe('DIAMOND');
    expect(config.category).toBe('labs');
  });
});
