/**
 * wordMastery Tests
 *
 * Verifies the localStorage-based per-word learning metrics tracker.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';

// jsdom + Node 25 may provide a non-functional localStorage shim.
// Install a working polyfill before tests run.
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
  recordAttempt,
  recordComplete,
  recordCorrect,
  recordMistake,
  getWordStats,
  getWeakWords,
  getStrongWords,
  getOverallMastery,
  getAttemptedWordCount,
  trackSessionMistake,
  getSessionWeakWords,
  clearSessionMistakes,
  resetMastery,
} from '../../src/data/wordMastery.js';

const STORAGE_KEY = 'lingotype-word-mastery';

describe('wordMastery — basic operations', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearSessionMistakes();
  });

  it('records an attempt', () => {
    recordAttempt('hello');
    const stats = getWordStats('hello');
    expect(stats).not.toBeNull();
    expect(stats?.attemptCount).toBe(1);
    expect(stats?.lastSeen).toBeGreaterThan(0);
  });

  it('records multiple attempts', () => {
    recordAttempt('hello');
    recordAttempt('hello');
    recordAttempt('hello');
    const stats = getWordStats('hello');
    expect(stats?.attemptCount).toBe(3);
  });

  it('records a correct typing', () => {
    recordAttempt('hello');
    recordCorrect('hello');
    const stats = getWordStats('hello');
    expect(stats?.correctCount).toBe(1);
    expect(stats?.mistakeCount).toBe(0);
  });

  it('records a mistake', () => {
    recordAttempt('hello');
    recordMistake('hello');
    const stats = getWordStats('hello');
    expect(stats?.mistakeCount).toBe(1);
    expect(stats?.lastMistake).toBeGreaterThan(0);
  });

  it('returns null for words never seen', () => {
    expect(getWordStats('never-seen')).toBeNull();
  });

  it('persists across calls via localStorage', () => {
    recordAttempt('hello');
    recordMistake('hello');
    recordCorrect('hello');
    const stats = getWordStats('hello');
    expect(stats?.attemptCount).toBe(1);
    expect(stats?.correctCount).toBe(1);
    expect(stats?.mistakeCount).toBe(1);
  });
});

describe('wordMastery — weak words ranking', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearSessionMistakes();
  });

  it('returns words sorted by mistake count', () => {
    recordAttempt('a');
    recordAttempt('b');
    recordAttempt('c');
    recordMistake('a');
    recordMistake('b');
    recordMistake('b');
    recordMistake('c');
    recordMistake('c');
    recordMistake('c');

    const weak = getWeakWords(5);
    expect(weak).toHaveLength(3);
    expect(weak[0].wordId).toBe('c'); // 3 mistakes
    expect(weak[1].wordId).toBe('b'); // 2 mistakes
    expect(weak[2].wordId).toBe('a'); // 1 mistake
  });

  it('excludes words with 0 mistakes', () => {
    recordAttempt('good');
    recordCorrect('good');
    const weak = getWeakWords(5);
    expect(weak).toHaveLength(0);
  });

  it('limits results', () => {
    for (let i = 0; i < 10; i++) {
      recordAttempt(`w${i}`);
      recordMistake(`w${i}`);
    }
    const weak = getWeakWords(3);
    expect(weak).toHaveLength(3);
  });
});

describe('wordMastery — strong words', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearSessionMistakes();
  });

  it('returns words sorted by correct count', () => {
    recordAttempt('a');
    recordAttempt('b');
    recordCorrect('a');
    recordCorrect('b');
    recordCorrect('b');

    const strong = getStrongWords(5);
    expect(strong[0].wordId).toBe('b'); // 2 correct
    expect(strong[1].wordId).toBe('a'); // 1 correct
  });

  it('excludes words with 0 correct', () => {
    recordAttempt('failed');
    recordMistake('failed');
    const strong = getStrongWords(5);
    expect(strong).toHaveLength(0);
  });
});

describe('wordMastery — overall mastery', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearSessionMistakes();
  });

  it('returns 0 with no attempts', () => {
    expect(getOverallMastery()).toBe(0);
  });

  it('returns 100% with all completed', () => {
    recordAttempt('a');
    recordComplete('a');
    recordCorrect('a');
    recordAttempt('b');
    recordComplete('b');
    recordCorrect('b');
    expect(getOverallMastery()).toBe(100);
  });

  it('returns 50% with half completed', () => {
    recordAttempt('a');
    recordComplete('a');
    recordCorrect('a');
    recordAttempt('b');
    // 'b' is attempted but never completed
    recordMistake('b');
    expect(getOverallMastery()).toBe(50);
  });

  it('aggregates across many words', () => {
    // 8 completed out of 10 attempts = 80%
    for (let i = 0; i < 10; i++) {
      recordAttempt(`w${i}`);
      if (i < 8) {
        recordComplete(`w${i}`);
        recordCorrect(`w${i}`);
      } else {
        recordMistake(`w${i}`);
      }
    }
    expect(getOverallMastery()).toBe(80);
  });
});

describe('wordMastery — session tracking', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearSessionMistakes();
  });

  it('tracks session mistakes separately from lifetime', () => {
    recordAttempt('a');
    recordMistake('a');
    recordMistake('a');
    recordMistake('a');

    trackSessionMistake('a');
    trackSessionMistake('a');
    const session = getSessionWeakWords();
    expect(session).toEqual(['a']);
  });

  it('clears session mistakes', () => {
    recordAttempt('a');
    recordMistake('a');
    trackSessionMistake('a');
    expect(getSessionWeakWords()).toHaveLength(1);

    clearSessionMistakes();
    expect(getSessionWeakWords()).toHaveLength(0);
  });
});

describe('wordMastery — getAttemptedWordCount', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearSessionMistakes();
  });

  it('returns 0 with no attempts', () => {
    expect(getAttemptedWordCount()).toBe(0);
  });

  it('counts unique words', () => {
    recordAttempt('a');
    recordAttempt('a');
    recordAttempt('a');
    recordAttempt('b');
    expect(getAttemptedWordCount()).toBe(2);
  });
});

describe('wordMastery — reset', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearSessionMistakes();
  });

  it('resets all data', () => {
    recordAttempt('a');
    recordCorrect('a');
    trackSessionMistake('a');
    resetMastery();
    expect(getWordStats('a')).toBeNull();
    expect(getSessionWeakWords()).toHaveLength(0);
    expect(getAttemptedWordCount()).toBe(0);
  });
});
