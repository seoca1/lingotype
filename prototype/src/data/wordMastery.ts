/**
 * Word Mastery Tracker
 *
 * Tracks per-word learning metrics in localStorage:
 * - attemptCount: total times this word has appeared
 * - correctCount: times typed correctly on first try
 * - mistakeCount: times made a mistake
 * - lastSeen: timestamp of last appearance
 * - lastMistake: timestamp of last mistake
 *
 * Used for:
 * - Weak Words (Result screen highlight)
 * - Mastery Bar (overall learning progress)
 */

const STORAGE_KEY = 'lingotype-word-mastery';

export interface WordStats {
  attemptCount: number;
  correctCount: number;
  completeCount: number;
  mistakeCount: number;
  lastSeen: number; // timestamp ms
  lastMistake: number; // timestamp ms, 0 if none
}

type MasteryStore = Record<string, WordStats>;

function loadStore(): MasteryStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as MasteryStore;
  } catch {
    return {};
  }
}

function saveStore(store: MasteryStore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('[Mastery] Failed to save:', e);
  }
}

function ensureStats(store: MasteryStore, wordId: string): WordStats {
  if (!store[wordId]) {
    store[wordId] = {
      attemptCount: 0,
      correctCount: 0,
      completeCount: 0,
      mistakeCount: 0,
      lastSeen: 0,
      lastMistake: 0,
    };
  }
  return store[wordId];
}

/**
 * Record that a word was just attempted (appeared in a stage).
 */
export function recordAttempt(wordId: string): void {
  const store = loadStore();
  const stats = ensureStats(store, wordId);
  stats.attemptCount++;
  stats.lastSeen = Date.now();
  saveStore(store);
}

/**
 * Record that a word was typed correctly on first try (no mistakes).
 */
export function recordCorrect(wordId: string): void {
  const store = loadStore();
  const stats = ensureStats(store, wordId);
  stats.correctCount++;
  saveStore(store);
}

/**
 * Record a mistake on a word.
 */
export function recordMistake(wordId: string): void {
  const store = loadStore();
  const stats = ensureStats(store, wordId);
  stats.mistakeCount++;
  stats.lastMistake = Date.now();
  saveStore(store);
}

/**
 * Record that a word was completed (typed fully, with or without prior mistakes).
 * This is used to calculate completion rate (completeCount / attemptCount).
 */
export function recordComplete(wordId: string): void {
  const store = loadStore();
  const stats = ensureStats(store, wordId);
  stats.completeCount++;
  saveStore(store);
}

/**
 * Get stats for a specific word.
 */
export function getWordStats(wordId: string): WordStats | null {
  const store = loadStore();
  return store[wordId] ?? null;
}

/**
 * Get all words with stats, sorted by mistake count (descending).
 * Returns at most `limit` words.
 */
export function getWeakWords(limit: number = 5): Array<{ wordId: string; stats: WordStats }> {
  const store = loadStore();
  return Object.entries(store)
    .map(([wordId, stats]) => ({ wordId, stats }))
    .filter((entry) => entry.stats.mistakeCount > 0)
    .sort((a, b) => b.stats.mistakeCount - a.stats.mistakeCount)
    .slice(0, limit);
}

/**
 * Get top strong words (most correct), used for "Mastered" highlights.
 */
export function getStrongWords(limit: number = 5): Array<{ wordId: string; stats: WordStats }> {
  const store = loadStore();
  return Object.entries(store)
    .map(([wordId, stats]) => ({ wordId, stats }))
    .filter((entry) => entry.stats.correctCount > 0)
    .sort((a, b) => b.stats.correctCount - a.stats.correctCount)
    .slice(0, limit);
}

/**
 * Calculate overall mastery percentage (0-100).
 *
 * Mastery = completeCount / attemptCount across all words.
 * This represents the rate of successfully completing words (regardless of prior mistakes).
 * Returns 0 if no attempts.
 */
export function getOverallMastery(): number {
  const store = loadStore();
  let totalAttempts = 0;
  let totalComplete = 0;
  for (const stats of Object.values(store)) {
    totalAttempts += stats.attemptCount;
    totalComplete += stats.completeCount;
  }
  if (totalAttempts === 0) return 0;
  return Math.round((totalComplete / totalAttempts) * 100);
}

/**
 * Count of words attempted at least once.
 */
export function getAttemptedWordCount(): number {
  const store = loadStore();
  return Object.values(store).filter((s) => s.attemptCount > 0).length;
}

/**
 * Get words seen in current stage run (for Weak Words at result screen).
 *
 * Tracks which words the player struggled with during this session.
 * Cleared on stage start.
 */
const sessionMistakes = new Set<string>();

export function trackSessionMistake(wordId: string): void {
  sessionMistakes.add(wordId);
}

export function getSessionWeakWords(): string[] {
  return Array.from(sessionMistakes);
}

export function clearSessionMistakes(): void {
  sessionMistakes.clear();
}

/**
 * Reset all mastery data (for testing or user request).
 */
export function resetMastery(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  sessionMistakes.clear();
}
