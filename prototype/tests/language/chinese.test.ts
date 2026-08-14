/**
 * Chinese Language Config Tests
 *
 * Phase 18 — Chinese language scaffold.
 * Verifies that CHINESE_CONFIG is registered, complete, and consistent with
 * the upstream Language wiki theme-stems.
 */

import { describe, it, expect } from 'vitest';
import { getLanguage, getAllLanguageCodes } from '../../src/language/index.js';
import { CHINESE_CONFIG } from '../../src/language/languages/chinese.js';
import { ZH_WORDS, ZH_SENTENCES, CORPUS, SENTENCES } from '../../src/data/corpus.js';
import { ChineseHandler } from '../../src/input/ChineseHandler.js';

describe('Chinese language — registration', () => {
  it('should be registered in the global registry', () => {
    expect(getAllLanguageCodes()).toContain('zh');
    expect(getLanguage('zh').code).toBe('zh');
  });

  it('should expose correct metadata', () => {
    expect(CHINESE_CONFIG.name).toBe('Chinese');
    expect(CHINESE_CONFIG.icon).toBe('🇨🇳');
    expect(CHINESE_CONFIG.supportsTier0).toBe(false);
    expect(CHINESE_CONFIG.themeColor).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should produce a working ChineseHandler instance', () => {
    const handler = CHINESE_CONFIG.createHandler();
    expect(handler).toBeInstanceOf(ChineseHandler);
    expect(handler.language).toBe('zh');
  });

  it('should describe pinyin-input as input model', () => {
    expect(CHINESE_CONFIG.inputDescription.toLowerCase()).toContain('pinyin');
  });
});

describe('Chinese language — corpus citation integrity', () => {
  it('should expose 50+ ZH_WORDS', () => {
    expect(ZH_WORDS.length).toBeGreaterThanOrEqual(50);
  });

  it('should expose 8+ ZH_SENTENCES', () => {
    expect(ZH_SENTENCES.length).toBeGreaterThanOrEqual(8);
  });

  it('should include ZH in CORPUS and SENTENCES maps', () => {
    expect(CORPUS.zh).toBe(ZH_WORDS);
    expect(SENTENCES.zh).toBe(ZH_SENTENCES);
  });

  it('every ZH_WORDS entry should have a source theme-stem citation', () => {
    // Per AGENTS.md §1.5: source: [테마 stem] 필드 필수
    const validStems = new Set([
      'basic-vocabulary',
      'numbers-vocabulary',
      'colors-vocabulary',
      'family-vocabulary',
      'food-vocabulary',
      'travel-vocabulary',
      'business-vocabulary',
      'time-vocabulary',
      'polite-expressions',
      'zh-daily-life-vocabulary',
      'zh-polite-expressions-vocabulary',
    ]);
    const missing = ZH_WORDS.filter(
      (w) => !w.source || !validStems.has(w.source)
    );
    expect(missing).toEqual([]);
  });

  it('every ZH_SENTENCES entry should have a source theme-stem citation', () => {
    const validStems = new Set([
      'basic-vocabulary',
      'numbers-vocabulary',
      'colors-vocabulary',
      'family-vocabulary',
      'food-vocabulary',
      'travel-vocabulary',
      'business-vocabulary',
      'time-vocabulary',
      'daily-life-vocabulary',
      'polite-expressions',
      'zh-daily-life-vocabulary',
      'zh-polite-expressions-vocabulary',
    ]);
    const missing = ZH_SENTENCES.filter(
      (s) => !s.source || !validStems.has(s.source)
    );
    expect(missing).toEqual([]);
  });

  it('all ZH words should have unique IDs', () => {
    const ids = ZH_WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all ZH sentences should have unique IDs', () => {
    const ids = ZH_SENTENCES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ZH_WORDS and ZH_SENTENCES should share the configured corpus', () => {
    expect(CHINESE_CONFIG.corpus.words).toBe(ZH_WORDS);
    expect(CHINESE_CONFIG.corpus.sentences).toBe(ZH_SENTENCES);
  });
});

describe('Chinese language — pinyin coverage', () => {
  it('should include pinyin field (romaji) on every word entry', () => {
    const missing = ZH_WORDS.filter((w) => !w.romaji || w.romaji.length === 0);
    expect(missing).toEqual([]);
  });

  it('should include pinyin field on every sentence entry', () => {
    const missing = ZH_SENTENCES.filter((s) => !s.romaji || s.romaji.length === 0);
    expect(missing).toEqual([]);
  });

  it('should include core tone categories across corpus', () => {
    // 1st tone (ā ē ī ō ū), 2nd tone (á é í ó ú) — basic acute marks
    const allText = ZH_WORDS.map((w) => w.romaji ?? '').join(' ');
    expect(allText).toMatch(/[āéíōúǖ]/); // some tone-mark vowel present
    // 3rd/4th tone (ă ǐ ò ǔ) - also present
    expect(allText).toMatch(/[ǎǐǒǔǚ]/);
  });

  it('should include special pinyin initials (zh/ch/sh) across corpus', () => {
    const allText = ZH_WORDS.map((w) => w.romaji ?? '').join(' ');
    expect(allText).toMatch(/zh/);
    expect(allText).toMatch(/ch/);
    expect(allText).toMatch(/sh/);
  });

  it('should include aspirated/ü combinations', () => {
    const allText = ZH_WORDS.map((w) => w.romaji ?? '').join(' ');
    // nü or lü or ju/qu/xu clusters present
    expect(allText).toMatch(/[ǖǘǚǜ]|nv|lv|nuo|lue|nue/);
  });
});
