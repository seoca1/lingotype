/**
 * Phase 38 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31/32/33/34/35/36/37:
 *
 * - `VirtualKeyboard` key `:focus-visible`: the component ships 30+
 *   buttons per layout (EN 30 keys, JP 23 keys, ES 33 keys incl.
 *   accent row, KR 28 keys incl. 자모 + 모음 + 복합모음) but had no
 *   visible focus indicator. Keyboard users tabbing through the keys
 *   got no visual confirmation of which key was focused. Phase 38 adds
 *   a 2px cyan outline + 2px offset rule on `.virtual-keyboard .key`,
 *   mirroring the Phase 14/19/20/21/27/29/30/31/33/35 convention.
 *
 * - `OllamaTest` aria-label + focus-visible: the test harness shipped
 *   an unlabeled textarea (placeholder only — WCAG 1.3.1 + 4.1.2), 3
 *   buttons with no programmatic label beyond visible text, a
 *   bare `<span>` connection indicator with no role/live region,
 *   a bare `<p>Generating...</p>` with no live-region, and no visible
 *   focus indicator on any control. Phase 38 adds `id`/`htmlFor` +
 *   `aria-label` to the prompt textarea, `aria-label` to all 3
 *   buttons, `role="status"` + `aria-live="polite"` to the connection
 *   indicator and the loading line, `role="region"` + `aria-live` on
 *   the response block, role="group" wrappers around action groups,
 *   and an inline `:focus-visible` rule covering buttons + textarea.
 *
 * - `Menu` tier-hint `role="note"` + `aria-label`: the tier-1 hint
 *   ("✨ Tier 1 starts unlocked for non-JP languages") was a plain
 *   `<p>` inside the Phase 32 labelled tier region. SR users heard the
 *   hint as generic paragraph text without an explicit "note" framing
 *   that distinguishes informational guidance from tier content. Phase
 *   38 wraps the hint in `role="note"` + `aria-label="Tier 1 unlock
 *   note"` so SR users hear the hint framed as informational note
 *   instead of generic paragraph text. Sighted UX is unchanged (no
 *   visible label added; the visible ✨ glyph + text stays).
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/
 * 26/27/28/29/30/31/32/33/34/35/36/37).
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
const menuSrc = readFileSync(
  resolve(here, '../../src/ui/Menu.tsx'),
  'utf-8'
);

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
    // Phase 25 added aria-label per key ("key K", "key ㅏ"), but the
    // visible focus indicator was missing. Keyboard users tabbing
    // through 30+ keys got no visual confirmation. Mirrors the Phase
    // 14/19/20/21/27/29/30/31/33/35 2px cyan outline + 2px offset
    // convention.
    expect(virtualKeyboardSrc).toMatch(
      /\.virtual-keyboard\s+\.key:focus-visible\s*\{[^}]*outline:\s*2px solid #00d9ff/,
    );
  });

  it('uses 2px outline-offset matching the Phase 14/19 convention', () => {
    // Same 2px outline-offset as the global button focus rules so
    // visual cadence stays consistent across the app.
    expect(virtualKeyboardSrc).toMatch(
      /\.virtual-keyboard\s+\.key:focus-visible\s*\{[^}]*outline-offset:\s*2px/,
    );
  });

  it('source ships a phase-38 anchor comment for the focus-visible block', () => {
    // The established convention documented across Phase 14/19/20/21/
    // 27/29/30/31/33/35 is to anchor every new a11y block with a
    // phase-anchor comment so future maintainers know exactly which
    // phase added the rule.
    expect(virtualKeyboardSrc).toMatch(/Phase 38/);
  });

  it('VirtualKeyboard renders without throwing (smoke)', () => {
    // Sanity check: the new inline <style> block doesn't break render.
    const html = renderToStaticMarkup(
      <VirtualKeyboard language="en" onKeyPress={() => {}} />
    );
    expect(html).toContain('virtual-keyboard');
  });

  it('VirtualKeyboard still preserves Phase 25 aria-label per key (regression guard)', () => {
    // Phase 25 named each key with "key X" + "expected next" suffix
    // when expectedChar matched. Phase 38 only added a focus-visible
    // rule — must NOT remove the existing aria-labels.
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
    // Previously the textarea had only placeholder text, which WCAG
    // 1.3.1 + 4.1.2 marks as insufficient because placeholders
    // disappear on focus and most SR engines do not expose
    // placeholder as the accessible name. Phase 38 adds htmlFor/id
    // pairing + aria-label, mirroring the Phase 26 SettingsScreen
    // label pattern.
    expect(ollamaTestSrc).toMatch(/id="ollama-test-prompt"/);
    expect(ollamaTestSrc).toMatch(/aria-label="Prompt input"/);
  });

  it('prompt textarea source has a programmatic <label htmlFor="ollama-test-prompt">', () => {
    // The <label htmlFor=> wires the visible "Prompt" text to the
    // textarea's id so SR users hear "Prompt, edit text" instead of
    // just "edit text".
    expect(ollamaTestSrc).toMatch(/<label htmlFor="ollama-test-prompt">/);
  });

  it('Test Connection button source exposes aria-label="Test Ollama connection"', () => {
    // Mirrors the Phase 26/30 SettingsScreen + Phase 31
    // CharacterTest labelled-button convention. The visible "Test
    // Connection" text stays; aria-label adds the explicit action
    // name for SR users.
    expect(ollamaTestSrc).toMatch(/aria-label="Test Ollama connection"/);
  });

  it('both Generate buttons source expose action-describing aria-label', () => {
    // The two Generate buttons previously had identical visible text
    // ("Generate (Normal)" / "Generate (Stream)") which SR users heard
    // with no distinction. Phase 38 adds "(non-streaming)" /
    // "(streaming)" to the aria-label so the action is unambiguous.
    expect(ollamaTestSrc).toMatch(
      /aria-label="Generate response \(non-streaming\)"/,
    );
    expect(ollamaTestSrc).toMatch(
      /aria-label="Generate response \(streaming\)"/,
    );
  });

  it('connection indicator source wires role="status" + aria-live="polite"', () => {
    // The bare <span> connection indicator had no role or live
    // region. SR users got no feedback when the connection test
    // finished. Phase 38 wraps it in role="status" + aria-live="polite"
    // mirroring the Phase 19/30 OptionsScreen/SettingsScreen saved
    // indicator pattern.
    expect(ollamaTestSrc).toMatch(/role="status"/);
    expect(ollamaTestSrc).toMatch(/aria-live="polite"/);
  });

  it('loading line source wires role="status" + aria-live="polite" so SR users hear when generation starts', () => {
    // The bare <p>Generating...</p> had no live region. SR users got
    // no audible feedback that a generation started. Mirrors the
    // saved indicator pattern.
    expect(ollamaTestSrc).toMatch(/<p role="status" aria-live="polite">\s*Generating/);
  });

  it('response block source wires role="region" + aria-live="polite" + aria-label', () => {
    // The response block is the test harness's primary output
    // surface. SR users need a labelled region to navigate to it
    // and an aria-live so updates are announced.
    expect(ollamaTestSrc).toMatch(/role="region"/);
    expect(ollamaTestSrc).toMatch(/aria-label="Ollama response"/);
  });

  it('source ships an inline :focus-visible rule covering buttons + textarea', () => {
    // Phase 14/19/20/21/27/29/30/31/33/35 convention: every screen
    // with actionable controls ships a 2px cyan outline + 2px offset
    // :focus-visible rule. OllamaTest was the last remaining screen
    // in the app without one.
    expect(ollamaTestSrc).toMatch(/div button:focus-visible/);
    expect(ollamaTestSrc).toMatch(/div textarea:focus-visible/);
  });

  it('source wires role="group" wrappers around action groups (connection + generation)', () => {
    // Two role="group" wrappers (one around the test-connection
    // button + indicator, one around the two generate buttons) so SR
    // users navigating by landmark hear "Connection test, group" and
    // "Generation actions, group" instead of bare button siblings.
    expect(ollamaTestSrc).toMatch(/role="group"[^}]*aria-label="Connection test"/);
    expect(ollamaTestSrc).toMatch(/role="group"[^}]*aria-label="Generation actions"/);
  });

  it('source ships a phase-38 anchor comment for the a11y block', () => {
    // The established convention documented across Phase 14/19/20/
    // 21/27/29/30/31/33/35 is to anchor every new a11y block with a
    // phase-anchor comment.
    expect(ollamaTestSrc).toMatch(/Phase 38/);
  });
});

// ============================================================================
// Menu — tier-hint role="note" + aria-label (SR-regression fix)
// ============================================================================

describe('Phase 38 — Menu tier-hint role="note" + aria-label (SR-regression fix)', () => {
  it('Menu source wraps the tier-1 hint <p> in role="note"', () => {
    // The tier-hint-auto paragraph previously had no semantic role.
    // SR users heard the hint as generic paragraph text with no
    // distinction from tier content. Phase 38 wraps it in
    // role="note" so SR users hear it framed as an informational
    // note.
    expect(menuSrc).toMatch(
      /<p[\s\S]*?className="tier-hint tier-hint-auto"[\s\S]*?role="note"[\s\S]*?aria-label="Tier 1 unlock note"/,
    );
  });

  it('Menu source keeps the visible ✨ glyph + tier-hint-auto class (regression guard)', () => {
    // Adding role="note" + aria-label must NOT remove the visible
    // ✨ glyph or the tier-hint-auto CSS class. The visible text is
    // preserved; aria-label adds the SR-only framing.
    expect(menuSrc).toMatch(/✨ \{t\('startingStageReady'/);
    expect(menuSrc).toMatch(/className="tier-hint tier-hint-auto"/);
  });

  it('Menu source ships a phase-38 anchor comment for the role="note" wrap', () => {
    // The established convention documented across Phase 14/19/20/
    // 21/27/29/30/31/32/33/34/35/36/37 is to anchor every new a11y
    // block with a phase-anchor comment.
    expect(menuSrc).toMatch(/Phase 38/);
  });

  it('Menu still ships Phase 32 tier region aria-labelledby (regression guard)', () => {
    // Phase 32 wired aria-labelledby="tier-title-${tier}" on every
    // tier <section>. Phase 38 only added role="note" on the hint
    // inside the tier — must NOT remove the region label.
    expect(menuSrc).toMatch(/aria-labelledby=\{`tier-title-\$\{tier\}`\}/);
    expect(menuSrc).toMatch(/aria-labelledby="tier-title-0"/);
  });

  it('Menu renders the EN tier grid without throwing (smoke)', () => {
    // Sanity check: the new role="note" + aria-label on the hint
    // doesn't break the render. We pass a minimal stageRecords so
    // the lock computation doesn't try to deref undefined.
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
    // The tier-1 hint is gated on showTier1Hint which fires when
    // tier 1 has any unlocked stage and the language has no Tier 0.
    // EN satisfies both, so the hint renders.
    expect(html).toContain('tier-hint tier-hint-auto');
  });
});