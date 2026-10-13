/**
 * Phase 24 — Final polish + accessibility tests (Slice 3 port + Slice 4a
 * mission-row re-enable).
 *
 * Covers the one Phase 24 improvement adopted into Slice 3 + the mission
 * row markers re-enabled by Slice 4a:
 *
 * - `ResultScreen` footer: a small keyboard shortcut hint makes the Escape
 *   affordance for "back to menu" discoverable, mirroring the Menu's
 *   Phase 20/22 pattern. The visible `<kbd>` element is rendered without
 *   an `aria-label` override so SR users hear "<kbd>Esc</kbd> return to
 *   menu" instead of a generic "Keyboard shortcuts" override that hides
 *   the actual shortcut (the exact regression Phase 32 caught on the
 *   Menu screen and Phase 34 catches on the ResultScreen).
 * - `ResultScreen` mission result rows expose aria-label naming
 *   cleared/failed + decorative check/cross aria-hidden (Slice 4a).
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase24-a11y.test.tsx`,
 *   RE-ENABLED (2026-10-13) Slice 4a:
 *   - `ResultScreen` mission result rows: RE-ENABLED — Slice 4a adds
 *     `aria-label="${name}: ${cleared/failed}"` on the listitem +
 *     `<span aria-hidden="true">✓</span>` / `<span aria-hidden="true">✗</span>`
 *     wraps on the visible glyph. The pre-Slice-3 mission rows were plain
 *     text glyphs + role="listitem"; the new markers make the SR-friendly
 *     cleared/failed announcement possible.
 *   - `ResultScreen` unlock banner mojibake fix: skipped — the local
 *     ResultScreen unlock-banner icon reads `🔓` (a key emoji) rather
 *     than the remote's pre-Phase-24 `\ufffd` mojibake the fix replaced
 *     with `🎉`. The local banner never carried the mojibake, so the
 *     fix-is-needed assertion is a no-op. The visible-name regression
 *     guard remains as a sanity-check that the icon is still
 *     `aria-hidden="true"` once a later slice adopts it. Reason:
 *     `feature-not-applicable: local icon was already 🔓, mojibake
 *     regression never existed`. Slice 4a does NOT add aria-hidden to
 *     this icon because doing so is outside the explicit task scope.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ResultScreen } from '../../src/ui/ResultScreen.js';
import type { MissionConfig } from '../../src/types.js';

const here = dirname(fileURLToPath(import.meta.url));

// Install localStorage polyfill for jsdom (matches prior phase pattern).
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

const baseMissions: MissionConfig[] = [
  {
    id: 'm1',
    name: 'Defeat 5 enemies',
    description: 'Defeat 5 enemies in a row.',
    type: 'defeat_count',
    params: { count: 5 },
  },
  {
    id: 'm2',
    name: '90% accuracy',
    description: 'Maintain 90% accuracy.',
    type: 'accuracy_threshold',
    params: { threshold: 90 },
  },
];

const baseProps = {
  score: 1200,
  enemiesDefeated: 8,
  missions: baseMissions,
  results: [
    { missionId: 'm1', cleared: true },
    { missionId: 'm2', cleared: false },
  ],
  onBack: () => {},
};

// ============================================================================
// ResultScreen — back-to-menu aria-label + kbd hint footer (Slice 3)
// ============================================================================

describe('Phase 24 — ResultScreen announces Escape-to-back via aria-label + kbd hint', () => {
  it('back-to-menu button aria-label mentions Escape', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toMatch(/<button[^>]*aria-label="Back to menu \(Escape\)"/);
  });

  it('back-to-menu button visible label includes (Esc)', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toMatch(/Back to Menu \(Esc\)/);
  });

  it('result-kbd-hint footer announces keyboard shortcuts without aria-label override', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    // Phase 24/32/34 contract: the <p|small class="result-kbd-hint"> must
    // NOT carry `aria-label="Keyboard shortcuts"` — that label OVERRODE
    // the readable <kbd>Esc</kbd> content (Phase 32 caught the same bug
    // on Menu). SR users must hear "<kbd>Esc</kbd> return to menu".
    expect(html).toMatch(/<small[^>]*class="result-kbd-hint"/);
    expect(html).not.toContain('aria-label="Keyboard shortcuts"');
    expect(html).toMatch(/<kbd>Esc<\/kbd>\s+return to menu/);
  });
});

// ============================================================================
// Out-of-scope skip blocks — referenced above; listed here so a future
// auditor can see at a glance which remote assertions were deferred
// rather than silently dropped.
// ============================================================================

// Slice 4a: mission row aria-label + decorative aria-hidden block
// RE-ENABLED. The formerly-skipped `it.skip` markers are now real
// assertions against the new mission-row markup (aria-label on
// listitem + aria-hidden span around the ✓/✗ glyph).
describe('Phase 24 — ResultScreen mission results expose aria-label naming cleared/failed (RE-ENABLED in Slice 4a)', () => {
  it('mission result rows are rendered with cleared/failed aria-label', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toMatch(/aria-label="Defeat 5 enemies: cleared"/);
    expect(html).toMatch(/aria-label="90% accuracy: failed"/);
  });

  it('decorative checkmark/cross is wrapped in aria-hidden so SR users hear only the label', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toMatch(/<span aria-hidden="true">✓<\/span>/);
    expect(html).toMatch(/<span aria-hidden="true">✗<\/span>/);
  });

  it('source contract: aria-label pattern is preserved on mission result rows', () => {
    const resultSrc = readFileSync(
      resolve(here, '../../src/ui/ResultScreen.tsx'),
      'utf-8'
    );
    expect(resultSrc).toMatch(/aria-label=\{`\$\{m\.name\}: \$\{cleared \? 'cleared' : 'failed'\}`\}/);
  });
});

describe('Phase 24 — ResultScreen unlock banner renders a proper emoji (no mojibake)', () => {
  const resultSrc = readFileSync(
    resolve(here, '../../src/ui/ResultScreen.tsx'),
    'utf-8'
  );

  it('source contract: the unlock-banner icon uses a proper emoji, not a replacement char', () => {
    // ADAPTED: the local unlock-banner icon is 🔓 (a proper emoji), not the
    // remote's 🎉. The contract is "no mojibake replacement char".
    expect(resultSrc).toMatch(/result-unlock-banner__icon[^>]*>🔓</);
    expect(resultSrc).not.toMatch(/result-unlock-banner__icon[^>]*>\uFFFD</);
  });

  it('unlock-banner icon is still aria-hidden (the aria-label on the wrapper is the SR source)', () => {
    expect(resultSrc).toMatch(/result-unlock-banner__icon[^>]*aria-hidden="true"[^>]*>🔓</);
  });
});
