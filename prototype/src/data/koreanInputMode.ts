/**
 * Korean Input Mode Setting
 *
 * Supports two input methods for Korean:
 * - 'jamo': Direct jamo input (2-set keyboard) — current default
 * - 'romanized': Romanized input (QWERTY + phonetic mapping) — foreigner-friendly
 *
 * Default: 'jamo' (for users with Korean keyboard)
 * Switchable via Settings screen.
 */

export type KoreanInputMode = 'jamo' | 'romanized';

const STORAGE_KEY = 'lingotype-kr-input-mode';
const DEFAULT_MODE: KoreanInputMode = 'jamo';

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

function isValidMode(value: string): value is KoreanInputMode {
  return value === 'jamo' || value === 'romanized';
}

export function getKoreanInputMode(): KoreanInputMode {
  if (hasWorkingLocalStorage()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw && isValidMode(raw)) return raw;
    } catch {
      // fall through
    }
  }
  if (memoryMode && isValidMode(memoryMode)) {
    return memoryMode;
  }
  return DEFAULT_MODE;
}

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
