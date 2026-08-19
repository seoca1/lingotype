/**
 * Phase F Tests — Native Language, UI Translations, Meaning Resolver
 *
 * Verifies the new multilingual infrastructure:
 * - getNativeLanguage() default + persistence
 * - setNativeLanguage() round-trips through localStorage
 * - t() returns correct translations for all 4 languages
 * - getMeaning() picks the right language from meanings map
 * - getMeaning() falls back gracefully through the chain
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getNativeLanguage,
  setNativeLanguage,
  NATIVE_LANGUAGE_LABELS,
} from '../../src/data/nativeLanguage.js';
import { t, UI_STRINGS } from '../../src/data/uiTranslations.js';
import { getMeaning, hasMeaning } from '../../src/data/meaningResolver.js';
import type { WordEntry, Target } from '../../src/types.js';

const STORAGE_KEY = 'lingotype-native-language';

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

describe('nativeLanguage — default & persistence', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('defaults to English (en) when no preference saved', () => {
    expect(getNativeLanguage()).toBe('en');
  });

  it('setNativeLanguage persists to localStorage', () => {
    setNativeLanguage('ko');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('ko');
    expect(getNativeLanguage()).toBe('ko');
  });

  it('setNativeLanguage handles all 4 languages', () => {
    for (const lang of ['en', 'ko', 'ja', 'es'] as const) {
      setNativeLanguage(lang);
      expect(getNativeLanguage()).toBe(lang);
    }
  });

  it('ignores invalid stored values, falls back to en', () => {
    localStorage.setItem(STORAGE_KEY, 'fr'); // invalid
    expect(getNativeLanguage()).toBe('en');
  });

  it('NATIVE_LANGUAGE_LABELS has all 4 languages', () => {
    expect(Object.keys(NATIVE_LANGUAGE_LABELS)).toEqual(
      expect.arrayContaining(['en', 'ko', 'ja', 'es'])
    );
  });
});

describe('uiTranslations — t() function', () => {
  it('returns English for en', () => {
    expect(t('todaysLesson', 'en')).toBe("Today's Lesson");
    expect(t('meaning', 'en')).toBe('Meaning');
  });

  it('returns Korean for ko', () => {
    expect(t('todaysLesson', 'ko')).toBe('오늘의 학습');
    expect(t('meaning', 'ko')).toBe('뜻');
  });

  it('returns Japanese for ja', () => {
    expect(t('todaysLesson', 'ja')).toBe('今日の学習');
    expect(t('meaning', 'ja')).toBe('意味');
  });

  it('returns Spanish for es', () => {
    expect(t('todaysLesson', 'es')).toBe('Lección de hoy');
    expect(t('meaning', 'es')).toBe('Significado');
  });

  it('all translation keys have all 4 languages', () => {
    for (const [key, translations] of Object.entries(UI_STRINGS)) {
      expect(translations.en, `${key} missing en`).toBeTruthy();
      expect(translations.ko, `${key} missing ko`).toBeTruthy();
      expect(translations.ja, `${key} missing ja`).toBeTruthy();
      expect(translations.es, `${key} missing es`).toBeTruthy();
    }
  });

  it('fallback: missing key returns key as debug', () => {
    // Cast to bypass type check for invalid key
    expect(t('nonexistent' as any, 'en')).toBe('nonexistent');
  });
});

describe('meaningResolver — getMeaning()', () => {
  it('returns meanings[nativeLanguage] when present', () => {
    const entry: Partial<WordEntry> = {
      meanings: { en: 'hello', ko: '안녕', ja: 'こんにちは', es: 'hola' },
    };
    expect(getMeaning(entry, 'en')).toBe('hello');
    expect(getMeaning(entry, 'ko')).toBe('안녕');
    expect(getMeaning(entry, 'ja')).toBe('こんにちは');
    expect(getMeaning(entry, 'es')).toBe('hola');
  });

  it('falls back to English when target language missing', () => {
    const entry: Partial<WordEntry> = {
      meanings: { en: 'hello', ko: '안녕' },
    };
    expect(getMeaning(entry, 'ja')).toBe('hello');
    expect(getMeaning(entry, 'es')).toBe('hello');
  });

  it('falls back to Korean (legacy) when nothing else', () => {
    const entry: Partial<WordEntry> = {
      meanings: { ko: '안녕' },
    };
    expect(getMeaning(entry, 'en')).toBe('안녕');
    expect(getMeaning(entry, 'ja')).toBe('안녕');
  });

  it('legacy meaning + meaningLang', () => {
    const entry: Partial<WordEntry> = {
      meaning: 'hello',
      meaningLang: 'en',
    };
    expect(getMeaning(entry, 'en')).toBe('hello');
    // Other languages also get 'hello' (no better option)
    expect(getMeaning(entry, 'ko')).toBe('hello');
  });

  it('uses Target.text as last resort', () => {
    const target: Partial<Target> = { text: 'こんにちは' };
    expect(getMeaning(target, 'en')).toBe('こんにちは');
  });

  it('uses WordEntry.display as last resort', () => {
    const entry: Partial<WordEntry> = { display: 'hello' };
    expect(getMeaning(entry, 'en')).toBe('hello');
  });

  it('returns undefined when nothing available', () => {
    expect(getMeaning({}, 'en')).toBeUndefined();
  });

  it('hasMeaning detects presence', () => {
    expect(hasMeaning({ meanings: { en: 'hello' } } as any)).toBe(true);
    expect(hasMeaning({ display: 'word' } as any)).toBe(true);
    expect(hasMeaning({} as any)).toBe(false);
  });
});

describe('Phase F Integration — User Scenarios', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('English user seeing Korean word: meaning in English', () => {
    setNativeLanguage('en');
    const koreanEntry: Partial<WordEntry> = {
      id: 'kr_001',
      display: '안녕하세요',
      meanings: { en: 'hello', ko: '안녕' },
      meaningLang: 'ko',
    };
    expect(getMeaning(koreanEntry, getNativeLanguage())).toBe('hello');
  });

  it('Korean user seeing English word: meaning in Korean', () => {
    setNativeLanguage('ko');
    const englishEntry: Partial<WordEntry> = {
      id: 'en_001',
      display: 'hello',
      meanings: { en: 'hello', ko: '안녕' },
      meaningLang: 'en',
    };
    expect(getMeaning(englishEntry, getNativeLanguage())).toBe('안녕');
  });

  it('Japanese user seeing English word: gets English fallback', () => {
    setNativeLanguage('ja');
    const englishEntry: Partial<WordEntry> = {
      id: 'en_001',
      display: 'hello',
      meanings: { en: 'hello' },
      meaningLang: 'en',
    };
    // ja not present, falls back to en
    expect(getMeaning(englishEntry, getNativeLanguage())).toBe('hello');
  });

  it('UI labels match the user chosen native language', () => {
    setNativeLanguage('ja');
    expect(t('todaysLesson', getNativeLanguage())).toBe('今日の学習');
    expect(t('close', getNativeLanguage())).toBe('閉じる');
    expect(t('practice', getNativeLanguage())).toBe('練習する');
  });
});
