/**
 * Phase 27 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26:
 *
 * - `ResultScreen` region landmark: the outer wrapper now exposes
 *   `role="region"` + `aria-labelledby="result-screen-title"`, and the
 *   page H1 carries `id="result-screen-title"`. Previously the wrapper
 *   was a plain div with no landmark semantics, so SR users navigating
 *   by landmarks couldn't jump straight to the result region, and there
 *   was no programmatic association between the H1 and the screen.
 *
 * - `ResultScreen` mission rows: per-row `role="status"` was removed.
 *   With 3+ missions rendering simultaneously it caused a burst of
 *   simultaneous SR announcements on mount. The `aria-label` is kept
 *   so SR users still hear cleared/failed when they tab into the row.
 *
 * - `LanguageSelection` arrow-key focus tracking: the arrow-key handler
 *   now also calls `.focus()` on the corresponding card via a ref array,
 *   so DOM focus follows the visual highlight. Previously state moved
 *   but DOM focus stayed put, so SR users pressing arrows heard stale
 *   content. The grid wrapper also exposes `role="grid"` + an accessible
 *   name, matching the Phase 25 keyboard-warning group pattern.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/26).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ResultScreen } from '../../src/ui/ResultScreen.js';
import { LanguageSelection } from '../../src/ui/LanguageSelection.js';
import type { MissionConfig } from '../../src/types.js';

const here = dirname(fileURLToPath(import.meta.url));
const languageSrc = readFileSync(
  resolve(here, '../../src/ui/LanguageSelection.tsx'),
  'utf-8'
);

// Install localStorage polyfill for jsdom (matches Phase 14/17/19/20/21/22/23/24/25/26 pattern).
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

// Stub window.speechSynthesis (used by ResultScreen audio cues + TtsButton paths).
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
// ResultScreen — region landmark + labelledby wiring
// ============================================================================

const sampleMissions: MissionConfig[] = [
  {
    id: 'm1',
    name: 'Mission One',
    description: 'desc one',
    type: 'defeat_count',
    params: { count: 5 },
  },
  {
    id: 'm2',
    name: 'Mission Two',
    description: 'desc two',
    type: 'accuracy_threshold',
    params: { threshold: 90 },
  },
];
const sampleResults = [
  { missionId: 'm1', cleared: true },
  { missionId: 'm2', cleared: false },
];

describe('Phase 27 — ResultScreen wrapper exposes region landmark + labelledby', () => {
  it('outer div carries role="region" tied to the H1 via aria-labelledby', () => {
    const html = renderToStaticMarkup(
      <ResultScreen
        score={100}
        enemiesDefeated={5}
        missions={sampleMissions}
        results={sampleResults}
        onBack={() => {}}
      />
    );
    expect(html).toMatch(
      /<div[^>]*class="result-screen"[^>]*role="region"[^>]*aria-labelledby="result-screen-title"/
    );
  });

  it('h1 carries the matching id so aria-labelledby resolves', () => {
    const html = renderToStaticMarkup(
      <ResultScreen
        score={100}
        enemiesDefeated={5}
        missions={sampleMissions}
        results={sampleResults}
        onBack={() => {}}
      />
    );
    expect(html).toMatch(/<h1 id="result-screen-title">Stage Result<\/h1>/);
  });
});

// ============================================================================
// ResultScreen — mission rows no longer use per-row role="status"
// ============================================================================

describe('Phase 27 — ResultScreen mission rows drop redundant role="status"', () => {
  it('mission rows render without role="status" (was announcement noise)', () => {
    const html = renderToStaticMarkup(
      <ResultScreen
        score={100}
        enemiesDefeated={5}
        missions={sampleMissions}
        results={sampleResults}
        onBack={() => {}}
      />
    );
    // The mission-result div must NOT carry role="status"
    const missionDivs = html.match(/<div[^>]*class="mission-result[^"]*"[^>]*>/g) || [];
    expect(missionDivs.length).toBeGreaterThanOrEqual(2);
    for (const div of missionDivs) {
      expect(div).not.toMatch(/role="status"/);
    }
  });

  it('mission rows keep aria-label naming cleared vs failed', () => {
    const html = renderToStaticMarkup(
      <ResultScreen
        score={100}
        enemiesDefeated={5}
        missions={sampleMissions}
        results={sampleResults}
        onBack={() => {}}
      />
    );
    expect(html).toMatch(/aria-label="Mission One: cleared"/);
    expect(html).toMatch(/aria-label="Mission Two: failed"/);
  });

  it('visual cleared/failed glyphs remain aria-hidden', () => {
    const html = renderToStaticMarkup(
      <ResultScreen
        score={100}
        enemiesDefeated={5}
        missions={sampleMissions}
        results={sampleResults}
        onBack={() => {}}
      />
    );
    expect(html).toMatch(/<span aria-hidden="true">✓<\/span>/);
    expect(html).toMatch(/<span aria-hidden="true">✗<\/span>/);
  });
});

// ============================================================================
// LanguageSelection — arrow-key DOM focus tracking + grid landmark
// ============================================================================

describe('Phase 27 — LanguageSelection arrow keys move DOM focus + grid landmark', () => {
  it('grid wrapper exposes role="grid" + accessible name', () => {
    const html = renderToStaticMarkup(
      <LanguageSelection onSelectLanguage={() => {}} />
    );
    expect(html).toMatch(
      /<div[^>]*class="language-grid"[^>]*role="grid"[^>]*aria-label="Available languages"/
    );
  });

  it('arrow-key handler source wires focus() alongside setSelectedIndex', () => {
    // cardRefs.current[next]?.focus() must be paired with setSelectedIndex
    // so DOM focus follows the visual highlight.
    expect(languageSrc).toMatch(/cardRefs\.current\[next\]\?\.focus\(\)/);
    expect(languageSrc).toMatch(/setSelectedIndex\(next\)/);
  });

  it('each language card mounts a ref callback to populate cardRefs', () => {
    expect(languageSrc).toMatch(/cardRefs\.current\[i\]\s*=\s*el/);
  });

  it('arrow keys call e.preventDefault to avoid scrolling the page', () => {
    // Arrow keys on the language grid would otherwise scroll the viewport.
    // The handler now prevents default for Arrow* keys.
    expect(languageSrc).toMatch(/e\.preventDefault\(\)/);
  });

  it('Enter and Space call onSelectLanguage for the currently selected card', () => {
    // Code reads `const lang = languages[selectedIndex]; onSelectLanguage(lang.code)`
    expect(languageSrc).toMatch(/onSelectLanguage\(lang\.code\)/);
    expect(languageSrc).toMatch(/languages\[selectedIndex\]/);
  });
});
