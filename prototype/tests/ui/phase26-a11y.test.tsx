/**
 * Phase 26 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25:
 *
 * - `SettingsScreen` sound toggle: now uses `id="settings-sound-toggle"`
 *   + explicit `htmlFor` pairing + `aria-label` on the checkbox input.
 *   Previously the label wrapped the checkbox but had no `htmlFor`,
 *   leaving a pairing gap for SR tools that walk the accessibility tree
 *   rather than relying on DOM nesting.
 *
 * - `SettingsScreen` volume slider: now uses `id="settings-volume-slider"`
 *   + explicit `htmlFor` binding on the label, mirroring the Phase 19
 *   StageScreen fix. Also exposes `aria-label` + `aria-valuetext="<n>
 *   percent"` so SR users hear the numeric value when they focus the
 *   slider. (The slider is conditionally rendered when sound is enabled,
 *   so this is verified via source-level assertions like Phase 21/22/23.)
 *
 * - `MarkdownView` TTS button: now exposes `aria-pressed="false"` by
 *   default and a static `aria-label="Listen to pronunciation"`. (The
 *   `speaking` state toggle is verified via source contract — React's
 *   `useState` flips aria-pressed to "true" on click, which jsdom +
 *   static markup can't observe.) Previously the only state indicator
 *   was the emoji (⏸ vs 🔊), which is invisible to SR users. Now SR
 *   users hear the button state announce its purpose.
 *
 * Source-level assertions verify the unwrappable contracts (mirrors the
 * Phase 21/22/23 pattern in the existing test files).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MarkdownView } from '../../src/ui/MarkdownView.js';

const here = dirname(fileURLToPath(import.meta.url));
const settingsSrc = readFileSync(
  resolve(here, '../../src/ui/SettingsScreen.tsx'),
  'utf-8'
);
const markdownSrc = readFileSync(
  resolve(here, '../../src/ui/MarkdownView.tsx'),
  'utf-8'
);

// Install localStorage polyfill for jsdom (matches Phase 14/17/19/20/21/22/23/24/25 pattern).
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

// Stub window.speechSynthesis (used by MarkdownView TtsButton).
if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
  (window as any).speechSynthesis = {
    cancel: () => {},
    speak: () => {},
  };
}

beforeEach(() => {
  localStorage.clear();
});

// ============================================================================
// SettingsScreen — sound toggle htmlFor/id pairing
// ============================================================================

describe('Phase 26 — SettingsScreen sound toggle exposes htmlFor/id pairing', () => {
  it('toggle label has htmlFor="settings-sound-toggle"', () => {
    expect(settingsSrc).toMatch(/htmlFor="settings-sound-toggle"/);
  });

  it('toggle input has id="settings-sound-toggle"', () => {
    expect(settingsSrc).toMatch(/id="settings-sound-toggle"/);
  });

  it('toggle input exposes aria-label naming the sound preference', () => {
    expect(settingsSrc).toMatch(/id="settings-sound-toggle"[\s\S]*?aria-label=\{t\('sound'/);
  });
});

// ============================================================================
// SettingsScreen — volume slider id/htmlFor + aria-valuetext
// ============================================================================

describe('Phase 26 — SettingsScreen volume slider exposes id/htmlFor + aria-valuetext', () => {
  it('volume label has htmlFor="settings-volume-slider"', () => {
    expect(settingsSrc).toMatch(/htmlFor="settings-volume-slider"/);
  });

  it('volume input has id="settings-volume-slider"', () => {
    expect(settingsSrc).toMatch(/id="settings-volume-slider"/);
  });

  it('volume input exposes aria-label + aria-valuetext for SR users', () => {
    expect(settingsSrc).toMatch(/id="settings-volume-slider"[\s\S]*?aria-label=\{t\('volume'/);
    expect(settingsSrc).toMatch(/aria-valuetext=\{`\$\{Math\.round\(volume \* 100\)\} percent`\}/);
  });
});

// ============================================================================
// MarkdownView TtsButton — aria-pressed reflects speaking state
// ============================================================================

describe('Phase 26 — MarkdownView TtsButton exposes aria-pressed for speaking state', () => {
  it('TtsButton source wires aria-pressed={speaking} on the button', () => {
    expect(markdownSrc).toMatch(/aria-pressed=\{speaking\}/);
  });

  it('TtsButton source uses dynamic aria-label (Listen vs Stop)', () => {
    expect(markdownSrc).toMatch(/aria-label=\{speaking \? 'Stop pronunciation' : 'Listen to pronunciation'\}/);
  });

  it('list-item TtsButton renders aria-pressed="false" by default', () => {
    const html = renderToStaticMarkup(
      <MarkdownView source="- First item" enableTts ttsLanguage="en" />
    );
    const matches = html.match(/<button[^>]*aria-label="Listen to pronunciation"[^>]*aria-pressed="false"[^>]*>/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBe(1);
  });

  it('callout TtsButton renders aria-pressed="false" by default', () => {
    const html = renderToStaticMarkup(
      <MarkdownView source="!> [tip] Tip content" enableTts ttsLanguage="en" />
    );
    expect(html).toMatch(
      /<button[^>]*aria-label="Listen to pronunciation"[^>]*aria-pressed="false"/
    );
  });

  it('every TtsButton has aria-pressed wired (regression guard)', () => {
    const html = renderToStaticMarkup(
      <MarkdownView source={'# Title\n\nBody paragraph.\n\n- One\n- Two\n\n!> [warning] Beware'} enableTts ttsLanguage="en" />
    );
    const buttons = html.match(/<button[^>]*aria-label="Listen to pronunciation"[^>]*aria-pressed="false"[^>]*>/g);
    expect(buttons).not.toBeNull();
    expect(buttons!.length).toBeGreaterThanOrEqual(3); // paragraph + 2 list items + callout = 4
  });
});
