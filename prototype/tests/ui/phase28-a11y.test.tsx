/**
 * Phase 28 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27:
 *
 * - `LearnScreen` start button: now exposes an aria-label that includes the
 *   stage name and the `(Enter)` keyboard hint. A visible `<kbd>(Enter)</kbd>`
 *   badge sits inside the button label so sighted users see the shortcut.
 *   A small kbd-hint footer mirrors the Pattern 25 / 26 / 27 footer style
 *   so the Enter and Escape shortcuts are discoverable. Previously the
 *   button had no aria-label at all and no visible keyboard hint — only
 *   the useEffect-level Enter handler existed, which is invisible to the
 *   user and silent to screen readers.
 *
 * - `StageScreen` missions list: now exposes `role="list"` + `aria-label`
 *   on the container, and `role="listitem"` on each mission row. The h3
 *   carries `id="stage-missions-heading"`. Previously missions were plain
 *   `<div>` siblings — SR users heard them as a run of unlabelled content
 *   with no group landmark and no item semantics.
 *
 * - `Menu` streak badge: now exposes `role="status"` + `aria-label="Daily
 *   streak: {streak.text}"` so SR users hear the full streak description
 *   (e.g. "Daily streak: 5-day streak (play today!)") instead of just
 *   the icon glyph (e.g. "fire 5"). Previously the badge was a bare span
 *   with only a `title` tooltip, which is invisible to most SR tools.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/26/27).
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
import type { GameState } from '../../src/state/gameReducer.js';

// Install localStorage polyfill for jsdom (matches Phase 14/17/19/20/21/22/23/24/25/26/27 pattern).
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
  (window as any).speechSynthesis = {
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
    // The aria-label mirrors the visible button text plus the (Enter) hint
    // so SR users hear both what the button does and its keyboard shortcut.
    expect(html).toMatch(/aria-label="Start [^"]+ \(Enter\)"/);
  });

  it('start button shows visible (Enter) kbd hint inside the label', () => {
    const html = renderToStaticMarkup(<LearnScreen {...baseProps} />);
    // The kbd badge is part of the visible label so sighted users see
    // the Enter shortcut. Must appear inside the start button.
    expect(html).toMatch(/learn-screen__start[^>]*>[\s\S]*?<kbd[^>]*>\(Enter\)<\/kbd>/);
  });

  it('footer kbd hint advertises Enter and Esc shortcuts', () => {
    const html = renderToStaticMarkup(<LearnScreen {...baseProps} />);
    // The footer kbd hint mirrors the Phase 25/26/27 footer pattern.
    expect(html).toContain('learn-screen__kbd-hint');
    expect(html).toContain('aria-label="Keyboard shortcuts"');
    expect(html).toMatch(/<kbd>Enter<\/kbd>\s*start stage/);
    expect(html).toMatch(/<kbd>Esc<\/kbd>\s*back to menu/);
  });
});

// ============================================================================
// StageScreen — missions list semantics (role=list, listitem, aria-label)
// ============================================================================

describe('Phase 28 — StageScreen missions list exposes role=list + listitem', () => {
  const stage = SAMPLE_STAGES[0]!;
  const canvasRef: RefObject<HTMLCanvasElement> = createRef<HTMLCanvasElement>();
  const baseGameState: GameState = {
    phase: 'stage',
    currentStage: stage,
    currentEnemy: null,
    buffer: '',
    score: 0,
    combo: 0,
    comboMax: 0,
    wpm: 0,
    accuracy: 100,
    startTime: 0,
    enemiesDefeated: 0,
    totalErrors: 0,
    player: {
      level: 1,
      totalScore: 0,
      stats: {
        totalEnemiesDefeated: 0,
        totalStagesCleared: 0,
        totalPlayTimeMs: 0,
        bestWpm: { en: 0, jp: 0, es: 0, kr: 0, fr: 0, de: 0, zh: 0 },
        avgAccuracy: { en: 0, jp: 0, es: 0, kr: 0, fr: 0, de: 0, zh: 0 },
      },
      unlockedStages: [],
      achievements: [],
      stageRecords: {},
    },
    missions: stage.missions,
    missionResults: [],
    lastHitCorrect: false,
    lastHitCharIndex: 0,
    lastHitTime: 0,
  };
  const baseProps = {
    canvasRef,
    state: baseGameState,
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
    // Every stage in SAMPLE_STAGES carries at least one mission, so the
    // page must render at least one role="listitem" element.
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
    // The streak badge must expose a status role so SR users hear the
    // streak context (current streak days + status) on focus, not just
    // the icon glyph + count. With no prior play, streak.text is "—".
    expect(html).toMatch(
      /<span[^>]*class="streak-badge[^"]*"[^>]*role="status"[^>]*aria-label="Daily streak: [^"]+"/
    );
  });

  it('streak badge keeps title attribute for sighted hover (tooltip preserved)', () => {
    const html = renderToStaticMarkup(<Menu {...baseProps} />);
    // The existing title= attribute is preserved as a hover tooltip;
    // aria-label is the new source of truth for SR users.
    expect(html).toMatch(/<span[^>]*class="streak-badge[^"]*"[^>]*title="[^"]+"[^>]*role="status"/);
  });
});
