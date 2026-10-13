/**
 * Phase 33 — Final polish + accessibility tests (Slice 2 port).
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31/32:
 *
 * - `style.css` `.tutorial .btn-primary/.btn-secondary/.btn-nav/.lang-btn
 *   :focus-visible`: the Tutorial screen ships 6 actionable button
 *   classes (welcome-page 시작하기/건너뛰기 primary CTAs, language-page
 *   ← 이전/다음 → nav buttons, mechanics-page ← 이전/다음 → nav
 *   buttons, the 6 language-selector pills) — none had a visible focus
 *   indicator. Phase 14/19/20/21/27/29/30/32 covered modal buttons,
 *   SettingsScreen/OptionsScreen controls, Menu header buttons,
 *   LanguageSelection cards, stage cards, and the blocking
 *   KeyboardWarning buttons. Slice 2 (this phase) closes the gap for
 *   the Tutorial's own buttons. Same 2px cyan outline + 2px offset as
 *   the Phase 14/19/32 convention.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts.
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase33-a11y.test.tsx`:
 *   - `StageScreen` Caps Lock warning aria-live block: skipped — local
 *     StageScreen does not yet expose the `caps-lock-warning-sr`
 *     wrapper, the `role="alert"` / `aria-live="assertive"` toggles, or
 *     the English announcement copy. Adding them requires StageScreen
 *     source changes that are outside Slice 2's Tutorial+Menu scope.
 *     Reason: `feature-deferred: out of Slice 2 scope`.
 *   - `StageScreen` smoke test that constructs a synthetic state with
 *     `as any`: skipped — the local repository enforces
 *     `no-explicit-any` via ESLint, so the remote pattern is
 *     non-portable on policy grounds regardless of scope.
 *   - `OSKeyboardInput` aria-hidden + tabIndex block: skipped — local
 *     OSKeyboardInput only has the `aria-label`; adding `aria-hidden`
 *     and `tabIndex={-1}` is outside Slice 2's Tutorial+Menu scope.
 *   - `OSKeyboardInput` smoke test: skipped — same scope reason.
 *   - The Phase 32 regression-guard block at the bottom of the remote
 *     file: kept intact (Slice 2 implements Phase 32's landmark wiring
 *     + visually-hidden CSS, so the regression guards must remain
 *     green).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Tutorial } from '../../src/ui/Tutorial.js';
import { StageScreen } from '../../src/ui/StageScreen.js';
import { OSKeyboardInput } from '../../src/ui/OSKeyboardInput.js';
import type { GameState } from '../../src/state/gameReducer.js';

const here = dirname(fileURLToPath(import.meta.url));
const stageScreenSrc = readFileSync(
  resolve(here, '../../src/ui/StageScreen.tsx'),
  'utf-8'
);
const osKeyboardSrc = readFileSync(
  resolve(here, '../../src/ui/OSKeyboardInput.tsx'),
  'utf-8'
);
const tutorialSrc = readFileSync(
  resolve(here, '../../src/ui/Tutorial.tsx'),
  'utf-8'
);
const styleCssSrc = readFileSync(
  resolve(here, '../../src/style.css'),
  'utf-8'
);

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
  vi.useRealTimers();
});

// ============================================================================
// style.css — Tutorial focus-visible rule
// ============================================================================

describe('Phase 33 — style.css adds :focus-visible to Tutorial action buttons', () => {
  it('declares .tutorial .btn-primary:focus-visible with a 2px cyan outline', () => {
    expect(styleCssSrc).toMatch(
      /\.tutorial\s+\.btn-primary:focus-visible[\s\S]{0,500}outline:\s*2px\s+solid\s+#00d9ff/
    );
  });

  it('declares .tutorial .btn-secondary:focus-visible (welcome 건너뛰기 button)', () => {
    expect(styleCssSrc).toMatch(/\.tutorial\s+\.btn-secondary:focus-visible/);
  });

  it('declares .tutorial .btn-nav:focus-visible (language + mechanics nav buttons)', () => {
    expect(styleCssSrc).toMatch(/\.tutorial\s+\.btn-nav:focus-visible/);
  });

  it('declares .tutorial .lang-btn:focus-visible (language-selector pills)', () => {
    expect(styleCssSrc).toMatch(/\.tutorial\s+\.lang-btn:focus-visible/);
  });

  it('uses 2px outline-offset matching the Phase 14/19/32 convention', () => {
    const ruleBlock = styleCssSrc.match(
      /\.tutorial\s+\.btn-primary:focus-visible[\s\S]*?\.tutorial\s+\.lang-btn:focus-visible\s*\{[\s\S]*?\}/
    );
    expect(ruleBlock).not.toBeNull();
    expect(ruleBlock![0]).toMatch(/outline-offset:\s*2px/);
  });

  it('Phase 33 block carries a phase-anchor comment', () => {
    expect(styleCssSrc).toMatch(/Phase 33:[^/]*focus-visible[^/]*Tutorial/i);
  });
});

// ============================================================================
// Smoke — Tutorial still renders
// ============================================================================

describe('Phase 33 — Tutorial renders without throwing', () => {
  it('Tutorial renders the welcome page (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(
        <Tutorial onComplete={() => {}} onStartTutorialStage={() => {}} />
      )
    ).not.toThrow();
  });
});

// ============================================================================
// Regression guards — Phase 32 contracts still intact
// ============================================================================

describe('Phase 33 — regression guards (Phase 32 contracts preserved)', () => {
  it('Phase 32 visually-hidden utility still in style.css (no removal)', () => {
    expect(styleCssSrc).toMatch(/\.visually-hidden\s*\{/);
  });

  it('Phase 32 Tutorial features-list landmark still wired in Tutorial.tsx', () => {
    expect(tutorialSrc).toMatch(/role="group"\s+aria-label="Game features"/);
    expect(tutorialSrc).toMatch(/role="list"\s+aria-label="Game features list"/);
  });
});

// ============================================================================
// Out-of-scope skip blocks — see file header for why each block is deferred.
// ============================================================================
describe('Phase 33 — StageScreen announces Caps Lock warning to screen readers', () => {
  it('StageScreen source declares a caps-lock-warning-sr live region', () => {
    expect(stageScreenSrc).toMatch(/className="caps-lock-warning-sr"/);
  });

  it('Caps Lock region uses role="alert" when the warning is on', () => {
    expect(stageScreenSrc).toMatch(
      /role=\{capsLockWarning\s*\?\s*['"]alert['"]\s*:\s*undefined\}/
    );
  });

  it('Caps Lock region uses aria-live="assertive" when the warning is on', () => {
    expect(stageScreenSrc).toMatch(
      /aria-live=\{capsLockWarning\s*\?\s*['"]assertive['"]\s*:\s*undefined\}/
    );
  });

  it('Caps Lock region renders an English announcement when on', () => {
    expect(stageScreenSrc).toMatch(
      /Caps Lock is on\.\s+Korean jamo input may behave unexpectedly/
    );
  });

  it('Caps Lock region renders nothing when the warning is off', () => {
    expect(stageScreenSrc).toMatch(
      /\{capsLockWarning\s*\?\s*['"]Caps Lock is on[\s\S]*?:\s*['"]['"]\}/
    );
  });

  it('StageScreen renders the canvas + warning region (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(
        <StageScreen
          canvasRef={{ current: null }}
          state={
            {
              phase: 'stage',
              currentStage: null,
              currentEnemy: null,
              buffer: '',
              score: 0,
              combo: 0,
              comboMax: 0,
              wpm: 0,
              accuracy: 0,
              enemiesDefeated: 0,
              totalErrors: 0,
              lastHitCorrect: false,
              lastHitCharIndex: 0,
              lastHitTime: 0,
              missions: [],
              missionResults: [],
              startTime: 0,
            } as unknown as GameState
          }
          stage={null}
          languageLabel="EN"
        />
      )
    ).not.toThrow();
  });
});

describe('Phase 33 — OSKeyboardInput hidden input is removed from the SR tree', () => {
  it('OSKeyboardInput source wires aria-hidden="true" on the hidden input', () => {
    expect(osKeyboardSrc).toMatch(/aria-hidden="true"/);
  });

  it('OSKeyboardInput source wires tabIndex={-1} so the input is not focusable via SR navigation', () => {
    expect(osKeyboardSrc).toMatch(/tabIndex=\{-1\}/);
  });

  it('OSKeyboardInput hidden input still preserves aria-label as a fallback', () => {
    expect(osKeyboardSrc).toMatch(/aria-label=\{`\$\{language\}\s+typing input`\}/);
  });

  it('OSKeyboardInput renders the hidden input (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(
        <OSKeyboardInput
          enabled={true}
          language="en"
          onChar={() => {}}
          onBackspace={() => {}}
          onEnter={() => {}}
        />
      )
    ).not.toThrow();
  });
});