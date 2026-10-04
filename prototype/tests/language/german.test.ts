/**
 * German Language Config Tests
 *
 * Phase 16 — German language scaffold.
 * Verifies that GERMAN_CONFIG is registered, complete, and consistent with
 * the upstream Language wiki theme-stems.
 */

import { describe, it, expect } from 'vitest';
import { getLanguage, getAllLanguageCodes } from '../../src/language/index.js';
import { GERMAN_CONFIG } from '../../src/language/languages/german.js';
import { DE_WORDS, DE_SENTENCES, CORPUS, SENTENCES } from '../../src/data/corpus.js';
import { GermanHandler } from '../../src/input/GermanHandler.js';

describe('German language — registration', () => {
  it('should be registered in the global registry', () => {
    expect(getAllLanguageCodes()).toContain('de');
    expect(getLanguage('de').code).toBe('de');
  });

  it('should expose correct metadata', () => {
    expect(GERMAN_CONFIG.name).toBe('German');
    expect(GERMAN_CONFIG.nativeName).toBe('Deutsch');
    expect(GERMAN_CONFIG.icon).toBe('🇩🇪');
    expect(GERMAN_CONFIG.supportsTier0).toBe(false);
    expect(GERMAN_CONFIG.themeColor).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should produce a working GermanHandler instance', () => {
    const handler = GERMAN_CONFIG.createHandler();
    expect(handler).toBeInstanceOf(GermanHandler);
    expect(handler.language).toBe('de');
  });

  it('should describe umlaut-input + ASCII fallback input model', () => {
    expect(GERMAN_CONFIG.inputDescription.toLowerCase()).toContain('umlaut');
    expect(GERMAN_CONFIG.inputDescription.toLowerCase()).toContain('fallback');
  });
});

describe('German language — corpus citation integrity', () => {
  it('should expose 50+ DE_WORDS', () => {
    expect(DE_WORDS.length).toBeGreaterThanOrEqual(50);
  });

  it('should expose 8+ DE_SENTENCES', () => {
    expect(DE_SENTENCES.length).toBeGreaterThanOrEqual(8);
  });

  it('should include DE in CORPUS and SENTENCES maps', () => {
    expect(CORPUS.de).toBe(DE_WORDS);
    expect(SENTENCES.de).toBe(DE_SENTENCES);
  });

  it('every DE_WORDS entry should have a source theme-stem citation', () => {
    // Per AGENTS.md §1.5: source: [테마 stem] 필드 필수
    const validStems = new Set([
      'basic-vocabulary',
      'daily-life-vocabulary',
      'food-vocabulary',
      'business-vocabulary',
      'travel-vocabulary',
      'polite-expressions',
    ]);
    const missing = DE_WORDS.filter(
      (w) => !w.source || !validStems.has(w.source)
    );
    expect(missing).toEqual([]);
  });

  it('every DE_SENTENCES entry should have a source theme-stem citation', () => {
    const validStems = new Set([
      'basic-vocabulary',
      'daily-life-vocabulary',
      'food-vocabulary',
      'business-vocabulary',
      'travel-vocabulary',
      'polite-expressions',
    ]);
    const missing = DE_SENTENCES.filter(
      (s) => !s.source || !validStems.has(s.source)
    );
    expect(missing).toEqual([]);
  });

  it('all DE words should have unique IDs', () => {
    const ids = DE_WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all DE sentences should have unique IDs', () => {
    const ids = DE_SENTENCES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('DE_WORDS and DE_SENTENCES should share the configured corpus', () => {
    expect(GERMAN_CONFIG.corpus.words).toBe(DE_WORDS);
    expect(GERMAN_CONFIG.corpus.sentences).toBe(DE_SENTENCES);
  });
});

describe('German language — umlaut and ß coverage', () => {
  it('should include representative umlaut characters across corpus', () => {
    // At least one of each major umlaut should appear
    const allText = [
      ...DE_WORDS.map((w) => w.display),
      ...DE_SENTENCES.map((s) => s.display),
    ].join(' ');

    // a-umlaut
    expect(allText).toMatch(/[äÄ]/);
    // o-umlaut
    expect(allText).toMatch(/[öÖ]/);
    // u-umlaut
    expect(allText).toMatch(/[üÜ]/);
    // ß (Eszett)
    expect(allText).toMatch(/ß/);
  });

  it('should include at least one German definite article (der, die, das)', () => {
    const allText = DE_WORDS.map((w) => w.display).join(' ');

    expect(allText).toMatch(/\b(der|die|das)\b/);
  });
});
