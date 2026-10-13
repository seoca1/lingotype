/**
 * Phase 31 — Final polish + accessibility tests (Slice 4 port).
 *
 * Covers three Phase 31 improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30:
 *
 * - `CharacterTest` a11y: aria-label + aria-pressed on every
 *   char/pose/render-mode button, plus a 2px cyan focus-visible rule.
 * - `SettingsScreen` volume-debounce: the volume slider's savedAt tick is
 *   debounced to 400ms so dragging the slider does not retrigger the
 *   `aria-live="polite"` saved indicator ~10 times per drag.
 * - `LearnScreen` focus-visible: a 2px cyan outline rule on the filter +
 *   vocab-card buttons.
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase31-a11y.test.tsx`.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CharacterTest } from '../../src/ui/CharacterTest.js';
import { LearnScreen } from '../../src/ui/LearnScreen.js';
import type { StageConfig, Enemy } from '../../src/types.js';

const here = dirname(fileURLToPath(import.meta.url));
const characterTestSrc = readFileSync(
  resolve(here, '../../src/ui/CharacterTest.tsx'),
  'utf-8'
);
const settingsScreenSrc = readFileSync(
  resolve(here, '../../src/ui/SettingsScreen.tsx'),
  'utf-8'
);
const learnScreenSrc = readFileSync(
  resolve(here, '../../src/ui/LearnScreen.tsx'),
  'utf-8'
);

// Install localStorage polyfill for jsdom (matches prior phase pattern).
if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.setItem !== 'function') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (k: string) => (store.get(k) as string) ?? null,
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length(): number { return store.size; },
  } as Storage;
}

// Stub window.speechSynthesis so renderToStaticMarkup doesn't blow up
// on the SettingsScreen's TTS preview path.
if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
  (window as unknown as { speechSynthesis: { cancel: () => void; speak: () => void } }).speechSynthesis = {
    cancel: () => {},
    speak: () => {},
  };
}

beforeEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

// ============================================================================
// CharacterTest — aria-label + aria-pressed on every button
// ============================================================================

describe('Phase 31 — CharacterTest exposes aria-label + aria-pressed on char/pose buttons', () => {
  it('renders without throwing (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(<CharacterTest onBack={() => {}} />)
    ).not.toThrow();
  });

  it('CharacterTest source wires aria-label on all 3 English character buttons', () => {
    expect(characterTestSrc).toMatch(/aria-label="Emily \(English character, 7 of 7 images complete\)"/);
    expect(characterTestSrc).toMatch(/aria-label="Oliver \(English character, 7 of 7 images complete\)"/);
    expect(characterTestSrc).toMatch(/aria-label="Sophia \(English character, 7 of 7 images complete\)"/);
  });

  it('CharacterTest source wires aria-pressed on char-selection buttons', () => {
    expect(characterTestSrc).toMatch(/aria-pressed=\{currentCharacter === 'en-emily'\}/);
    expect(characterTestSrc).toMatch(/aria-pressed=\{currentCharacter === 'en-oliver'\}/);
    expect(characterTestSrc).toMatch(/aria-pressed=\{currentCharacter === 'es-isabella'\}/);
  });

  it('CharacterTest source wires aria-label on the 7 pose buttons', () => {
    expect(characterTestSrc).toMatch(/aria-label="Pose 1: idle \(1-idle\.png\)"/);
    expect(characterTestSrc).toMatch(/aria-label="Pose 4: clap \(4-clap\.png\)"/);
    expect(characterTestSrc).toMatch(/aria-label="Pose 7: pose \(7-pose\.png\)"/);
  });

  it('CharacterTest source wires aria-label on the back-to-menu button', () => {
    expect(characterTestSrc).toMatch(/aria-label="Back to menu"/);
  });

  it('CharacterTest source ships a phase-31 :focus-visible rule for controls', () => {
    expect(characterTestSrc).toMatch(/\.character-test-controls button:focus-visible\s*\{/);
    expect(characterTestSrc).toMatch(/outline:\s*2px\s+solid\s+#00d9ff/);
  });
});

// ============================================================================
// SettingsScreen — volume debounce (no SR chatter on slider drag)
// ============================================================================

describe('Phase 31 — SettingsScreen debounces volume savedAt to prevent aria-live spam', () => {
  it('SettingsScreen source declares a volumeSaveTimerRef', () => {
    expect(settingsScreenSrc).toMatch(/volumeSaveTimerRef/);
  });

  it('handleVolumeChange uses window.setTimeout with a 400ms debounce', () => {
    expect(settingsScreenSrc).toMatch(/window\.setTimeout\([\s\S]{0,200}400\s*\)/);
  });

  it('handleVolumeChange clears any pending timer before scheduling a new one', () => {
    expect(settingsScreenSrc).toMatch(/window\.clearTimeout\(volumeSaveTimerRef\.current\)/);
  });

  it('SettingsScreen source clears the volume timer on unmount', () => {
    expect(settingsScreenSrc).toMatch(/volumeSaveTimerRef[\s\S]{0,400}window\.clearTimeout\(volumeSaveTimerRef\.current\)/);
  });
});

// ============================================================================
// LearnScreen — focus-visible on filter + vocab-card buttons
// ============================================================================

describe('Phase 31 — LearnScreen exposes :focus-visible on filter + vocab buttons', () => {
  it('LearnScreen source wires .learn-screen__filter-btn:focus-visible', () => {
    expect(learnScreenSrc).toMatch(/\.learn-screen__filter-btn:focus-visible\b/);
  });

  it('LearnScreen source wires .learn-screen__vocab-card:focus-visible', () => {
    expect(learnScreenSrc).toMatch(/\.learn-screen__vocab-card:focus-visible\b/);
  });

  it('LearnScreen focus-visible rule uses the 2px cyan outline pattern', () => {
    expect(learnScreenSrc).toMatch(
      /\.learn-screen__filter-btn:focus-visible[\s\S]{0,400}outline:\s*2px\s+solid\s+#00d9ff/
    );
  });

  it('LearnScreen source ships a phase-31 anchor comment', () => {
    expect(learnScreenSrc).toMatch(/Phase 31:[\s\S]{0,1200}\.learn-screen__filter-btn:focus-visible/);
  });
});

// ============================================================================
// Phase 31 — render smoke test for LearnScreen (regression guard)
// ============================================================================

describe('Phase 31 — LearnScreen renders without throwing (regression guard)', () => {
  it('renders the preview screen with a minimal stage fixture', () => {
    const stage: StageConfig = {
      id: 'en_easy_1',
      name: 'English Easy 1',
      description: 'Beginner English words',
      language: 'en',
      difficulty: 1,
      wordCount: 5,
      corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greetings'] },
      missions: [],
    };
    const enemies: Enemy[] = [
      {
        id: 'en_001',
        target: {
          text: 'hello',
          acceptedInputs: ['hello'],
          level: 1,
          category: 'greetings',
          meaning: 'a greeting',
        },
        hp: 100,
        maxHp: 100,
        spawnTime: 0,
      },
    ];
    expect(() =>
      renderToStaticMarkup(
        <LearnScreen stage={stage} enemies={enemies} onStart={() => {}} onBack={() => {}} />
      )
    ).not.toThrow();
  });
});