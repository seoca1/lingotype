/**
 * Phase 23 — Final polish + accessibility tests (Slice 4a port).
 *
 * Covers three Phase 23 improvements layered on top of
 * Phase 14/17/19/20/21/22:
 *
 * - StageScreen canvas: the canvas (the primary "display" of the
 *   current target) now exposes role="img" + aria-label naming the
 *   current target text, language, and meaning. SR users previously
 *   heard nothing about what to type.
 *
 * - LearnScreen vocab modal: the per-vocab detail modal now exposes
 *   role="dialog" + aria-modal="true" + aria-label and traps Tab focus
 *   (Phase 17 pattern). The close button now carries "(Escape)" suffix.
 *
 * - Menu stage cards: the keyboard-selected card now exposes
 *   aria-current="true" and "currently selected" suffix in aria-label so
 *   SR users know which card Enter will trigger.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't fire
 * :focus-visible); lib functions + state setup match the phase22 test
 * file pattern.
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase23-a11y.test.tsx`:
 *   - StageScreen canvas aria-label: the local StageScreen does not
 *     expose role="img" / aria-label on the canvas yet. Adding those is
 *     outside Slice 4a's additive marker scope (StageScreen canvas
 *     markup change belongs to a later slice). Reason:
 *     `feature-deferred: canvas aria-label out of Slice 4a scope`.
 *   - LearnScreen vocab modal: the local LearnScreen ships the close
 *     button with an aria-label, but the modal container is NOT
 *     role="dialog" / aria-modal="true" yet. Adding those is outside
 *     Slice 4a's marker-only scope (the dialog semantics + focus-trap
 *     wiring are a runtime behavior change). Reason:
 *     `feature-deferred: vocab-modal dialog semantics out of Slice 4a scope`.
 *   - Menu aria-current: the local Menu (src/ui/Menu.tsx) already wires
 *     aria-current="true" on the keyboard-selected stage card (Phase 32
 *     Slice 2 port). The Menu test re-enabled here mirrors that contract.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach as beforeEachFn } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Menu } from '../../src/ui/Menu.js';
import { StageScreen } from '../../src/ui/StageScreen.js';
import { LearnScreen } from '../../src/ui/LearnScreen.js';
import { initialState } from '../../src/state/gameReducer.js';
import { SAMPLE_STAGES } from '../../src/data/stages.js';
import type { RefObject } from 'react';
import type { Enemy, StageConfig } from '../../src/types.js';

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

beforeEachFn(() => {
  localStorage.clear();
});

const here = dirname(fileURLToPath(import.meta.url));

// ============================================================================
// Menu — keyboard-selected stage card exposes aria-current="true"
// ============================================================================

describe('Phase 23 — Menu stage cards announce keyboard selection to screen readers', () => {
  const baseProps = {
    language: 'en' as const,
    onStartStage: () => {},
    onShowCharacterSelect: () => {},
    onBackToLanguageSelect: () => {},
    stageRecords: {},
  };

  it('Menu renders the EN stage grid without throwing (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(<Menu {...baseProps} />)
    ).not.toThrow();
  });

  it('Menu source wires aria-current based on the selected flag (slice 2 Phase 32 contract)', () => {
    // The Menu component (Phase 32 Slice 2 port) emits aria-current="true"
    // on the keyboard-selected card. Source-level check is robust
    // because renderToStaticMarkup can't drive keyboard events to
    // change selectedIndex.
    const src = readFileSync(
      resolve(here, '../../src/ui/Menu.tsx'),
      'utf-8'
    );
    expect(src).toMatch(/aria-current=\{selected \? 'true' : undefined\}/);
    expect(src).toMatch(/currently selected/);
  });

  it('Menu stage card markup exposes aria-current on the focused card', () => {
    // The default keyboard-selected index is 0, so the first stage card
    // must carry aria-current="true" at mount time. This is the rendered
    // markup counterpart to the source-level check above.
    const html = renderToStaticMarkup(<Menu {...baseProps} />);
    expect(html).toMatch(/aria-current="true"/);
    // Exactly one card should be the currently-selected one.
    const matches = html.match(/aria-current="true"/g) ?? [];
    expect(matches.length).toBe(1);
  });
});

// ============================================================================
// Out-of-scope skip blocks — see file header for rationale
// ============================================================================

describe('Phase 23 — StageScreen canvas exposes current target to screen readers', () => {
  const baseProps = {
    canvasRef: { current: null } as RefObject<HTMLCanvasElement | null>,
    state: {
      ...initialState,
      score: 100,
      enemiesDefeated: 2,
      currentEnemy: {
        id: 'en_001',
        hp: 1,
        maxHp: 1,
        spawnTime: 0,
        target: {
          text: 'hello',
          acceptedInputs: ['hello'],
          meaning: '인사',
          category: 'greetings',
          level: 1,
        },
      },
    },
    stage: SAMPLE_STAGES[0] ?? null,
    languageLabel: 'EN',
    onBackToMenu: () => {},
  };

  it('canvas exposes role="img"', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toMatch(/class="game-canvas"[^>]*role="img"|role="img"[^>]*class="game-canvas"/);
  });

  it('canvas aria-label names the current target text + language + meaning', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toMatch(
      /aria-label="Game canvas\. Type hello in EN, meaning 인사, category greetings\. Typed so far: nothing\."/
    );
  });

  it('canvas aria-label reflects the current buffer state', () => {
    const html = renderToStaticMarkup(
      <StageScreen
        {...baseProps}
        state={{
          ...baseProps.state,
          buffer: 'he',
        }}
      />
    );
    expect(html).toMatch(/Typed so far: he\./);
  });

  it('canvas aria-label falls back to stage context when no enemy is active', () => {
    const html = renderToStaticMarkup(
      <StageScreen
        {...baseProps}
        state={{
          ...baseProps.state,
          currentEnemy: null,
        }}
      />
    );
    expect(html).toMatch(/aria-label="Game canvas for EN\./);
  });
});

describe('Phase 23 — LearnScreen vocab detail modal is a proper dialog', () => {
  const stage: StageConfig = SAMPLE_STAGES[0]!;
  const baseEnemies: Enemy[] = [
    {
      id: 'en_001',
      hp: 1,
      maxHp: 1,
      spawnTime: 0,
      target: {
        text: 'hello',
        acceptedInputs: ['hello'],
        meaning: '인사',
        category: 'greetings',
        level: 1,
      },
    },
  ];

  it('does not render the modal initially (no role="dialog" before selection)', () => {
    const html = renderToStaticMarkup(
      <LearnScreen stage={stage} enemies={baseEnemies} onStart={() => {}} onBack={() => {}} />
    );
    expect(html).not.toContain('role="dialog"');
  });

  it('vocab modal exposes role="dialog" + aria-modal="true" + aria-label', () => {
    const src = readFileSync(resolve(here, '../../src/ui/LearnScreen.tsx'), 'utf-8');
    expect(src).toMatch(/className="learn-screen__vocab-modal"[\s\S]{0,200}role="dialog"/);
    expect(src).toMatch(/role="dialog"[\s\S]{0,200}aria-modal="true"/);
    expect(src).toMatch(/aria-label=\{`\$\{selectedVocab\.display\} details`\}/);
  });

  it('vocab modal close button exposes (Escape) suffix in aria-label', () => {
    const src = readFileSync(resolve(here, '../../src/ui/LearnScreen.tsx'), 'utf-8');
    expect(src).toMatch(/aria-label=\{`\$\{t\('close', nativeLanguage\)\} \(Escape\)`\}/);
  });

  it('vocab modal wires focus trap + focus restoration on open', () => {
    const src = readFileSync(resolve(here, '../../src/ui/LearnScreen.tsx'), 'utf-8');
    expect(src).toMatch(/previouslyFocusedRef\.current\?\.focus/);
    expect(src).toMatch(/vocabModalCloseRef\.current\?\.focus\(\)/);
  });
});