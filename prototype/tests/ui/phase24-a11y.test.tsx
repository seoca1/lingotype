/**
 * Phase 24 — Final polish + accessibility tests.
 *
 * Covers the three Phase 24 improvements layered on top of Phase 14/17/19/20/21/22/23:
 * - ResultScreen unlock banner: the icon was a replacement character
 *   (mojibake `\ufffd` from a Phase I emoji encoding issue). Replaced with
 *   the proper `🎉` emoji so sighted users see a celebration icon. The icon
 *   remains `aria-hidden="true"` so the aria-label on the banner is what
 *   screen readers announce.
 * - ResultScreen mission result rows: each `<div>` now carries an
 *   aria-label naming the mission and whether it was cleared or failed.
 *   The decorative ✓/✗ is `aria-hidden` so the wrapper is the source of
 *   truth for SR users. (Phase 27 removed the original `role="status"`
 *   here because 3+ missions rendering simultaneously caused a burst of
 *   SR announcements; the aria-label is still the single source of truth
 *   for SR users, which is the Phase 24 contract this file verifies.)
 * - ResultScreen footer: a small keyboard shortcut hint makes the Escape
 *   affordance for "back to menu" discoverable, mirroring the Menu's
 *   Phase 20/22 pattern.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't fire
 * :focus-visible); source-level assertions verify the unwrappable
 * contracts (mojibake fix, kbd hint presence).
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

// Install localStorage polyfill for jsdom (matches Phase 17/19/20/21/22/23 pattern).
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
// ResultScreen — unlock banner mojibake fix
// ============================================================================

describe('Phase 24 — ResultScreen unlock banner renders a proper emoji (no mojibake)', () => {
  it('source contract: the unlock-banner icon uses the celebration emoji, not a replacement char', () => {
    const src = readFileSync(resolve(here, '../../src/ui/ResultScreen.tsx'), 'utf-8');
    // The Phase I banner had `\ufffd` (U+FFFD REPLACEMENT CHARACTER) where an
    // emoji should be. Phase 24 replaces it with the standard `🎉` (U+1F389)
    // so sighted users see a celebration icon.
    expect(src).toMatch(/result-unlock-banner__icon[^>]*>🎉</);
    expect(src).not.toMatch(/result-unlock-banner__icon[^>]*>\uFFFD</);
  });

  it('unlock-banner icon is still aria-hidden (the aria-label on the wrapper is the SR source)', () => {
    const src = readFileSync(resolve(here, '../../src/ui/ResultScreen.tsx'), 'utf-8');
    expect(src).toMatch(/result-unlock-banner__icon[^>]*aria-hidden="true"[^>]*>🎉</);
  });
});

// ============================================================================
// ResultScreen — mission result rows announce cleared/failed to SR users
// ============================================================================

describe('Phase 24 — ResultScreen mission results expose aria-label naming cleared/failed', () => {
  it('mission result rows are rendered with cleared/failed aria-label', () => {
    const html = renderToStaticMarkup(
      <ResultScreen {...baseProps} />
    );
    // Cleared mission
    expect(html).toMatch(
      /<div[^>]*class="mission-result cleared"[^>]*aria-label="Defeat 5 enemies: cleared"/
    );
    // Failed mission
    expect(html).toMatch(
      /<div[^>]*class="mission-result failed"[^>]*aria-label="90% accuracy: failed"/
    );
  });

  it('decorative checkmark/cross is wrapped in aria-hidden so SR users hear only the label', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    // The `<span aria-hidden="true">` carries the visual ✓/✗ — the wrapper
    // div is the only thing the screen reader announces.
    expect(html).toMatch(/<span aria-hidden="true">✓<\/span>/);
    expect(html).toMatch(/<span aria-hidden="true">✗<\/span>/);
  });

  it('source contract: aria-label pattern is preserved on mission result rows', () => {
    const src = readFileSync(resolve(here, '../../src/ui/ResultScreen.tsx'), 'utf-8');
    expect(src).toMatch(/aria-label=\{`\$\{m\.name\}: \$\{cleared \? 'cleared' : 'failed'\}`\}/);
  });

  it('Phase 27 regression guard: per-row role="status" was removed to stop SR announcement burst', () => {
    // 3+ missions firing role="status" simultaneously caused a SR
    // announcement burst. aria-label remains the source of truth.
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    const missionDivs = html.match(/<div[^>]*class="mission-result[^"]*"[^>]*>/g) || [];
    for (const div of missionDivs) {
      expect(div).not.toMatch(/role="status"/);
    }
  });
});

// ============================================================================
// ResultScreen — keyboard shortcut hint footer
// ============================================================================

describe('Phase 24 — ResultScreen announces Escape-to-back via a visible kbd hint', () => {
  it('back-to-menu button aria-label mentions Escape', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toMatch(/<button[^>]*aria-label="Back to menu \(Escape\)"/);
  });

  it('back-to-menu button visible label includes (Esc)', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toMatch(/Back to Menu \(Esc\)/);
  });

  it('result-kbd-hint footer announces keyboard shortcuts', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    // Phase 34 regression fix: the previous aria-label="Keyboard
    // shortcuts" OVERRODE the readable <small><kbd>Esc</kbd> return to
    // menu</small> content — same SR regression Phase 32 fixed in the
    // Menu screen. SR users heard only "Keyboard shortcuts" and never
    // learned the actual shortcut. Phase 34 removes the aria-label so
    // SR users now hear the full hint content.
    expect(html).toMatch(/<p[^>]*class="result-kbd-hint"/);
    expect(html).not.toContain('aria-label="Keyboard shortcuts"');
    expect(html).toMatch(/<kbd>Esc<\/kbd> return to menu/);
  });
});
