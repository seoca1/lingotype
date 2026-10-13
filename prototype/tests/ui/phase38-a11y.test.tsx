/**
 * Phase 38 — Final polish + accessibility tests (Slice 4 port).
 *
 * Covers three Phase 38 improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31/32/33/34/35/36/37:
 *
 * - `VirtualKeyboard` key `:focus-visible`: a 2px cyan outline + 2px
 *   offset rule on `.virtual-keyboard .key`.
 * - `OllamaTest` aria-label + focus-visible: id/htmlFor + aria-label on
 *   the prompt textarea, aria-label on all 3 buttons, role="status" +
 *   aria-live on the connection indicator + loading line, role="region"
 *   on the response block, role="group" wrappers, and an inline
 *   `:focus-visible` rule.
 * - `Menu` tier-hint `role="note"` + `aria-label`.
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase38-a11y.test.tsx`:
 *   - The Menu tier-hint visible-text assertion matches the local
 *     hardcoded copy (`✨ 시작 단계`) rather than the remote i18n call.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { VirtualKeyboard } from '../../src/ui/VirtualKeyboard.js';
import { Menu } from '../../src/ui/Menu.js';
import type { StageRecord } from '../../src/types.js';

const here = dirname(fileURLToPath(import.meta.url));
const virtualKeyboardSrc = readFileSync(
  resolve(here, '../../src/ui/VirtualKeyboard.tsx'),
  'utf-8'
);
const ollamaTestSrc = readFileSync(
  resolve(here, '../../src/ui/OllamaTest.tsx'),
  'utf-8'
);
const menuSrc = readFileSync(resolve(here, '../../src/ui/Menu.tsx'), 'utf-8');

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

beforeEach(() => {
  localStorage.clear();
});

// ============================================================================
// VirtualKeyboard — key :focus-visible rule (UX gap closure)
// ============================================================================

describe('Phase 38 — VirtualKeyboard key :focus-visible rule', () => {
  it('source declares a .virtual-keyboard .key:focus-visible rule with a 2px cyan outline', () => {
    expect(virtualKeyboardSrc).toMatch(
      /\.virtual-keyboard\s+\.key:focus-visible\s*\{[^}]*outline:\s*2px solid #00d9ff/,
    );
  });

  it('uses 2px outline-offset matching the Phase 14/19 convention', () => {
    expect(virtualKeyboardSrc).toMatch(
      /\.virtual-keyboard\s+\.key:focus-visible\s*\{[^}]*outline-offset:\s*2px/,
    );
  });

  it('source ships a phase-38 anchor comment for the focus-visible block', () => {
    expect(virtualKeyboardSrc).toMatch(/Phase 38/);
  });

  it('VirtualKeyboard renders without throwing (smoke)', () => {
    const html = renderToStaticMarkup(
      <VirtualKeyboard language="en" onKeyPress={() => {}} />
    );
    expect(html).toContain('virtual-keyboard');
  });

  it('VirtualKeyboard still preserves Phase 25 aria-label per key (regression guard)', () => {
    const html = renderToStaticMarkup(
      <VirtualKeyboard language="en" expectedChar="q" onKeyPress={() => {}} />
    );
    expect(html).toMatch(/aria-label="key q, expected next"/);
  });
});

// ============================================================================
// OllamaTest — aria-label + focus-visible (a11y gap closure)
// ============================================================================

describe('Phase 38 — OllamaTest aria-label + focus-visible (a11y gap closure)', () => {
  it('prompt textarea source wires id="ollama-test-prompt" + aria-label="Prompt input"', () => {
    expect(ollamaTestSrc).toMatch(/id="ollama-test-prompt"/);
    expect(ollamaTestSrc).toMatch(/aria-label="Prompt input"/);
  });

  it('prompt textarea source has a programmatic <label htmlFor="ollama-test-prompt">', () => {
    expect(ollamaTestSrc).toMatch(/<label htmlFor="ollama-test-prompt">/);
  });

  it('Test Connection button source exposes aria-label="Test Ollama connection"', () => {
    expect(ollamaTestSrc).toMatch(/aria-label="Test Ollama connection"/);
  });

  it('both Generate buttons source expose action-describing aria-label', () => {
    expect(ollamaTestSrc).toMatch(/aria-label="Generate response \(non-streaming\)"/);
    expect(ollamaTestSrc).toMatch(/aria-label="Generate response \(streaming\)"/);
  });

  it('connection indicator source wires role="status" + aria-live="polite"', () => {
    expect(ollamaTestSrc).toMatch(/role="status"/);
    expect(ollamaTestSrc).toMatch(/aria-live="polite"/);
  });

  it('loading line source wires role="status" + aria-live="polite" so SR users hear when generation starts', () => {
    expect(ollamaTestSrc).toMatch(/<p role="status" aria-live="polite">\s*Generating/);
  });

  it('response block source wires role="region" + aria-live="polite" + aria-label', () => {
    expect(ollamaTestSrc).toMatch(/role="region"/);
    expect(ollamaTestSrc).toMatch(/aria-label="Ollama response"/);
  });

  it('source ships an inline :focus-visible rule covering buttons + textarea', () => {
    expect(ollamaTestSrc).toMatch(/div button:focus-visible/);
    expect(ollamaTestSrc).toMatch(/div textarea:focus-visible/);
  });

  it('source wires role="group" wrappers around action groups (connection + generation)', () => {
    expect(ollamaTestSrc).toMatch(/role="group"[^}]*aria-label="Connection test"/);
    expect(ollamaTestSrc).toMatch(/role="group"[^}]*aria-label="Generation actions"/);
  });

  it('source ships a phase-38 anchor comment for the a11y block', () => {
    expect(ollamaTestSrc).toMatch(/Phase 38/);
  });
});

// ============================================================================
// Menu — tier-hint role="note" + aria-label (SR-regression fix)
// ============================================================================

describe('Phase 38 — Menu tier-hint role="note" + aria-label (SR-regression fix)', () => {
  it('Menu source wraps the tier-1 hint <p> in role="note"', () => {
    expect(menuSrc).toMatch(
      /<p[\s\S]*?className="tier-hint tier-hint-auto"[\s\S]*?role="note"[\s\S]*?aria-label="Tier 1 unlock note"/,
    );
  });

  it('Menu source keeps the visible ✨ glyph + tier-hint-auto class (regression guard)', () => {
    expect(menuSrc).toMatch(/✨ 시작 단계/);
    expect(menuSrc).toMatch(/className="tier-hint tier-hint-auto"/);
  });

  it('Menu source ships a phase-38 anchor comment for the role="note" wrap', () => {
    expect(menuSrc).toMatch(/Phase 38/);
  });

  it('Menu still ships Phase 32 tier region aria-labelledby (regression guard)', () => {
    expect(menuSrc).toMatch(/aria-labelledby=\{`tier-title-\$\{tier\}`\}/);
    expect(menuSrc).toMatch(/aria-labelledby="tier-title-0"/);
  });

  it('Menu renders the EN tier grid without throwing (smoke)', () => {
    const stageRecords: Record<string, StageRecord> = {};
    const html = renderToStaticMarkup(
      <Menu
        language="en"
        onStartStage={() => {}}
        onShowCharacterSelect={() => {}}
        onBackToLanguageSelect={() => {}}
        onShowSettings={() => {}}
        onShowOptions={() => {}}
        stageRecords={stageRecords}
      />
    );
    expect(html).toContain('menu');
    expect(html).toContain('tier-hint tier-hint-auto');
  });
});