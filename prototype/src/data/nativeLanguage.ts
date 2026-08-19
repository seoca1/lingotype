/**
 * Native Language Setting
 *
 * The user's native (mother-tongue) language for UI translations
 * and explanation display. This is distinct from `currentLanguage`
 * (the language being learned).
 *
 * Examples:
 * - currentLanguage='jp', nativeLanguage='en' — Learning Japanese with English explanations
 * - currentLanguage='kr', nativeLanguage='ko' — Learning Korean with Korean explanations
 *
 * Persisted in localStorage; defaults to 'en' (English) for international audience.
 */

export type NativeLanguage = 'en' | 'ko' | 'ja' | 'es';

const STORAGE_KEY = 'lingotype-native-language';
const DEFAULT_NATIVE_LANGUAGE: NativeLanguage = 'en';

/** In-memory fallback for environments without working localStorage */
let memoryNative: NativeLanguage | null = null;

function hasWorkingLocalStorage(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const testKey = '__native_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function isValidNativeLanguage(value: string): value is NativeLanguage {
  return value === 'en' || value === 'ko' || value === 'ja' || value === 'es';
}

/**
 * Get the user's native language (default: 'en').
 */
export function getNativeLanguage(): NativeLanguage {
  if (hasWorkingLocalStorage()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw && isValidNativeLanguage(raw)) return raw;
    } catch {
      // fall through
    }
  }
  if (memoryNative && isValidNativeLanguage(memoryNative)) {
    return memoryNative;
  }
  return DEFAULT_NATIVE_LANGUAGE;
}

/**
 * Set the user's native language.
 */
export function setNativeLanguage(lang: NativeLanguage): void {
  if (hasWorkingLocalStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      memoryNative = lang;
    }
  } else {
    memoryNative = lang;
  }
}

/**
 * Display label for each native language (used in settings UI).
 */
export const NATIVE_LANGUAGE_LABELS: Record<NativeLanguage, string> = {
  en: 'English',
  ko: '한국어 (Korean)',
  ja: '日本語 (Japanese)',
  es: 'Español (Spanish)',
};

/**
 * Display short label (2-3 chars) for compact UI.
 */
export const NATIVE_LANGUAGE_SHORT: Record<NativeLanguage, string> = {
  en: 'EN',
  ko: '한',
  ja: '日',
  es: 'ES',
};
