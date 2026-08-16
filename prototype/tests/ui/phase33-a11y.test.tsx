/**
 * Phase 33 — Final polish + accessibility tests.
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
 *   KeyboardWarning buttons. Phase 33 closes the gap for the Tutorial's
 *   own buttons. Same 2px cyan outline + 2px offset as the Phase 14/19
 *   convention.
 *
 * - `StageScreen` Caps Lock warning aria-live: `capsLockWarning` was
 *   wired from `App.tsx` → `Renderer.ts` (draws the "⌨ Caps Lock이 켜져
 *   있습니다!" overlay onto the 2D canvas) but had NO live region
 *   announcing it for SR users. The canvas itself is invisible to SR
 *   (Phase 23 only exposes the canvas aria-label naming the current
 *   target word). Phase 33 adds a hidden but live `<div>` with
 *   `role="alert" aria-live="assertive"` that fires when the warning
 *   flips on, mirroring the Phase 25 NonKoreanKeyboardWarning
 *   mismatch-alert pattern.
 *
 * - `OSKeyboardInput` aria-hidden: the hidden OS-keyboard input lives
 *   at 1×1px with opacity 0 but had an `aria-label` AND was focusable
 *   (`pointerEvents: 'auto'`). SR users hearing the Phase 23 canvas
 *   aria-label would also hear a phantom "KR typing input" right after
 *   the canvas announcement. Phase 33 sets `aria-hidden="true"` and
 *   `tabIndex={-1}` so the hidden input is removed from the a11y tree
 *   while still receiving physical keyboard events.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/
 * 26/27/28/29/30/31/32).
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

const here = dirname(fileURLToPath(import.meta.url));
const stageScreenSrc = readFileSync(
  resolve(here, '../../src/ui/StageScreen.tsx'),
  'utf-8'
);
const osKeyboardSrc = readFileSync(
  resolve(here, '../../src/ui/OSKeyboardInput.tsx'),
  'utf-8'
);
const styleCssSrc = readFileSync(
  resolve(here, '../../src/style.css'),
  'utf-8'
);

// Install localStorage polyfill for jsdom (matches Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31/32 pattern).
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
    // Mirrors the Phase 14/19 convention. Keyboard users tabbing to the
    // welcome-page 시작하기 CTA need a visible focus ring.
    expect(styleCssSrc).toMatch(
      /\.tutorial\s+\.btn-primary:focus-visible[\s\S]{0,500}outline:\s*2px\s+solid\s+#00d9ff/
    );
  });

  it('declares .tutorial .btn-secondary:focus-visible (welcome 건너뛰기 button)', () => {
    expect(styleCssSrc).toMatch(/\.tutorial\s+\.btn-secondary:focus-visible/);
  });

  it('declares .tutorial .btn-nav:focus-visible (language + mechanics nav buttons)', () => {
    // The ← 이전 / 다음 → buttons on both language + mechanics pages
    // share the .btn-nav class. Without this rule, keyboard users tabbing
    // through 4+ nav buttons got no visual confirmation.
    expect(styleCssSrc).toMatch(/\.tutorial\s+\.btn-nav:focus-visible/);
  });

  it('declares .tutorial .lang-btn:focus-visible (6 language-selector pills)', () => {
    // The EN/JP/ES/KR/FR/DE pills on the language-tutorial page.
    expect(styleCssSrc).toMatch(/\.tutorial\s+\.lang-btn:focus-visible/);
  });

  it('uses 2px outline-offset matching the Phase 14/19 convention', () => {
    // The four selectors must share the same 2px offset so visual
    // cadence stays consistent across the app (every cyan-ringed button
    // has the same offset).
    const ruleBlock = styleCssSrc.match(
      /\.tutorial\s+\.btn-primary:focus-visible[\s\S]*?\.tutorial\s+\.lang-btn:focus-visible\s*\{[\s\S]*?\}/
    );
    expect(ruleBlock).not.toBeNull();
    expect(ruleBlock![0]).toMatch(/outline-offset:\s*2px/);
  });

  it('Phase 33 block carries a phase-anchor comment', () => {
    // Mirrors Phase 14/19/20/21/27/29/30/32 convention so future audits
    // can trace which phase added which a11y rule.
    expect(styleCssSrc).toMatch(/Phase 33:[^/]*focus-visible[^/]*Tutorial/i);
  });
});

// ============================================================================
// StageScreen — Caps Lock warning aria-live
// ============================================================================

describe('Phase 33 — StageScreen announces Caps Lock warning to screen readers', () => {
  it('StageScreen source declares a caps-lock-warning-sr live region', () => {
    // The live region wrapper must exist so SR users can hear the warning
    // (canvas-rendered text is invisible to SR by default).
    expect(stageScreenSrc).toMatch(/className="caps-lock-warning-sr"/);
  });

  it('Caps Lock region uses role="alert" when the warning is on', () => {
    // role="alert" + aria-live="assertive" so the SR interrupts the
    // current utterance — mirrors the Phase 25 NonKoreanKeyboardWarning
    // mismatch-alert pattern.
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
    // Announcement text must be in plain English so SR users hear the
    // exact same warning regardless of the user's native language (the
    // canvas overlay renders Korean, but SR users can't see that).
    expect(stageScreenSrc).toMatch(
      /Caps Lock is on\.\s+Korean jamo input may behave unexpectedly/
    );
  });

  it('Caps Lock region renders nothing when the warning is off', () => {
    // Empty string when off so SR users don't hear a phantom empty
    // announcement on every render (which would interrupt every canvas
    // aria-label update).
    expect(stageScreenSrc).toMatch(
      /\{capsLockWarning\s*\?\s*['"]Caps Lock is on[\s\S]*?:\s*['"]['"]\}/
    );
  });
});

// ============================================================================
// OSKeyboardInput — aria-hidden on the hidden input
// ============================================================================

describe('Phase 33 — OSKeyboardInput hidden input is removed from the SR tree', () => {
  it('OSKeyboardInput source wires aria-hidden="true" on the hidden input', () => {
    // The input still has aria-label as a fallback for any SR that walks
    // the accessibility tree before respecting aria-hidden, but the
    // aria-hidden flag must be present so it's removed from the tree.
    expect(osKeyboardSrc).toMatch(/aria-hidden="true"/);
  });

  it('OSKeyboardInput source wires tabIndex={-1} so the input is not focusable via SR navigation', () => {
    // Without tabIndex={-1}, the input would still receive Tab focus
    // even with aria-hidden. Both are needed.
    expect(osKeyboardSrc).toMatch(/tabIndex=\{-1\}/);
  });

  it('OSKeyboardInput hidden input still preserves aria-label as a fallback', () => {
    // Defensive: some SR tools ignore aria-hidden and walk the tree
    // directly. Keeping the descriptive label lets those tools still
    // announce something meaningful if they encounter the hidden input.
    expect(osKeyboardSrc).toMatch(/aria-label=\{`\$\{language\}\s+typing input`\}/);
  });
});

// ============================================================================
// Smoke tests — components still render
// ============================================================================

describe('Phase 33 — components still render without throwing', () => {
  it('Tutorial renders the welcome page (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(
        <Tutorial onComplete={() => {}} onStartTutorialStage={() => {}} />
      )
    ).not.toThrow();
  });

  it('StageScreen renders the canvas + warning region (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(
        <StageScreen
          canvasRef={{ current: null }}
          state={{
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
            romajiHint: undefined,
          } as any}
          stage={null}
          languageLabel="EN"
        />
      )
    ).not.toThrow();
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

// ============================================================================
// Regression guards — Phase 32 contracts still intact
// ============================================================================

describe('Phase 33 — regression guards (Phase 32 contracts preserved)', () => {
  it('Phase 32 visually-hidden utility still in style.css (no removal)', () => {
    expect(styleCssSrc).toMatch(/\.visually-hidden\s*\{/);
  });

  it('Phase 32 Tutorial features-list landmark still wired in Tutorial.tsx', () => {
    // Re-read the Tutorial source so we assert the Phase 32 wiring still
    // exists alongside the new focus-visible rule.
    const tutorialSrc = readFileSync(
      resolve(here, '../../src/ui/Tutorial.tsx'),
      'utf-8'
    );
    expect(tutorialSrc).toMatch(/role="group"\s+aria-label="Game features"/);
    expect(tutorialSrc).toMatch(/role="list"\s+aria-label="Game features list"/);
  });
});