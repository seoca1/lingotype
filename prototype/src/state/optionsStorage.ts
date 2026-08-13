/**
 * Options Persistence (Phase 10: UX polish)
 *
 * User-level preferences persisted to localStorage. Distinct from
 * PlayerProgress (which tracks game stats). Mirrors the
 * `typing-language-tutorial-completed` key pattern.
 */

import type { DifficultyPreference, Options } from '../types.js';

const STORAGE_KEY = 'typing-language-options';

export const DEFAULT_OPTIONS: Options = {
  displayHighlighting: true,
  sound: true,
  difficulty: 'normal',
};

const VALID_DIFFICULTIES: readonly DifficultyPreference[] = ['easy', 'normal', 'hard'];

function sanitize(input: unknown): Options {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_OPTIONS };
  }
  const candidate = input as Partial<Options>;
  const difficulty: DifficultyPreference =
    typeof candidate.difficulty === 'string' &&
    (VALID_DIFFICULTIES as readonly string[]).includes(candidate.difficulty)
      ? (candidate.difficulty as DifficultyPreference)
      : DEFAULT_OPTIONS.difficulty;
  return {
    displayHighlighting:
      typeof candidate.displayHighlighting === 'boolean'
        ? candidate.displayHighlighting
        : DEFAULT_OPTIONS.displayHighlighting,
    sound: typeof candidate.sound === 'boolean' ? candidate.sound : DEFAULT_OPTIONS.sound,
    difficulty,
  };
}

export function loadOptions(): Options {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_OPTIONS };
    return sanitize(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_OPTIONS };
  }
}

export function saveOptions(options: Options): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  } catch (error) {
    console.warn('[Options] failed to save:', error);
  }
}

export function clearOptions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
