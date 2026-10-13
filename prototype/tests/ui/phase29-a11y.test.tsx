/**
 * Phase 29 — Final polish + accessibility tests (Slice 4 port).
 *
 * Covers three Phase 29 improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28:
 *
 * - `Menu` arrow-key focus tracking: the arrow-key handler calls
 *   `.focus()` on the corresponding stage card via a `cardRefs` ref array
 *   so DOM focus follows the visual highlight, and calls
 *   `e.preventDefault()` so arrows don't scroll the viewport.
 * - `style.css` `.stage-card:focus-visible`: 2px cyan outline + 3px offset.
 * - `EnemyTooltip` close-button focus-visible: 2px cyan outline.
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase29-a11y.test.tsx`.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Menu } from '../../src/ui/Menu.js';
import { EnemyTooltip } from '../../src/ui/EnemyTooltip.js';
import type { Target } from '../../src/types.js';

const here = dirname(fileURLToPath(import.meta.url));
const menuSrc = readFileSync(resolve(here, '../../src/ui/Menu.tsx'), 'utf-8');
const enemyTooltipSrc = readFileSync(
  resolve(here, '../../src/ui/EnemyTooltip.tsx'),
  'utf-8'
);
const styleCss = readFileSync(resolve(here, '../../src/style.css'), 'utf-8');

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

// Stub window.speechSynthesis (used by tooltip TTS path).
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
// Menu — arrow-key DOM focus tracking
// ============================================================================

describe('Phase 29 — Menu arrow-key handler moves DOM focus alongside state', () => {
  it('menu source wires a cardRefs ref array via useRef', () => {
    expect(menuSrc).toMatch(/const\s+cardRefs\s*=\s*useRef<\(HTMLButtonElement\s*\|\s*null\)\[\]>\(\[\]\)/);
  });

  it('menu source wires a setCardRef factory that takes an index', () => {
    expect(menuSrc).toMatch(/const\s+setCardRef\s*=\s*useCallback\(\s*\(\s*index:\s*number\s*\)/);
  });

  it('arrow-key handler calls .focus() on the new index after setSelectedIndex', () => {
    expect(menuSrc).toMatch(/setSelectedIndex\(newIndex\)[\s\S]{0,200}cardRefs\.current\[newIndex\]\?\.focus\(\)/);
  });

  it('arrow-key handler calls e.preventDefault() so arrows do not scroll the page', () => {
    expect(menuSrc).toMatch(/e\.preventDefault\(\)/);
  });

  it('every StageCard mount wires a setRef={setCardRef(...)} prop', () => {
    expect(menuSrc).toMatch(/setRef=\{setCardRef\(i\)\}/);
    expect(menuSrc).toMatch(/setRef=\{setCardRef\(globalIndex\)\}/);
  });
});

// ============================================================================
// Menu — StageCard exposes ref-setter prop
// ============================================================================

describe('Phase 29 — StageCard accepts a setRef prop', () => {
  it('StageCard prop type includes an optional setRef field', () => {
    expect(menuSrc).toMatch(/setRef\?:\s*\(el:\s*HTMLButtonElement\s*\|\s*null\)\s*=>\s*void/);
  });

  it('StageCard ref attribute is bound to setRef', () => {
    expect(menuSrc).toMatch(/<button\s+ref=\{setRef\}/);
  });
});

// ============================================================================
// Menu — renderToStaticMarkup smoke (no regressions)
// ============================================================================

describe('Phase 29 — Menu renders without throwing + cards still mount', () => {
  const smokeProps = {
    language: 'en' as const,
    onStartStage: () => {},
    onShowCharacterSelect: () => {},
    onBackToLanguageSelect: () => {},
  };

  it('renders the Menu without crashing', () => {
    expect(() => renderToStaticMarkup(<Menu {...smokeProps} />)).not.toThrow();
  });

  it('renders at least one stage-card button', () => {
    const html = renderToStaticMarkup(<Menu {...smokeProps} />);
    const cards = html.match(/class="stage-card[^"]*"/g);
    expect(cards).not.toBeNull();
    expect(cards!.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// style.css — .stage-card:focus-visible rule
// ============================================================================

describe('Phase 29 — style.css ships :focus-visible rule for .stage-card', () => {
  it('declares .stage-card:focus-visible with a 2px cyan outline', () => {
    expect(styleCss).toMatch(/\.stage-card:focus-visible\s*\{[^}]*outline:\s*2px\s+solid\s+#00d9ff/);
  });

  it('uses a 3px outline-offset matching the .language-card Phase 27 rule', () => {
    expect(styleCss).toMatch(/\.stage-card:focus-visible\s*\{[^}]*outline-offset:\s*3px/);
  });

  it('Phase 29 block carries a phase-anchor comment', () => {
    expect(styleCss).toMatch(/Phase 29:[\s\S]{0,800}\.stage-card:focus-visible/);
  });
});

// ============================================================================
// EnemyTooltip — close-button :focus-visible rule (inline style block)
// ============================================================================

describe('Phase 29 — EnemyTooltip close button exposes :focus-visible ring', () => {
  const target: Target = {
    text: 'bonjour',
    acceptedInputs: ['bonjour'],
    meaning: 'hello',
    category: 'greeting',
    level: 1,
  };

  it('renders the close button with the (Escape) aria-label preserved from Phase 25', () => {
    const html = renderToStaticMarkup(
      <EnemyTooltip
        target={target}
        x={100}
        y={100}
        language="en"
        onTtsPlay={() => {}}
        onClose={() => {}}
      />
    );
    expect(html).toMatch(/aria-label="[^"]*\(Escape\)"/);
  });

  it('EnemyTooltip source wires .enemy-tooltip__close:focus-visible rule', () => {
    expect(enemyTooltipSrc).toMatch(/\.enemy-tooltip__close:focus-visible\s*\{/);
  });

  it('.enemy-tooltip__close:focus-visible uses the 2px cyan outline pattern', () => {
    expect(enemyTooltipSrc).toMatch(
      /\.enemy-tooltip__close:focus-visible\s*\{[^}]*outline:\s*2px\s+solid\s+#00d9ff/
    );
  });
});