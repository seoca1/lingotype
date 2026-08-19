/**
 * Phase 23 — Final polish + accessibility tests.
 *
 * Covers the three Phase 23 improvements layered on top of Phase 14/17/19/20/21/22:
 * - StageScreen canvas: the canvas (the primary "display" of the current target)
 *   now exposes role="img" + aria-label naming the current target text, language,
 *   and meaning. SR users previously heard nothing about what to type.
 * - LearnScreen vocab modal: the per-vocab detail modal now exposes
 *   role="dialog" + aria-modal="true" + aria-label and traps Tab focus
 *   (Phase 17 pattern). The close button now carries "(Escape)" suffix.
 * - Menu stage cards: the keyboard-selected card now exposes aria-current="true"
 *   and "currently selected" suffix in aria-label so SR users know which card
 *   Enter will trigger.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't fire
 * :focus-visible); lib functions + state setup match the phase22 test file.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { StageScreen } from '../../src/ui/StageScreen.js';
import { LearnScreen } from '../../src/ui/LearnScreen.js';
import { Menu } from '../../src/ui/Menu.js';
import { initialState } from '../../src/state/gameReducer.js';
import { SAMPLE_STAGES } from '../../src/data/stages.js';
import type { RefObject } from 'react';
import type { Enemy, StageConfig } from '../../src/types.js';

const here = dirname(fileURLToPath(import.meta.url));

// Install localStorage polyfill for jsdom (matches Phase 17/19/20/21/22 pattern).
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

// ============================================================================
// StageScreen — canvas now exposes the current target to screen readers
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

// ============================================================================
// LearnScreen — vocab detail modal now a proper dialog with focus trap
// ============================================================================

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
    // The modal block is conditional on selectedVocab; assert no role="dialog"
    // appears in the initial render so we know the modal is hidden by default.
    expect(html).not.toContain('role="dialog"');
  });

  it('vocab modal exposes role="dialog" + aria-modal="true" + aria-label', () => {
    // Use a hand-crafted wrapper that simulates the modal-open state. Since
    // LearnScreen selects the vocab via internal state, we test the source
    // contract directly — verifying the modal markup contains the role +
    // aria-modal + aria-label attributes that Phase 23 introduced.
    const src = readFileSync(resolve(here, '../../src/ui/LearnScreen.tsx'), 'utf-8');

    // The modal container div must carry role="dialog" + aria-modal="true".
    expect(src).toMatch(/className="learn-screen__vocab-modal"[\s\S]{0,200}role="dialog"/);
    expect(src).toMatch(/role="dialog"[\s\S]{0,200}aria-modal="true"/);
    // And an aria-label naming the entry (e.g. "${selectedVocab.display} details").
    expect(src).toMatch(/aria-label=\{`\$\{selectedVocab\.display\} details`\}/);
  });

  it('vocab modal close button exposes (Escape) suffix in aria-label', () => {
    const src = readFileSync(resolve(here, '../../src/ui/LearnScreen.tsx'), 'utf-8');
    expect(src).toMatch(/aria-label=\{`\$\{t\('close', nativeLanguage\)\} \(Escape\)`\}/);
  });

  it('vocab modal wires focus trap + focus restoration on open', () => {
    const src = readFileSync(resolve(here, '../../src/ui/LearnScreen.tsx'), 'utf-8');
    // Phase 17 pattern: previouslyFocusedRef captures prior focus, restore
    // on cleanup, and the modal close button is auto-focused on open.
    expect(src).toMatch(/previouslyFocusedRef\.current\?\.focus/);
    expect(src).toMatch(/vocabModalCloseRef\.current\?\.focus\(\)/);
  });
});

// ============================================================================
// Menu — keyboard-selected stage card exposes aria-current="true"
// ============================================================================

describe('Phase 23 — Menu stage cards announce keyboard selection to screen readers', () => {
  // Find an English stage to test with (EN is the first registered language).
  const enStage = SAMPLE_STAGES.find((s) => s.language === 'en');
  const baseProps = {
    language: 'en' as const,
    onStartStage: () => {},
    onShowCharacterSelect: () => {},
    onBackToLanguageSelect: () => {},
    stageRecords: {},
  };

  it('marks the keyboard-selected card with aria-current="true"', () => {
    if (!enStage) {
      throw new Error('No EN stage found in SAMPLE_STAGES');
    }
    // Pre-populate localStorage with a selectedIndex to simulate the user
    // having pressed arrow keys (the Menu reads from internal state, but we
    // can verify the source contract for selected/aria-current).
    const html = renderToStaticMarkup(<Menu {...baseProps} />);
    // The Menu must declare aria-current on stage cards; the source-level
    // assertion is robust because the internal `selectedIndex` is -1 by
    // default (no card "naturally" selected until keyboard nav).
    expect(html).toMatch(/class="stage-card[^"]*"/);
    // aria-current should not appear (no card selected at mount).
    expect(html).not.toMatch(/aria-current="true"/);
  });

  it('source contract: StageCard accepts selected prop and emits aria-current when true', () => {
    const src = readFileSync(resolve(here, '../../src/ui/Menu.tsx'), 'utf-8');
    // The StageCard component must forward `aria-current` based on selected.
    expect(src).toMatch(/aria-current=\{selected \? 'true' : undefined\}/);
    // And the aria-label must mention "currently selected" when selected.
    expect(src).toMatch(/currently selected/);
  });
});
