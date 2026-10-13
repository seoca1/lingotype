/**
 * Phase 34 — Final polish + accessibility tests (Slice 3 port + Slice 4a
 * ResultScreen mastery-bar + LearnScreen kbd-hint re-enable).
 *
 * Covers the Phase 34 improvements adopted into Slice 3 + the mastery
 * progressbar + LearnScreen kbd-hint re-enabled by Slice 4a:
 *
 * - `ResultScreen` kbd-hint SR-regression fix: the bottom `<small
 *   className="result-kbd-hint">` must NOT carry
 *   `aria-label="Keyboard shortcuts"` which would OVERRODE the readable
 *   `<small><kbd>Esc</kbd> return to menu</small>` content — exactly the
 *   same regression Phase 32 fixed in the Menu screen.
 * - `ResultScreen` mastery-bar progressbar + aria-value tuple + label
 *   (Slice 4a).
 * - `LearnScreen` kbd-hint footer mirroring the ResultScreen + Menu
 *   pattern (Slice 4a).
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase34-a11y.test.tsx`,
 *   RE-ENABLED (2026-10-13) Slice 4a:
 *   - `ResultScreen` mastery-bar: RE-ENABLED — Slice 4a adds
 *     `role="progressbar"` + `aria-label` + the
 *     aria-valuenow/valuemin/valuemax tuple on the mastery-bar
 *     container, and `aria-hidden="true"` on the visible % label so SR
 *     users don't hear a redundant numeric announcement.
 *   - `LearnScreen` kbd-hint: RE-ENABLED — Slice 4a adds
 *     `<small class="learn-screen__kbd-hint"><kbd>Enter</kbd> start ·
 *     <kbd>Esc</kbd> back</small>` mirroring the ResultScreen +
 *     Menu pattern. No aria-label override so SR users hear the actual
 *     shortcut names.
 *   - Phase 33 + Phase 32 regression-guard block at the bottom of the
 *     remote file: kept in `tests/ui/phase33-a11y.test.tsx` + `tests/ui/
 *     phase32-a11y.test.tsx` (separate Slice 2 ports) — adding them
 *     again here would duplicate coverage.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ResultScreen } from '../../src/ui/ResultScreen.js';

const here = dirname(fileURLToPath(import.meta.url));
const resultScreenSrc = readFileSync(
  resolve(here, '../../src/ui/ResultScreen.tsx'),
  'utf-8'
);
const learnScreenSrc = readFileSync(
  resolve(here, '../../src/ui/LearnScreen.tsx'),
  'utf-8'
);

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

// Stub window.speechSynthesis (matches Phase 25/27 pattern).
if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
  (window as unknown as { speechSynthesis: { cancel: () => void; speak: () => void } }).speechSynthesis = {
    cancel: () => {},
    speak: () => {},
  };
}

beforeEach(() => {
  localStorage.clear();
});

// ============================================================================
// ResultScreen — kbd-hint SR-regression fix (Slice 3)
// ============================================================================

describe('Phase 34 — ResultScreen kbd-hint no longer overrides <kbd> content', () => {
  it('ResultScreen renders the <kbd>Esc</kbd> hint footer (renderToStaticMarkup smoke)', () => {
    const html = renderToStaticMarkup(
      <ResultScreen
        score={100}
        enemiesDefeated={5}
        missions={[]}
        results={[]}
        onBack={() => {}}
      />
    );
    // The <kbd>Esc</kbd> should be present in the rendered HTML.
    expect(html).toMatch(/<kbd>Esc<\/kbd>/);
    // The bogus aria-label should NOT be present anywhere in the
    // ResultScreen output (the regression guard Phase 34 enforces).
    expect(html).not.toContain('aria-label="Keyboard shortcuts"');
  });
});

// ============================================================================
// Out-of-scope skip blocks — referenced above; listed here so a future
// auditor can see at a glance which remote assertions were deferred
// rather than silently dropped.
// ============================================================================

// Slice 4a: ResultScreen mastery-bar exposes role="progressbar" block
// RE-ENABLED. The formerly-skipped `it.skip` markers are now real
// source-level + renderToStaticMarkup checks against the new mastery-bar
// markup.
describe('Phase 34 — ResultScreen mastery-bar exposes role="progressbar" (RE-ENABLED in Slice 4a)', () => {
  it('mastery-bar container has role="progressbar" so SR users hear mastery %', () => {
    expect(resultScreenSrc).toMatch(
      /className="mastery-bar"[\s\S]{0,200}role="progressbar"/
    );
  });

  it('mastery-bar exposes aria-valuenow tied to overallMastery', () => {
    expect(resultScreenSrc).toMatch(/aria-valuenow=\{overallMastery\}/);
    expect(resultScreenSrc).toMatch(/aria-valuemin=\{0\}/);
    expect(resultScreenSrc).toMatch(/aria-valuemax=\{100\}/);
  });

  it('mastery-bar exposes an aria-label announcing the mastery %', () => {
    expect(resultScreenSrc).toMatch(/aria-label=\{`\$\{t\('masteryPercent'[^`]*\}: \$\{overallMastery\} percent`\}/);
  });

  it('mastery-bar__label is aria-hidden so it is not double-announced', () => {
    expect(resultScreenSrc).toMatch(/className="mastery-bar__label" aria-hidden="true"/);
  });
});

// Slice 4a: LearnScreen kbd-hint SR-regression fix block RE-ENABLED.
// Slice 4a added <small class="learn-screen__kbd-hint"> with the
// <kbd>Enter</kbd> · <kbd>Esc</kbd> text and NO aria-label override
// (mirrors the Phase 32/34 Menu + ResultScreen contract).
describe('Phase 34 — LearnScreen kbd-hint no longer overrides <kbd> content (RE-ENABLED in Slice 4a)', () => {
  it('LearnScreen source wires learn-screen__kbd-hint <small> with no aria-label override', () => {
    expect(learnScreenSrc).toMatch(/learn-screen__kbd-hint/);
    // Regression guard: no aria-label="Keyboard shortcuts" override on
    // the learn-screen__kbd-hint <small> — the same fix Phase 32 applied
    // to the Menu screen and Phase 34 applied to the ResultScreen.
    expect(learnScreenSrc).not.toMatch(
      /className="learn-screen__kbd-hint"[\s\S]{0,200}aria-label="Keyboard shortcuts"/
    );
  });

  it('LearnScreen kbd-hint still preserves the <kbd>Enter</kbd> · <kbd>Esc</kbd> text', () => {
    expect(learnScreenSrc).toMatch(/<kbd>Enter<\/kbd>\s*start/);
    expect(learnScreenSrc).toMatch(/<kbd>Esc<\/kbd>\s*back/);
  });
});
