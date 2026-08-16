/**
 * Phase 22 — Final polish + accessibility tests.
 *
 * Covers the three Phase 22 improvements layered on top of Phase 14/17/19/20/21:
 * - StageScreen HUD: the score / combo / accuracy / WPM block now exposes
 *   role="status" + aria-live="polite" + a descriptive aria-label so screen
 *   readers announce progress during gameplay instead of going silent.
 * - LearnScreen vocab cards: each preview card now carries an aria-label
 *   describing display + meaning + level + category so SR users hear the
 *   same info sighted users get from the visual layout.
 * - DailyLessonModal tier selector: each Quick/Standard/Deep button now
 *   exposes aria-pressed + aria-label + role=group wrapper. The close +
 *   practice buttons carry aria-labels. A visible keyboard-shortcut hint
 *   footer (Phase 14 pattern) makes the Escape affordance discoverable.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't fire
 * :focus-visible); CSS rule coverage is verified at the source level.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { StageScreen } from '../../src/ui/StageScreen.js';
import { LearnScreen } from '../../src/ui/LearnScreen.js';
import { DailyLessonModal } from '../../src/ui/DailyLessonModal.js';
import { initialState } from '../../src/state/gameReducer.js';
import { SAMPLE_STAGES } from '../../src/data/stages.js';
import type { RefObject } from 'react';
import type { DailyLesson, WikiPage } from '../../src/data/dailyLessons.js';
import type { Enemy } from '../../src/types.js';

const emptyWikiPage = (filename: string): WikiPage => ({
  filename,
  title: filename,
  body: '',
  category: 'vocabulary',
});

const vocabPage = emptyWikiPage('hello.md');
const sampleLesson: DailyLesson = {
  id: 'test_lesson',
  language: 'en',
  date: '2026-08-15',
  sourceTopic: 'test-topic',
  difficulty: { tier: 1, cefr: 'A1', primaryStage: 'en_1_1' },
  source: { rawFile: 'test-source.md' },
  raw: { sourceFile: 'test-source.md', excerpt: 'raw excerpt' },
  wiki: { vocabulary: [vocabPage], expressions: [], culture: null },
  meta: { estimatedReadMinutes: 5, relatedStages: ['en_1_1'] },
};

const here = dirname(fileURLToPath(import.meta.url));

// Install localStorage polyfill for jsdom (matches Phase 17/19/20/21 pattern).
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
// StageScreen — HUD now announces progress to screen readers
// ============================================================================

describe('Phase 22 — StageScreen HUD exposes live status to screen readers', () => {
  const baseProps = {
    canvasRef: { current: null } as RefObject<HTMLCanvasElement>,
    state: {
      ...initialState,
      score: 1234,
      enemiesDefeated: 7,
      combo: 3,
      comboMax: 12,
      wpm: 42,
      accuracy: 87,
    },
    stage: null,
    languageLabel: 'EN',
    onBackToMenu: () => {},
  };

  it('hud-info block exposes role="region" with aria-labelledby (Phase 35 SR-spam fix)', () => {
    // Phase 22 originally wired role="status" + aria-live="polite" + a
    // descriptive aria-label. Phase 35 replaced that with role="region" +
    // aria-labelledby="hud-heading" because the 60Hz re-render was
    // firing a polite SR announcement on every score/combo/WPM update —
    // a real SR-spam bug. The visible <p> text is now aria-hidden
    // because Phase 23's canvas aria-label already names the
    // typed-so-far count. This regression guard confirms the new
    // labelled-region contract.
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toMatch(
      /class="hud-info"[^>]*role="region"[^>]*aria-labelledby="hud-heading"|role="region"[^>]*aria-labelledby="hud-heading"[^>]*class="hud-info"/
    );
  });

  it('hud-info block no longer carries aria-live="polite" (Phase 35 closed the SR-spam bug)', () => {
    // The hud-info wrapper itself should NOT have aria-live any more
    // (that was the source of the polite-announcement storm). The
    // visible <p> children stay readable for sighted users; SR users
    // get the labelled region once on landmark navigation.
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).not.toMatch(/class="hud-info"[^>]*aria-live/);
    expect(html).not.toMatch(/aria-live="polite"[^>]*class="hud-info"/);
  });

  it('hud-info block exposes a visually-hidden "Game stats" heading tied to the region', () => {
    // Phase 35 replaces the Phase 22 descriptive aria-label (which
    // OVERRODE the visible text — same anti-pattern Phase 32/34 fixed
    // on kbd-hints) with a screen-reader-only <h3> inside the region.
    // The aria-labelledby attribute above ties the heading to the
    // region. SR users navigating by landmark hear "Game stats, region".
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toMatch(/id="hud-heading"[^>]*class="visually-hidden"/);
    expect(html).toContain('Game stats');
  });
});

// ============================================================================
// LearnScreen — vocab preview cards now have aria-labels
// ============================================================================

describe('Phase 22 — LearnScreen vocab cards expose aria-label', () => {
  const stage = SAMPLE_STAGES[0]!;
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
  const baseProps = {
    stage,
    enemies: baseEnemies,
    onStart: () => {},
    onBack: () => {},
  };

  it('vocab card exposes aria-label with display + meaning + level + category', () => {
    const html = renderToStaticMarkup(<LearnScreen {...baseProps} />);
    expect(html).toMatch(
      /class="learn-screen__vocab-card"[^>]*aria-label="hello, meaning 인사, level 1, category greetings\. Activate to view details\."/
    );
  });

  it('each vocab card carries its own descriptive aria-label (no silent buttons)', () => {
    // We render with multiple enemies so we can assert every card has a label.
    const multiProps = {
      ...baseProps,
      enemies: [
        ...baseEnemies,
        {
          id: 'en_002',
          hp: 1,
          maxHp: 1,
          spawnTime: 0,
          target: {
            text: 'world',
            acceptedInputs: ['world'],
            meaning: '세계',
            category: 'general',
            level: 1,
          },
        },
      ],
    };
    const html = renderToStaticMarkup(<LearnScreen {...multiProps} />);
    const labels = html.match(/aria-label="[^"]*meaning [^"]*level [^"]*category [^"]*"/g) ?? [];
    expect(labels.length).toBe(2);
  });
});

// ============================================================================
// DailyLessonModal — tier-selector now aria-pressed + keyboard hint
// ============================================================================

describe('Phase 22 — DailyLessonModal tier-selector is a proper radio-group', () => {
  it('tier-selector wrapper exposes role="group" with accessible label', () => {
    const html = renderToStaticMarkup(
      <DailyLessonModal lesson={sampleLesson} onClose={() => {}} onPractice={() => {}} />
    );
    expect(html).toMatch(
      /class="daily-lesson-modal__tier-selector"[^>]*role="group"[^>]*aria-label="Lesson depth"|role="group"[^>]*aria-label="Lesson depth"[^>]*class="daily-lesson-modal__tier-selector"/
    );
  });

  it('tier buttons expose aria-pressed reflecting selection (3 tiers, 1 pressed)', () => {
    const html = renderToStaticMarkup(
      <DailyLessonModal lesson={sampleLesson} onClose={() => {}} onPractice={() => {}} />
    );
    // All 3 tier buttons have aria-pressed.
    const pressed = html.match(/aria-pressed="(true|false)"/g) ?? [];
    expect(pressed.length).toBeGreaterThanOrEqual(3);
    // Default tier is 'standard', so exactly one is aria-pressed="true".
    const trueCount = (html.match(/aria-pressed="true"/g) ?? []).length;
    expect(trueCount).toBe(1);
  });

  it('tier buttons expose aria-label describing tier + duration + selection state', () => {
    const html = renderToStaticMarkup(
      <DailyLessonModal lesson={sampleLesson} onClose={() => {}} onPractice={() => {}} />
    );
    // The standard tier (default selection) should expose a selected-state label.
    expect(html).toMatch(/aria-label="Standard tier, ~5 minutes, selected"/);
    // Quick tier should expose a non-selected-state label (singular: 1 minute).
    expect(html).toMatch(/aria-label="Quick tier, ~1 minute"/);
    // Deep tier should expose a non-selected-state label.
    expect(html).toMatch(/aria-label="Deep tier, ~10 minutes/);
  });

  it('close button exposes (Escape) suffix in aria-label', () => {
    const html = renderToStaticMarkup(
      <DailyLessonModal lesson={sampleLesson} onClose={() => {}} onPractice={() => {}} />
    );
    // The footer close button (with hint suffix) lives in .daily-lesson-modal__close-btn
    expect(html).toMatch(/class="daily-lesson-modal__close-btn"[^>]*aria-label="[^"]*\(Escape\)"/);
  });

  it('practice button exposes aria-label naming the related stage', () => {
    const html = renderToStaticMarkup(
      <DailyLessonModal lesson={sampleLesson} onClose={() => {}} onPractice={() => {}} />
    );
    // The sampleLesson has relatedStages: ['en_1_1']
    expect(html).toMatch(/class="daily-lesson-modal__practice-btn"[^>]*aria-label="[^"]*en_1_1"/);
  });

  it('footer exposes a visible keyboard-shortcut hint for Escape', () => {
    const html = renderToStaticMarkup(
      <DailyLessonModal lesson={sampleLesson} onClose={() => {}} onPractice={() => {}} />
    );
    expect(html).toContain('class="daily-lesson-modal__kbd-hint"');
    expect(html).toMatch(/daily-lesson-modal__kbd-hint[^>]*>Esc to close/);
  });
});

// ============================================================================
// DailyLessonModal — focus-visible coverage (source-level, jsdom limitation)
// ============================================================================

describe('Phase 22 — DailyLessonModal :focus-visible coverage (source contract)', () => {
  it('DailyLessonModal ships :focus-visible rule for tier buttons', () => {
    // jsdom doesn't fire :focus-visible; verify the source carries the rule
    // so keyboard users see which tier is focused when tabbing through them.
    const src = readFileSync(
      resolve(here, '../../src/ui/DailyLessonModal.tsx'),
      'utf-8'
    );
    expect(src).toMatch(/\.daily-lesson-modal__tier-btn:focus-visible/);
    expect(src).toMatch(/outline: 2px solid #00d9ff/);
  });
});
