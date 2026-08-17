/**
 * Tests for the badge / achievement system.
 *
 * Covers:
 * - BADGES constant invariants (10 badges, unique IDs, all 4 categories)
 * - localStorage persistence (load/save/roundtrip)
 * - evaluation logic for each category
 * - idempotency (re-evaluating doesn't double-award)
 * - getBadgeProgress fractional returns
 * - i18n name resolution with fallback
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';

if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.setItem !== 'function') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  } as Storage;
}

import {
  BADGES,
  getBadgeState,
  getUnlockedBadges,
  getRecentlyEarnedBadges,
  getBadgeById,
  getBadgeProgress,
  getBadgeDisplayName,
  getMilestoneCount,
  getPerfectCount,
  getStreakCount,
  getTotalBadgeCount,
  evaluateBadges,
  _resetBadgeState,
  type BadgeEvalContext,
} from '../../src/data/badges.js';

function emptyContext(): BadgeEvalContext {
  return {
    stagesCleared: 0,
    perfectClears: 0,
    totalAccuracy: 0,
    currentStreak: 0,
    languagesPlayed: 0,
    hasTriedAllLanguages: false,
  };
}

describe('BADGES constant', () => {
  it('defines 10 badges', () => {
    expect(BADGES).toHaveLength(10);
  });

  it('all badge IDs are unique', () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers all 3 categories', () => {
    const categories = new Set(BADGES.map((b) => b.category));
    expect(categories.has('milestone')).toBe(true);
    expect(categories.has('perfect')).toBe(true);
    expect(categories.has('streak')).toBe(true);
  });

  it('every badge has a non-empty name + icon + description', () => {
    for (const b of BADGES) {
      expect(b.name.length).toBeGreaterThan(0);
      expect(b.icon.length).toBeGreaterThan(0);
      expect(b.description.length).toBeGreaterThan(0);
    }
  });

  it('every badge has a translation for en, ko, ja, es', () => {
    for (const b of BADGES) {
      expect(b.nameLocalised.en).toBeTruthy();
      expect(b.nameLocalised.ko).toBeTruthy();
      expect(b.nameLocalised.ja).toBeTruthy();
      expect(b.nameLocalised.es).toBeTruthy();
    }
  });
});

describe('category counts', () => {
  it('milestone count (including first_run, polyglot, stages_*)', () => {
    expect(getMilestoneCount()).toBe(5);
  });

  it('perfect count (perfect_score, perfect_5)', () => {
    expect(getPerfectCount()).toBe(2);
  });

  it('streak count (3, 7, 30 day)', () => {
    expect(getStreakCount()).toBe(3);
  });

  it('total = 10', () => {
    expect(getTotalBadgeCount()).toBe(10);
  });
});

describe('localStorage persistence', () => {
  beforeEach(() => {
    _resetBadgeState();
  });

  it('starts empty', () => {
    const state = getBadgeState();
    expect(state.unlocked).toEqual({});
    expect(state.recentlyEarned).toEqual([]);
  });

  it('evaluateBadges persists unlocked badges', () => {
    const ctx: BadgeEvalContext = { ...emptyContext(), stagesCleared: 1 };
    const newly = evaluateBadges(ctx);
    expect(newly.map((b) => b.id)).toContain('first_run');
    const state = getBadgeState();
    expect('first_run' in state.unlocked).toBe(true);
  });
});

describe('evaluateBadges — milestone category', () => {
  beforeEach(() => {
    _resetBadgeState();
  });

  it('first_run unlocks at stagesCleared >= 1', () => {
    const result = evaluateBadges({ ...emptyContext(), stagesCleared: 1 });
    expect(result.map((b) => b.id)).toContain('first_run');
  });

  it('stages_10 unlocks at stagesCleared >= 10', () => {
    const result = evaluateBadges({ ...emptyContext(), stagesCleared: 10 });
    expect(result.map((b) => b.id)).toContain('stages_10');
  });

  it('stages_50 unlocks at stagesCleared >= 50', () => {
    const result = evaluateBadges({ ...emptyContext(), stagesCleared: 50 });
    expect(result.map((b) => b.id)).toContain('stages_50');
  });

  it('stages_100 unlocks at stagesCleared >= 100', () => {
    const result = evaluateBadges({ ...emptyContext(), stagesCleared: 100 });
    expect(result.map((b) => b.id)).toContain('stages_100');
  });

  it('polyglot unlocks when hasTriedAllLanguages is true', () => {
    const result = evaluateBadges({ ...emptyContext(), hasTriedAllLanguages: true });
    expect(result.map((b) => b.id)).toContain('polyglot');
  });

  it('first_run does NOT unlock at stagesCleared = 0', () => {
    const result = evaluateBadges(emptyContext());
    expect(result.map((b) => b.id)).not.toContain('first_run');
  });

  it('multiple milestones unlock in one call', () => {
    const result = evaluateBadges({ ...emptyContext(), stagesCleared: 50, hasTriedAllLanguages: true });
    expect(result.map((b) => b.id).sort()).toEqual(['first_run', 'polyglot', 'stages_10', 'stages_50']);
  });
});

describe('evaluateBadges — perfect category', () => {
  beforeEach(() => {
    _resetBadgeState();
  });

  it('perfect_score unlocks at perfectClears >= 1', () => {
    const result = evaluateBadges({ ...emptyContext(), perfectClears: 1 });
    expect(result.map((b) => b.id)).toContain('perfect_score');
  });

  it('perfect_5 unlocks at perfectClears >= 5', () => {
    const result = evaluateBadges({ ...emptyContext(), perfectClears: 5 });
    expect(result.map((b) => b.id)).toContain('perfect_5');
  });

  it('perfect_5 does NOT unlock at perfectClears = 4', () => {
    const result = evaluateBadges({ ...emptyContext(), perfectClears: 4 });
    expect(result.map((b) => b.id)).not.toContain('perfect_5');
  });
});

describe('evaluateBadges — streak category', () => {
  beforeEach(() => {
    _resetBadgeState();
  });

  it('streak_3 unlocks at currentStreak >= 3', () => {
    expect(evaluateBadges({ ...emptyContext(), currentStreak: 3 }).map((b) => b.id)).toContain('streak_3');
  });

  it('streak_7 unlocks at currentStreak >= 7', () => {
    expect(evaluateBadges({ ...emptyContext(), currentStreak: 7 }).map((b) => b.id)).toContain('streak_7');
  });

  it('streak_30 unlocks at currentStreak >= 30', () => {
    expect(evaluateBadges({ ...emptyContext(), currentStreak: 30 }).map((b) => b.id)).toContain('streak_30');
  });

  it('all 3 streak badges unlock at streak = 30', () => {
    const result = evaluateBadges({ ...emptyContext(), currentStreak: 30 });
    expect(result.map((b) => b.id).sort()).toEqual(['streak_3', 'streak_30', 'streak_7']);
  });
});

describe('idempotency', () => {
  beforeEach(() => {
    _resetBadgeState();
  });

  it('re-evaluating with same context awards 0 new badges', () => {
    const ctx: BadgeEvalContext = { ...emptyContext(), stagesCleared: 5 };
    const first = evaluateBadges(ctx);
    expect(first.length).toBeGreaterThan(0);
    const second = evaluateBadges(ctx);
    expect(second).toEqual([]);
  });

  it('newlyEarned list keeps newest first, capped at 5', () => {
    for (const n of [1, 5, 10, 50, 100, 200]) {
      evaluateBadges({ ...emptyContext(), stagesCleared: n });
    }
    const recent = getRecentlyEarnedBadges();
    expect(recent.length).toBeLessThanOrEqual(5);
    expect(recent[0].id).toBe('stages_100');
  });

  it('getUnlockedBadges returns all unique unlocked badges', () => {
    evaluateBadges({ ...emptyContext(), stagesCleared: 100 });
    expect(getUnlockedBadges()).toHaveLength(4);
  });
});

describe('getBadgeProgress', () => {
  it('first_run: stagesCleared 0 → 0, 1 → 1', () => {
    const badge = BADGES.find((b) => b.id === 'first_run')!;
    expect(getBadgeProgress(badge, { ...emptyContext(), stagesCleared: 0 })).toBe(0);
    expect(getBadgeProgress(badge, { ...emptyContext(), stagesCleared: 1 })).toBe(1);
  });

  it('stages_50: caps at threshold', () => {
    const badge = BADGES.find((b) => b.id === 'stages_50')!;
    expect(getBadgeProgress(badge, { ...emptyContext(), stagesCleared: 100 })).toBe(50);
  });

  it('streak_30: caps at currentStreak', () => {
    const badge = BADGES.find((b) => b.id === 'streak_30')!;
    expect(getBadgeProgress(badge, { ...emptyContext(), currentStreak: 50 })).toBe(30);
    expect(getBadgeProgress(badge, { ...emptyContext(), currentStreak: 10 })).toBe(10);
  });

  it('perfect_5: caps at perfectClears', () => {
    const badge = BADGES.find((b) => b.id === 'perfect_5')!;
    expect(getBadgeProgress(badge, { ...emptyContext(), perfectClears: 7 })).toBe(5);
  });

  it('polyglot: 1 if hasTriedAllLanguages, 0 otherwise', () => {
    const badge = BADGES.find((b) => b.id === 'polyglot')!;
    expect(getBadgeProgress(badge, { ...emptyContext(), hasTriedAllLanguages: true })).toBe(1);
    expect(getBadgeProgress(badge, { ...emptyContext(), hasTriedAllLanguages: false })).toBe(0);
  });
});

describe('getBadgeDisplayName', () => {
  it('returns localised name for known language', () => {
    const badge = BADGES.find((b) => b.id === 'first_run')!;
    expect(getBadgeDisplayName(badge, 'ko')).toBe('첫 실행');
    expect(getBadgeDisplayName(badge, 'ja')).toBe('初めてのラン');
    expect(getBadgeDisplayName(badge, 'es')).toBe('Primera Carrera');
  });

  it('falls back to English for unknown language', () => {
    const badge = BADGES.find((b) => b.id === 'first_run')!;
    expect(getBadgeDisplayName(badge, 'fr')).toBe('First Run');
    expect(getBadgeDisplayName(badge, 'xx')).toBe('First Run');
  });
});

describe('getBadgeById', () => {
  it('returns the badge for a known id', () => {
    const badge = getBadgeById('first_run');
    expect(badge?.id).toBe('first_run');
    expect(badge?.name).toBe('First Run');
  });

  it('returns undefined for unknown id', () => {
    expect(getBadgeById('__nonexistent__')).toBeUndefined();
  });
});
