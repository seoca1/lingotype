/**
 * Cross-language Translation System
 *
 * Maps words across languages by their Korean meaning (which serves as
 * a "bridge language"). When the user types a word, this module finds
 * the same concept in other languages to display as floating effects.
 *
 * Also provides sentence translation lookup (using the existing English
 * `meaning` field on sentence entries).
 */

import type { Language, WordEntry } from '../types.js';
import { CORPUS, SENTENCES } from './corpus.js';

// ===== Word Translation Index =====

interface WordTranslationIndex {
  /** Map: Korean meaning → list of (language, display) entries */
  byMeaning: Map<string, Array<{ lang: Language; display: string }>>;
  /** Map: language → (display → entry) for fast lookup */
  byDisplay: Map<Language, Map<string, WordEntry>>;
  /** Map: language → (id → entry) */
  byId: Map<Language, Map<string, WordEntry>>;
}

function buildWordIndex(): WordTranslationIndex {
  const byMeaning = new Map<string, Array<{ lang: Language; display: string }>>();
  const byDisplay = new Map<Language, Map<string, WordEntry>>();
  const byId = new Map<Language, Map<string, WordEntry>>();

  for (const lang of Object.keys(CORPUS) as Array<keyof typeof CORPUS>) {
    const displayMap = new Map<string, WordEntry>();
    const idMap = new Map<string, WordEntry>();
    const entries = CORPUS[lang];

    for (const entry of entries) {
      if (!entry.display) continue;
      displayMap.set(entry.display.toLowerCase(), entry);
      idMap.set(entry.id, entry);

      if (entry.meaning) {
        const meaningKey = entry.meaning.trim();
        const existing = byMeaning.get(meaningKey) || [];
        existing.push({ lang, display: entry.display });
        byMeaning.set(meaningKey, existing);
      }
    }

    byDisplay.set(lang, displayMap);
    byId.set(lang, idMap);
  }

  return { byMeaning, byDisplay, byId };
}

const wordIndex: WordTranslationIndex = buildWordIndex();

// ===== Public API =====

export interface CrossLangMatch {
  lang: Language;
  display: string;
}

/**
 * Find translations of the given word in other languages.
 * Returns up to `count` random translations, weighted so English
 * (the lingua franca) appears more often.
 *
 * @param sourceLang - the language being typed (excluded from results)
 * @param display - the word being typed
 * @param meaning - the word's Korean meaning (more reliable cross-lang key)
 * @param count - number of translations to return (default 2)
 */
export function findCrossLangTranslations(
  sourceLang: Language,
  display: string,
  meaning: string | undefined,
  count = 2,
): CrossLangMatch[] {
  const candidates = new Map<Language, CrossLangMatch>();

  // Strategy 1: Match by meaning (more reliable for cross-lang lookup)
  if (meaning) {
    const matches = wordIndex.byMeaning.get(meaning.trim()) || [];
    for (const m of matches) {
      if (m.lang !== sourceLang) {
        candidates.set(m.lang, m);
      }
    }
  }

  // Strategy 2: Match by exact display (fallback for transliterations)
  if (candidates.size < count) {
    const lower = display.toLowerCase();
    for (const [lang, displayMap] of wordIndex.byDisplay.entries()) {
      if (lang === sourceLang || candidates.has(lang)) continue;
      const match = displayMap.get(lower);
      if (match && match.display.toLowerCase() !== lower) {
        candidates.set(lang, { lang, display: match.display });
      }
    }
  }

  // Pick translations with English weighting
  const arr = Array.from(candidates.values());
  if (arr.length === 0) return [];

  const weighted: CrossLangMatch[] = [];
  const usedLangs = new Set<Language>();

  // Always try to include English first if available and not source
  if (sourceLang !== 'en' && candidates.has('en')) {
    weighted.push(candidates.get('en')!);
    usedLangs.add('en');
  }

  // Then pick remaining randomly
  const remaining = arr.filter((m) => !usedLangs.has(m.lang));
  while (weighted.length < count && remaining.length > 0) {
    const idx = Math.floor(Math.random() * remaining.length);
    const picked = remaining.splice(idx, 1)[0];
    weighted.push(picked);
  }

  return weighted.slice(0, count);
}

/**
 * Look up English translation for a sentence.
 * Returns the meaning field if available (sentences store English translation in meaning).
 */
export function getSentenceEnglishTranslation(
  sourceLang: Language,
  display: string,
): string | null {
  type SentencesByLang = Record<string, ReadonlyArray<WordEntry>>;
  const sentenceList = (SENTENCES as SentencesByLang)[sourceLang] || [];

  // Exact match first
  for (const entry of sentenceList) {
    if (entry.display === display && entry.meaning) {
      return entry.meaning;
    }
  }

  // Normalized match (trim whitespace, ignore punctuation)
  const norm = (s: string) => s.replace(/[\s.,!?¿¡]+/g, '').toLowerCase();
  const target = norm(display);
  for (const entry of sentenceList) {
    if (norm(entry.display || '') === target && entry.meaning) {
      return entry.meaning;
    }
  }

  // Also check words corpus (in case it's a word stored as sentence)
  const wordMap = wordIndex.byDisplay.get(sourceLang);
  if (wordMap) {
    const entry = wordMap.get(display.toLowerCase());
    if (entry?.meaning) return entry.meaning;
  }

  return null;
}

/**
 * Quick check if display text is a "sentence" (long) vs a "word" (short).
 * Sentences: > 20 chars or contains spaces + multiple words
 */
export function isSentence(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  // Count meaningful tokens (letters/digits)
  const tokens = trimmed.split(/\s+/).filter((t) => /[a-zA-Z0-9가-힯ぁ-んー]/.test(t));
  return tokens.length >= 3 || trimmed.length > 20;
}
