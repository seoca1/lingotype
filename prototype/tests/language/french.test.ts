/**
 * French Language Config Tests
 *
 * Phase 15 — French language scaffold.
 * Verifies that FRENCH_CONFIG is registered, complete, and consistent with
 * the upstream Language wiki theme-stems.
 */

import { describe, it, expect } from 'vitest';
import { getLanguage, getAllLanguageCodes } from '../../src/language/index.js';
import { FRENCH_CONFIG } from '../../src/language/languages/french.js';
import { FR_WORDS, FR_SENTENCES, CORPUS, SENTENCES } from '../../src/data/corpus.js';
import { FrenchHandler } from '../../src/input/FrenchHandler.js';

describe('French language — registration', () => {
  it('should be registered in the global registry', () => {
    expect(getAllLanguageCodes()).toContain('fr');
    expect(getLanguage('fr').code).toBe('fr');
  });

  it('should expose correct metadata', () => {
    expect(FRENCH_CONFIG.name).toBe('French');
    expect(FRENCH_CONFIG.nativeName).toBe('Français');
    expect(FRENCH_CONFIG.icon).toBe('🇫🇷');
    expect(FRENCH_CONFIG.supportsTier0).toBe(false);
    expect(FRENCH_CONFIG.themeColor).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should produce a working FrenchHandler instance', () => {
    const handler = FRENCH_CONFIG.createHandler();
    expect(handler).toBeInstanceOf(FrenchHandler);
    expect(handler.language).toBe('fr');
  });

  it('should describe accent-input + ASCII fallback input model', () => {
    expect(FRENCH_CONFIG.inputDescription.toLowerCase()).toContain('accent');
    expect(FRENCH_CONFIG.inputDescription.toLowerCase()).toContain('fallback');
  });
});

describe('French language — corpus citation integrity', () => {
  it('should expose 30+ FR_WORDS', () => {
    expect(FR_WORDS.length).toBeGreaterThanOrEqual(30);
  });

  it('should expose 6+ FR_SENTENCES', () => {
    expect(FR_SENTENCES.length).toBeGreaterThanOrEqual(6);
  });

  it('should include FR in CORPUS and SENTENCES maps', () => {
    expect(CORPUS.fr).toBe(FR_WORDS);
    expect(SENTENCES.fr).toBe(FR_SENTENCES);
  });

  it('every FR_WORDS entry should have a source theme-stem citation', () => {
    // Per AGENTS.md §1.5: source: [테마 stem] 필드 필수
    const validStems = new Set([
      'basic-vocabulary',
      'daily-life-vocabulary',
      'food-vocabulary',
      'business-vocabulary',
      'travel-vocabulary',
      'polite-expressions',
    ]);
    const missing = FR_WORDS.filter(
      (w) => !w.source || !validStems.has(w.source)
    );
    expect(missing).toEqual([]);
  });

  it('every FR_SENTENCES entry should have a source theme-stem citation', () => {
    const validStems = new Set([
      'basic-vocabulary',
      'daily-life-vocabulary',
      'food-vocabulary',
      'business-vocabulary',
      'travel-vocabulary',
      'polite-expressions',
    ]);
    const missing = FR_SENTENCES.filter(
      (s) => !s.source || !validStems.has(s.source)
    );
    expect(missing).toEqual([]);
  });

  it('all FR words should have unique IDs', () => {
    const ids = FR_WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all FR sentences should have unique IDs', () => {
    const ids = FR_SENTENCES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('FR_WORDS and FR_SENTENCES should share the configured corpus', () => {
    expect(FRENCH_CONFIG.corpus.words).toBe(FR_WORDS);
    expect(FRENCH_CONFIG.corpus.sentences).toBe(FR_SENTENCES);
  });
});

describe('French language — diacritic coverage', () => {
  it('should include representative accented characters across corpus', () => {
    // At least one of each major diacritic category should appear
    const allText = [
      ...FR_WORDS.map((w) => w.display),
      ...FR_SENTENCES.map((s) => s.display),
    ].join(' ');

    // Acute accent
    expect(allText).toMatch(/[é]/);
    // Grave accent
    expect(allText).toMatch(/[èàù]/);
    // Circumflex
    expect(allText).toMatch(/[êâûôî]/);
    // Cedilla
    expect(allText).toMatch(/[ç]/);
  });

  it('should include at least one French apostrophe (l\', d\', j\', qu\', n\')', () => {
    const allText = [
      ...FR_WORDS.map((w) => w.display),
      ...FR_SENTENCES.map((s) => s.display),
    ].join(' ');

    expect(allText).toMatch(/[ldjqn]'/);
  });
});
