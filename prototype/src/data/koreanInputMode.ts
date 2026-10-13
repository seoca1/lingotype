/**
 * Korean Input Mode Setting
 *
 * Whether the user wants to type Korean via the 2-beol (jamo) keyboard
 * (default) or via the romanized (ES-era) approach. Today the prototype
 * only ships jamo, but the option is exposed so Settings can persist a
 * choice ahead of a romanized handler.
 *
 * Persisted in localStorage; defaults to 'jamo'.
 */

export type KoreanInputMode = 'jamo' | 'romanized';

const STORAGE_KEY = 'typing-language-korean-input-mode';
const DEFAULT_KOREAN_INPUT_MODE: KoreanInputMode = 'jamo';

/** In-memory fallback for environments without working localStorage */
let memoryMode: KoreanInputMode | null = null;

function hasWorkingLocalStorage(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const testKey = '__kr_input_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function isValidKoreanInputMode(value: string): value is KoreanInputMode {
  return value === 'jamo' || value === 'romanized';
}

/** Get the user's Korean input mode (default: 'jamo'). */
export function getKoreanInputMode(): KoreanInputMode {
  if (hasWorkingLocalStorage()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw && isValidKoreanInputMode(raw)) return raw;
    } catch {
      // fall through
    }
  }
  if (memoryMode && isValidKoreanInputMode(memoryMode)) {
    return memoryMode;
  }
  return DEFAULT_KOREAN_INPUT_MODE;
}

/** Set the user's Korean input mode. */
export function setKoreanInputMode(mode: KoreanInputMode): void {
  if (hasWorkingLocalStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      memoryMode = mode;
    }
  } else {
    memoryMode = mode;
  }
}