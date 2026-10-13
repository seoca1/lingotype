/**
 * Phase 28 — Final polish + accessibility tests (Slice 4 port).
 *
 * Covers three Phase 28 improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27:
 *
 * - `LearnScreen` start button: exposes an aria-label that includes the
 *   stage name and the `(Enter)` keyboard hint, plus a visible
 *   `<kbd>(Enter)</kbd>` badge. A kbd-hint footer mirrors the Phase 25/26/27
 *   footer style so the Enter and Escape shortcuts are discoverable.
 * - `StageScreen` missions list: exposes `role="list"` + `aria-label` on
 *   the container, `role="listitem"` on each mission row, and an
 *   `id="stage-missions-heading"` on the h3.
 * - `Menu` streak badge: exposes `role="status"` + `aria-label="Daily
 *   streak: {streak.text}"` so SR users hear the full streak description.
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase28-a11y.test.tsx`:
 *   - The StageScreen fixture uses `initialState` spread instead of the
 *     remote's hand-built GameState literal.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRef } from 'react';
import type { RefObject } from 'react';
import { LearnScreen } from '../../src/ui/LearnScreen.js';
import { StageScreen } from '../../src/ui/StageScreen.js';
import { Menu } from '../../src/ui/Menu.js';
import { SAMPLE_STAGES } from '../../src/data/stages.js';
import { initialState } from '../../src/state/gameReducer.js';

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

// Stub window.speechSynthesis (used by LearnScreen vocab TTS path).
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
// LearnScreen — start button aria-label + (Enter) kbd hint
// ============================================================================

describe('Phase 28 — LearnScreen start button exposes aria-label + Enter hint', () => {
  const stage = SAMPLE_STAGES[0]!;
  const baseProps = {
    stage,
    enemies: [],
    onStart: () => {},
    onBack: () => {},
  };

  it('start button has aria-label naming the stage + (Enter) hint', () => {
    const html = renderToStaticMarkup(<LearnScreen {...baseProps} />);
    expect(html).toMatch(/aria-label="Start [^"]+ \(Enter\)"/);
  });

  it('start button shows visible (Enter) kbd hint inside the label', () => {
    const html = renderToStaticMarkup(<LearnScreen {...baseProps} />);
    expect(html).toMatch(/learn-screen__start[^>]*>[\s\S]*?<kbd[^>]*>\(Enter\)<\/kbd>/);
  });

  it('footer kbd hint advertises Enter and Esc shortcuts', () => {
    const html = renderToStaticMarkup(<LearnScreen {...baseProps} />);
    expect(html).toContain('learn-screen__kbd-hint');
    expect(html).not.toContain('aria-label="Keyboard shortcuts"');
    expect(html).toMatch(/<kbd>Enter<\/kbd>\s*start stage/);
    expect(html).toMatch(/<kbd>Esc<\/kbd>\s*back to menu/);
  });
});

// ============================================================================
// StageScreen — missions list semantics (role=list, listitem, aria-label)
// ============================================================================

describe('Phase 28 — StageScreen missions list exposes role=list + listitem', () => {
  const stage = SAMPLE_STAGES[0]!;
  const canvasRef: RefObject<HTMLCanvasElement | null> = createRef<HTMLCanvasElement>();
  const baseProps = {
    canvasRef,
    state: {
      ...initialState,
      currentStage: stage,
      missions: stage.missions,
    },
    stage,
    languageLabel: 'English',
  };

  it('missions container has role="list" with accessible name', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toMatch(
      /<div[^>]*class="missions"[^>]*role="list"[^>]*aria-label="Stage missions for [^"]+"/
    );
  });

  it('missions h3 carries id="stage-missions-heading" for heading semantics', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toMatch(/<h3[^>]*id="stage-missions-heading"[^>]*>Missions<\/h3>/);
  });

  it('each mission row is a role="listitem"', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    const listitems = html.match(/<div[^>]*class="mission"[^>]*role="listitem"/g);
    expect(listitems).not.toBeNull();
    expect(listitems!.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// Menu — streak badge role=status + aria-label
// ============================================================================

describe('Phase 28 — Menu streak badge exposes role=status + aria-label', () => {
  const baseProps = {
    language: 'en' as const,
    onStartStage: () => {},
    onShowCharacterSelect: () => {},
    onBackToLanguageSelect: () => {},
  };

  it('streak badge has role="status" + Daily streak aria-label', () => {
    const html = renderToStaticMarkup(<Menu {...baseProps} />);
    expect(html).toMatch(
      /<span[^>]*class="streak-badge[^"]*"[^>]*role="status"[^>]*aria-label="Daily streak: [^"]+"/
    );
  });

  it('streak badge keeps title attribute for sighted hover (tooltip preserved)', () => {
    const html = renderToStaticMarkup(<Menu {...baseProps} />);
    expect(html).toMatch(/<span[^>]*class="streak-badge[^"]*"[^>]*title="[^"]+"[^>]*role="status"/);
  });
});