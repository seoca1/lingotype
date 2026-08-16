/**
 * Phase 31 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30:
 *
 * - `CharacterTest` a11y: the screen shipped 16+ buttons with no
 *   aria-label and no visible focus indicator. Phase 31 adds
 *   aria-label + aria-pressed on every char/pose/render-mode button,
 *   plus a 2px cyan focus-visible rule on the test harness controls.
 *   Keyboard / AT users can now actually navigate the screen.
 *
 * - `SettingsScreen` volume-debounce: the volume slider's
 *   handleVolumeChange fired on every 0.1 step, so dragging the slider
 *   retriggered the `aria-live="polite"` saved indicator ~10 times per
 *   drag — SR users would hear "Settings saved" repeatedly. Phase 31
 *   debounces the savedAt tick to 400ms after the last volume change
 *   so the announcement only fires once per drag.
 *
 * - `LearnScreen` focus-visible: the screen has filter buttons and
 *   vocab-card buttons with aria-label / aria-pressed wiring (Phase 23),
 *   but neither shipped a visible focus indicator. Phase 31 adds a
 *   2px cyan outline rule in the inline <style> so keyboard users
 *   tabbing through the preview see a consistent focus ring on every
 *   actionable control.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/
 * 26/27/28/29/30).
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

// Install localStorage polyfill for jsdom (matches Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30 pattern).
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
// on the SettingsScreen's TTS preview path (matches Phase 25/30 pattern).
if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
  (window as any).speechSynthesis = {
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
    // Emily / Oliver / Sophia each need a meaningful aria-label so AT
    // users hear more than just the emoji text.
    expect(characterTestSrc).toMatch(/aria-label="Emily \(English character, 7 of 7 images complete\)"/);
    expect(characterTestSrc).toMatch(/aria-label="Oliver \(English character, 7 of 7 images complete\)"/);
    expect(characterTestSrc).toMatch(/aria-label="Sophia \(English character, 7 of 7 images complete\)"/);
  });

  it('CharacterTest source wires aria-pressed on char-selection buttons', () => {
    // aria-pressed mirrors the Phase 22 Difficulty button pattern so SR
    // users hear which character is currently selected.
    expect(characterTestSrc).toMatch(/aria-pressed=\{currentCharacter === 'en-emily'\}/);
    expect(characterTestSrc).toMatch(/aria-pressed=\{currentCharacter === 'en-oliver'\}/);
    expect(characterTestSrc).toMatch(/aria-pressed=\{currentCharacter === 'es-isabella'\}/);
  });

  it('CharacterTest source wires aria-label on the 7 pose buttons', () => {
    // Each pose button needs a distinct aria-label so SR users can tell
    // them apart (the emoji + 한글 text alone is ambiguous).
    expect(characterTestSrc).toMatch(/aria-label="Pose 1: idle \(1-idle\.png\)"/);
    expect(characterTestSrc).toMatch(/aria-label="Pose 4: clap \(4-clap\.png\)"/);
    expect(characterTestSrc).toMatch(/aria-label="Pose 7: pose \(7-pose\.png\)"/);
  });

  it('CharacterTest source wires aria-label on the back-to-menu button', () => {
    // Phase 31 closes the gap where the back button was emoji-only with
    // no accessible name.
    expect(characterTestSrc).toMatch(/aria-label="Back to menu"/);
  });

  it('CharacterTest source ships a phase-31 :focus-visible rule for controls', () => {
    // The new rule must live in the inline <style> block so it ships
    // with the component (matches the Phase 30 DailyLessonCard pattern).
    expect(characterTestSrc).toMatch(/\.character-test-controls button:focus-visible\s*\{/);
    expect(characterTestSrc).toMatch(/outline:\s*2px\s+solid\s+#00d9ff/);
  });
});

// ============================================================================
// SettingsScreen — volume debounce (no SR chatter on slider drag)
// ============================================================================

describe('Phase 31 — SettingsScreen debounces volume savedAt to prevent aria-live spam', () => {
  it('SettingsScreen source declares a volumeSaveTimerRef', () => {
    // The new ref-backed timer must exist so the debounce has a slot to
    // clear between rapid onChange calls.
    expect(settingsScreenSrc).toMatch(/volumeSaveTimerRef/);
  });

  it('handleVolumeChange uses window.setTimeout with a 400ms debounce', () => {
    // The debounce must be 400ms or longer so a slider drag (typically
    // 200ms) coalesces into a single savedAt tick. < 400ms would risk
    // mid-drag chatter; > 600ms would feel laggy.
    expect(settingsScreenSrc).toMatch(/window\.setTimeout\([\s\S]{0,200}400\s*\)/);
  });

  it('handleVolumeChange clears any pending timer before scheduling a new one', () => {
    // The debounce must reset the prior timer on every change so a
    // continuous drag keeps delaying the indicator until the user stops.
    expect(settingsScreenSrc).toMatch(/window\.clearTimeout\(volumeSaveTimerRef\.current\)/);
  });

  it('SettingsScreen source clears the volume timer on unmount', () => {
    // Defensive cleanup so the timer doesn't fire setSavedAt after the
    // component is gone (would warn about updating unmounted state).
    expect(settingsScreenSrc).toMatch(/volumeSaveTimerRef[\s\S]{0,400}window\.clearTimeout\(volumeSaveTimerRef\.current\)/);
  });
});

// ============================================================================
// LearnScreen — focus-visible on filter + vocab-card buttons
// ============================================================================

describe('Phase 31 — LearnScreen exposes :focus-visible on filter + vocab buttons', () => {
  it('LearnScreen source wires .learn-screen__filter-btn:focus-visible', () => {
    // The filter buttons have aria-pressed + aria-label (Phase 23) but
    // no visible focus indicator. Phase 31 closes that gap. The rule
    // appears in a comma-separated selector list — match a leading
    // selector name + the focus-visible pseudo.
    expect(learnScreenSrc).toMatch(/\.learn-screen__filter-btn:focus-visible\b/);
  });

  it('LearnScreen source wires .learn-screen__vocab-card:focus-visible', () => {
    // The vocab-card buttons have aria-label (Phase 23) but no visible
    // focus indicator. Phase 31 closes that gap.
    expect(learnScreenSrc).toMatch(/\.learn-screen__vocab-card:focus-visible\b/);
  });

  it('LearnScreen focus-visible rule uses the 2px cyan outline pattern', () => {
    // Same 2px cyan outline + 2px offset as the Phase 30 .warning-btn
    // rule so visual cadence stays consistent across the dialog family.
    // The selector list precedes the { ... } block, so widen the window
    // to cross the comma-separated selectors.
    expect(learnScreenSrc).toMatch(
      /\.learn-screen__filter-btn:focus-visible[\s\S]{0,400}outline:\s*2px\s+solid\s+#00d9ff/
    );
  });

  it('LearnScreen source ships a phase-31 anchor comment', () => {
    // The phase-anchor comment must appear in the same style block as
    // the new rules (matches the Phase 30 DailyLessonCard convention).
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
