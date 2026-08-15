/**
 * Phase 30 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29:
 *
 * - `style.css` `.warning-btn:focus-visible`: new 2px cyan outline +
 *   2px offset rule for the blocking KeyboardWarning modal buttons.
 *   Phase 14/25 added role="dialog" + aria-label + the (Escape)/(Enter)
 *   keyboard hints, plus focus-trap wiring that auto-focuses the
 *   dismiss button on mount — but the only persistent actions (Back /
 *   Continue) had no visible focus indicator. Phase 30 closes that gap
 *   so keyboard users tabbing through the trap see a consistent cyan
 *   ring on every actionable element.
 *
 * - `DailyLessonCard` `.daily-lesson-card__btn:focus-visible`: new
 *   2px cyan outline rule on the 3 action buttons (Read more /
 *   Practice / Later). Phase 20 added aria-label to each one but no
 *   visible focus indicator existed — keyboard users tabbing through
 *   the Result screen got no visual confirmation of which card-action
 *   was selected.
 *
 * - `SettingsScreen` saved indicator: a transient `✓ Settings saved`
 *   banner with role="status" + aria-live="polite" that appears for
 *   2.5s whenever the user changes a setting (native language /
 *   volume / sound / KR input mode). Mirrors the Phase 19
 *   OptionsScreen `options-saved` pattern so Settings persistence now
 *   has both visible and audible confirmation instead of silently
 *   auto-saving on every change.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/
 * 26/27/28/29).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KoreanKeyboardWarning } from '../../src/ui/KoreanKeyboardWarning.js';
import { NonKoreanKeyboardWarning } from '../../src/ui/NonKoreanKeyboardWarning.js';
import { SettingsScreen } from '../../src/ui/SettingsScreen.js';
import { DailyLessonCard } from '../../src/ui/DailyLessonCard.js';
import type { DailyLesson } from '../../src/data/dailyLessons.js';

const here = dirname(fileURLToPath(import.meta.url));
const styleCss = readFileSync(
  resolve(here, '../../src/style.css'),
  'utf-8'
);
const settingsScreenSrc = readFileSync(
  resolve(here, '../../src/ui/SettingsScreen.tsx'),
  'utf-8'
);
const dailyLessonCardSrc = readFileSync(
  resolve(here, '../../src/ui/DailyLessonCard.tsx'),
  'utf-8'
);

// Install localStorage polyfill for jsdom (matches Phase 14/17/19/20/21/22/23/24/25/26/27/28/29 pattern).
if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.setItem !== 'function') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (k: string) => (store.has(k) ? (store.get(k) as string) : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length(): number { return store.size; },
  } as Storage;
}

// Stub window.speechSynthesis so SettingsScreen's TTS preview path
// doesn't throw in jsdom (matches Phase 25 pattern).
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

// Minimal DailyLesson fixture for the renderToStaticMarkup smoke tests.
// Only the fields DailyLessonCard actually touches are populated.
const sampleLesson: DailyLesson = {
  id: 'en_2026-01-15',
  date: '2026-01-15',
  language: 'en',
  sourceTopic: 'greetings',
  difficulty: { tier: 1, cefr: 'A1', primaryStage: 'en_easy_1' },
  source: { rawFile: 'en_words.md' },
  raw: {
    sourceFile: 'en_words.md',
    excerpt: 'Hello! How are you today?',
  },
  wiki: {
    vocabulary: [],
    expressions: [],
    culture: null,
  },
  meta: {
    estimatedReadMinutes: 5,
    relatedStages: ['en_easy_1'],
  },
};

// ============================================================================
// style.css — .warning-btn:focus-visible rule
// ============================================================================

describe('Phase 30 — style.css ships :focus-visible rule for .warning-btn', () => {
  it('declares .warning-btn:focus-visible with a 2px cyan outline', () => {
    expect(styleCss).toMatch(/\.warning-btn:focus-visible\s*\{[^}]*outline:\s*2px\s+solid\s+#00d9ff/);
  });

  it('uses a 2px outline-offset matching the Phase 14 modal close-button pattern', () => {
    // Mirrors .options-screen__close:focus-visible (Phase 14) so visual
    // cadence stays consistent across the dialog family.
    expect(styleCss).toMatch(/\.warning-btn:focus-visible\s*\{[^}]*outline-offset:\s*2px/);
  });

  it('Phase 30 block carries a phase-anchor comment', () => {
    // The phase-anchor comment must appear in the same style block as
    // the new rule. Match a generous window to allow for the multi-line
    // explanation Phase 30 ships (mirrors Phase 14/19/20/21/27/29).
    expect(styleCss).toMatch(/Phase 30:[\s\S]{0,800}\.warning-btn:focus-visible/);
  });
});

// ============================================================================
// DailyLessonCard — :focus-visible rule on the 3 action buttons
// ============================================================================

describe('Phase 30 — DailyLessonCard action buttons expose :focus-visible ring', () => {
  it('renders all 3 action buttons without throwing (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(
        <DailyLessonCard
          lesson={sampleLesson}
          onOpen={() => {}}
          onSkip={() => {}}
          onPractice={() => {}}
        />
      )
    ).not.toThrow();
  });

  it('DailyLessonCard source wires .daily-lesson-card__btn:focus-visible rule', () => {
    // The new rule must live in the inline <style> block so it ships
    // with the component (Phase 14/19/25/29 convention for inline CSS).
    expect(dailyLessonCardSrc).toMatch(/\.daily-lesson-card__btn:focus-visible\s*\{/);
  });

  it('.daily-lesson-card__btn:focus-visible uses the 2px cyan outline pattern', () => {
    expect(dailyLessonCardSrc).toMatch(
      /\.daily-lesson-card__btn:focus-visible\s*\{[^}]*outline:\s*2px\s+solid\s+#00d9ff/
    );
  });

  it('Phase 30 block in DailyLessonCard carries a phase-anchor comment', () => {
    // Mirrors the .enemy-tooltip__close Phase 29 pattern. The phase
    // marker must appear above the rule in the inline <style> block.
    expect(dailyLessonCardSrc).toMatch(
      /Phase 30:[\s\S]{0,800}\.daily-lesson-card__btn:focus-visible/
    );
  });
});

// ============================================================================
// Keyboard warnings — :focus-visible rule is wired in style.css
// (regression guards that the CSS rule applies to both modals)
// ============================================================================

describe('Phase 30 — Keyboard warning modals still expose dialog semantics + buttons', () => {
  it('KoreanKeyboardWarning keeps role="dialog" + (Escape)/(Enter) buttons (regression guard)', () => {
    const html = renderToStaticMarkup(
      <KoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(/role="dialog"/);
    expect(html).toMatch(/aria-label="Back to menu \(Escape\)"/);
    expect(html).toMatch(/aria-label="Continue to stage \(Enter\)"/);
  });

  it('NonKoreanKeyboardWarning keeps role="dialog" + (Escape)/(Enter) buttons (regression guard)', () => {
    const html = renderToStaticMarkup(
      <NonKoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(/role="dialog"/);
    expect(html).toMatch(/aria-label="Back to menu \(Escape\)"/);
    expect(html).toMatch(/aria-label="Continue to stage \(Enter\)"/);
  });
});

// ============================================================================
// SettingsScreen — transient "Settings saved" indicator (UX polish)
// ============================================================================

describe('Phase 30 — SettingsScreen exposes a transient saved indicator', () => {
  it('SettingsScreen renders without throwing (Phase 30 savedAt state is initialised safely)', () => {
    expect(() =>
      renderToStaticMarkup(
        <SettingsScreen onClose={() => {}} />
      )
    ).not.toThrow();
  });

  it('SettingsScreen source declares the savedAt state', () => {
    // The new state slot must exist so the indicator banner has a
    // trigger to flip on. Mirrors Phase 19's `resetAt` state pattern.
    expect(settingsScreenSrc).toMatch(/const\s+\[savedAt,\s*setSavedAt\]\s*=\s*useState/);
  });

  it('SettingsScreen source wires an aria-live="polite" saved indicator', () => {
    // The new banner must expose role="status" + aria-live="polite"
    // so SR users hear the save confirmation, mirroring the Phase 19
    // OptionsScreen saved-indicator pattern.
    expect(settingsScreenSrc).toMatch(/role="status"/);
    expect(settingsScreenSrc).toMatch(/aria-live="polite"/);
    expect(settingsScreenSrc).toMatch(/data-testid="settings-saved-indicator"/);
  });

  it('SettingsScreen does NOT show the saved indicator on first render (zero state)', () => {
    // Regression guard: the new banner is gated on savedAt !== null so
    // a fresh open must not display "✓ Settings saved" before any
    // change has happened.
    const html = renderToStaticMarkup(
      <SettingsScreen onClose={() => {}} />
    );
    expect(html).not.toMatch(/data-testid="settings-saved-indicator"/);
  });
});
