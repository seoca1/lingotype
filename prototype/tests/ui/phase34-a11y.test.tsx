/**
 * Phase 34 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on Phase 14/17/19/20/21/
 * 22/23/24/25/26/27/28/29/30/31/32/33:
 *
 * - `ResultScreen` kbd-hint SR-regression fix: the bottom `<p
 *   className="result-kbd-hint">` previously carried
 *   `aria-label="Keyboard shortcuts"` which OVERRODE the readable
 *   `<small><kbd>Esc</kbd> return to menu</small>` content — exactly the
 *   same regression Phase 32 fixed in the Menu screen. SR users heard
 *   only "Keyboard shortcuts" and never learned the actual ESC shortcut.
 *   Phase 34 removes the aria-label so SR users now hear the full hint
 *   content. The visible `<kbd>` element is untouched.
 *
 * - `ResultScreen` mastery-bar `role="progressbar"`: the only place where
 *   the user's overall mastery % lives is inside a 0%-width styled `<div>`
 *   with `style={{ width: 0% }}`. The visible `%` label inside the fill
 *   collapses to nothing when the bar is 0% wide, and SR users get ZERO
 *   audible feedback about mastery progress. Phase 34 wraps the bar in
 *   `role="progressbar"` + `aria-valuenow` + `aria-valuemin` (0) +
 *   `aria-valuemax` (100) + `aria-label="Learning progress: N percent"`
 *   so SR users hear the same number sighted users see. The visible
 *   `mastery-bar__label` gets `aria-hidden="true"` so it isn't
 *   double-announced on top of the progressbar label.
 *
 * - `LearnScreen` kbd-hint SR-regression fix: same problem as the Menu
 *   and ResultScreen kbd-hints — the `<p className="learn-screen__kbd-hint">`
 *   carried `aria-label="Keyboard shortcuts"` which OVERRODE the
 *   readable `<kbd>Enter</kbd> start stage · <kbd>Esc</kbd> back to menu`
 *   content. Phase 34 removes the aria-label so SR users hear the full
 *   hint content. Mirrors the Phase 32 Menu fix exactly.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/
 * 26/27/28/29/30/31/32/33).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ResultScreen } from '../../src/ui/ResultScreen.js';
import { LearnScreen } from '../../src/ui/LearnScreen.js';
import { SAMPLE_STAGES } from '../../src/data/stages.js';

const here = dirname(fileURLToPath(import.meta.url));
const resultScreenSrc = readFileSync(
  resolve(here, '../../src/ui/ResultScreen.tsx'),
  'utf-8'
);
const learnScreenSrc = readFileSync(
  resolve(here, '../../src/ui/LearnScreen.tsx'),
  'utf-8'
);

// Install localStorage polyfill for jsdom (matches Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31/32/33 pattern).
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

beforeEach(() => {
  localStorage.clear();
});

// ============================================================================
// ResultScreen — kbd-hint SR-regression fix
// ============================================================================

describe('Phase 34 — ResultScreen kbd-hint no longer overrides <kbd> content', () => {
  it('ResultScreen source REMOVED the aria-label="Keyboard shortcuts" on result-kbd-hint', () => {
    // The previous aria-label OVERRODE the readable <small><kbd>Esc</kbd>
    // content — a real SR regression. SR users heard only "Keyboard
    // shortcuts" and never learned the actual ESC shortcut. Phase 32
    // fixed the same bug on the Menu screen; Phase 34 closes the same
    // hole on the ResultScreen.
    const kbdHintBlock = resultScreenSrc.match(
      /className="result-kbd-hint"[\s\S]*?<\/p>/
    );
    expect(kbdHintBlock).not.toBeNull();
    expect(kbdHintBlock![0]).not.toMatch(/aria-label="Keyboard shortcuts"/);
  });

  it('ResultScreen kbd-hint still preserves the <kbd>Esc</kbd> return to menu text', () => {
    // Regression guard: removing the aria-label must not accidentally
    // remove the visible hint content — SR users + sighted users both
    // need to know that Esc returns to the menu.
    const kbdHintBlock = resultScreenSrc.match(
      /className="result-kbd-hint"[\s\S]*?<\/p>/
    );
    expect(kbdHintBlock).not.toBeNull();
    expect(kbdHintBlock![0]).toMatch(/<kbd>Esc<\/[^>]+>\s+return to menu/);
  });

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
    // ResultScreen output.
    expect(html).not.toContain('aria-label="Keyboard shortcuts"');
  });
});

// ============================================================================
// ResultScreen — mastery-bar role="progressbar"
// ============================================================================

describe('Phase 34 — ResultScreen mastery-bar exposes role="progressbar"', () => {
  it('mastery-bar container has role="progressbar" so SR users hear mastery %', () => {
    // Matches the WAI-ARIA progressbar pattern: role + aria-valuenow +
    // aria-valuemin + aria-valuemax + aria-label. The .mastery-bar wrapper
    // div is the canvas that holds the fill; it gets the role so SR
    // users hear the full bar's accessible name on entry.
    expect(resultScreenSrc).toMatch(
      /className="mastery-bar"[\s\S]{0,500}role="progressbar"/
    );
  });

  it('mastery-bar exposes aria-valuenow tied to overallMastery', () => {
    // aria-valuenow must be a number (0-100) so SR users hear the
    // progress value. Bundled with min/max for the full progressbar
    // contract.
    expect(resultScreenSrc).toMatch(/aria-valuenow=\{overallMastery\}/);
    expect(resultScreenSrc).toMatch(/aria-valuemin=\{0\}/);
    expect(resultScreenSrc).toMatch(/aria-valuemax=\{100\}/);
  });

  it('mastery-bar exposes an aria-label announcing the mastery %', () => {
    // The aria-label string must include the dynamic mastery % so SR
    // users hear the same number sighted users see inside the bar.
    expect(resultScreenSrc).toMatch(
      /aria-label=\{`Learning progress: \$\{overallMastery\} percent`\}/
    );
  });

  it('mastery-bar__label is aria-hidden so it is not double-announced', () => {
    // The visible `${overallMastery}%` label inside the bar is purely
    // decorative now that the wrapper has role="progressbar" + aria-
    // valuenow + aria-label. Without aria-hidden, SR users would hear
    // "Learning progress: 25 percent. 25 percent." — a real SR spam
    // risk. The aria-hidden prevents the duplication.
    expect(resultScreenSrc).toMatch(
      /className="mastery-bar__label"\s+aria-hidden="true"/
    );
  });

  it('ResultScreen renders the mastery-bar with role="progressbar" (renderToStaticMarkup smoke)', () => {
    const html = renderToStaticMarkup(
      <ResultScreen
        score={100}
        enemiesDefeated={5}
        missions={[]}
        results={[]}
        onBack={() => {}}
      />
    );
    expect(html).toMatch(/role="progressbar"/);
    expect(html).toMatch(/aria-valuenow="0"/);
    expect(html).toMatch(/aria-valuemin="0"/);
    expect(html).toMatch(/aria-valuemax="100"/);
    expect(html).toMatch(/aria-label="Learning progress: 0 percent"/);
  });
});

// ============================================================================
// LearnScreen — kbd-hint SR-regression fix
// ============================================================================

describe('Phase 34 — LearnScreen kbd-hint no longer overrides <kbd> content', () => {
  it('LearnScreen source REMOVED the aria-label="Keyboard shortcuts" on learn-screen__kbd-hint', () => {
    // Same regression as the Menu + ResultScreen kbd-hints. The previous
    // aria-label OVERRODE the readable <kbd>Enter</kbd> · <kbd>Esc</kbd>
    // content — SR users heard only "Keyboard shortcuts" and never learned
    // the actual Start / Back shortcuts. Phase 34 closes the bug.
    const kbdHintBlock = learnScreenSrc.match(
      /className="learn-screen__kbd-hint"[\s\S]*?<\/p>/
    );
    expect(kbdHintBlock).not.toBeNull();
    expect(kbdHintBlock![0]).not.toMatch(/aria-label="Keyboard shortcuts"/);
  });

  it('LearnScreen kbd-hint still preserves the <kbd>Enter</kbd> · <kbd>Esc</kbd> text', () => {
    // Regression guard: removing the aria-label must not accidentally
    // remove the visible hint content.
    const kbdHintBlock = learnScreenSrc.match(
      /className="learn-screen__kbd-hint"[\s\S]*?<\/p>/
    );
    expect(kbdHintBlock).not.toBeNull();
    expect(kbdHintBlock![0]).toMatch(/<kbd>Enter<\/[^>]+>\s+start stage/);
    expect(kbdHintBlock![0]).toMatch(/<kbd>Esc<\/[^>]+>\s+back to menu/);
  });

  it('LearnScreen renders the <kbd>Enter</kbd>/<kbd>Esc</kbd> hint footer (renderToStaticMarkup smoke)', () => {
    const stage = SAMPLE_STAGES[0]!;
    const html = renderToStaticMarkup(
      <LearnScreen
        stage={stage}
        enemies={[]}
        onStart={() => {}}
        onBack={() => {}}
      />
    );
    expect(html).toMatch(/<kbd>Enter<\/kbd>/);
    expect(html).toMatch(/<kbd>Esc<\/kbd>/);
    // The bogus aria-label should NOT be present anywhere in the
    // LearnScreen output.
    expect(html).not.toContain('aria-label="Keyboard shortcuts"');
  });
});

// ============================================================================
// Regression guards — Phase 33 + Phase 32 contracts preserved
// ============================================================================

describe('Phase 34 — regression guards (Phase 33 + Phase 32 contracts preserved)', () => {
  it('Phase 33 StageScreen caps-lock-warning-sr live region still wired', () => {
    // Re-read the StageScreen source so we assert Phase 33's wiring
    // still exists alongside the new Phase 34 mastery-bar progressbar.
    const stageScreenSrc = readFileSync(
      resolve(here, '../../src/ui/StageScreen.tsx'),
      'utf-8'
    );
    expect(stageScreenSrc).toMatch(/className="caps-lock-warning-sr"/);
    expect(stageScreenSrc).toMatch(
      /role=\{capsLockWarning\s*\?\s*['"]alert['"]\s*:\s*undefined\}/
    );
  });

  it('Phase 32 Menu kbd-hint still has no aria-label="Keyboard shortcuts"', () => {
    // The Phase 32 fix in Menu.tsx must remain in place — no relapses.
    const menuSrc = readFileSync(
      resolve(here, '../../src/ui/Menu.tsx'),
      'utf-8'
    );
    const kbdHintBlock = menuSrc.match(/className="menu-kbd-hint"[\s\S]*?<\/p>/);
    expect(kbdHintBlock).not.toBeNull();
    expect(kbdHintBlock![0]).not.toMatch(/aria-label="Keyboard shortcuts"/);
  });

  it('Phase 32 visually-hidden utility still in style.css (no removal)', () => {
    // The .visually-hidden utility is what the Phase 32 pattern uses
    // to expose hidden content to SR while keeping it visually hidden.
    // Both the Phase 32 Tutorial hidden H1s and any future
    // visually-hidden content share this rule.
    const styleCssSrc = readFileSync(
      resolve(here, '../../src/style.css'),
      'utf-8'
    );
    expect(styleCssSrc).toMatch(/\.visually-hidden\s*\{/);
  });
});
