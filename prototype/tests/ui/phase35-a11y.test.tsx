/**
 * Phase 35 — Final polish + accessibility tests (Slice 4 port).
 *
 * Covers three Phase 35 improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31/32/33/34:
 *
 * - `StageScreen` `.hud-info` SR-spam fix: the HUD is now a labelled
 *   `role="region"` (no `aria-live`) with a screen-reader-only heading so
 *   SR users can navigate into "Game stats" via landmark without a polite
 *   announcement firing on every 60Hz tick.
 * - `style.css` `.btn-primary/.btn-secondary/.btn-danger:focus-visible`
 *   outside `.tutorial`.
 * - `DailyLessonModal` search input aria-label.
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase35-a11y.test.tsx`:
 *   - The StageScreen smoke fixture uses `as unknown as` casts instead of
 *     the remote's `as any` (repo `no-explicit-any` lint).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { StageScreen } from '../../src/ui/StageScreen.js';
import { DailyLessonModal } from '../../src/ui/DailyLessonModal.js';
import type { GameState } from '../../src/state/gameReducer.js';
import type { StageConfig } from '../../src/types.js';
import type { DailyLesson } from '../../src/data/dailyLessons.js';

const here = dirname(fileURLToPath(import.meta.url));
const stageScreenSrc = readFileSync(
  resolve(here, '../../src/ui/StageScreen.tsx'),
  'utf-8'
);
const dailyLessonModalSrc = readFileSync(
  resolve(here, '../../src/ui/DailyLessonModal.tsx'),
  'utf-8'
);
const styleCssSrc = readFileSync(resolve(here, '../../src/style.css'), 'utf-8');

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
// StageScreen — hud-info SR-spam fix
// ============================================================================

describe('Phase 35 — StageScreen hud-info no longer fires a polite announcement on every render', () => {
  it('hud-info container is now role="region" + aria-labelledby (NOT role="status" aria-live="polite")', () => {
    const hudBlock = stageScreenSrc.match(/className="hud-info"[\s\S]{0,800}<\/div>/);
    expect(hudBlock).not.toBeNull();
    expect(hudBlock![0]).toMatch(/role="region"/);
    expect(hudBlock![0]).toMatch(/aria-labelledby="hud-heading"/);
    expect(hudBlock![0]).not.toMatch(/aria-live="polite"/);
    expect(hudBlock![0]).not.toMatch(/role="status"/);
  });

  it('hud-info visually-hidden h3 exposes "Game stats" so SR users hear the region name on landmark nav', () => {
    expect(stageScreenSrc).toMatch(/id="hud-heading"[^>]*className="visually-hidden"/);
    expect(stageScreenSrc).toMatch(/Game stats/);
  });

  it('hud-info source REMOVED the bogus aria-label that overrode visible text', () => {
    const hudBlock = stageScreenSrc.match(/className="hud-info"[\s\S]{0,800}<\/div>/);
    expect(hudBlock).not.toBeNull();
    expect(hudBlock![0].split('</div>')[0]).not.toMatch(/aria-label=/);
  });

  it('StageScreen renders the hud-info as a labelled region with no aria-live (renderToStaticMarkup smoke)', () => {
    const html = renderToStaticMarkup(
      <StageScreen
        canvasRef={{ current: null }}
        state={
          {
            phase: 'stage',
            buffer: '',
            score: 100,
            combo: 3,
            comboMax: 5,
            wpm: 30,
            accuracy: 95,
            currentEnemy: null,
            missions: [],
            totalErrors: 0,
          } as unknown as GameState
        }
        stage={
          {
            id: 'en_t_1',
            language: 'en',
            name: 'Tier 1',
            description: 'desc',
            missions: [],
            corpusFilter: {},
          } as unknown as StageConfig
        }
        languageLabel="EN"
        canvasWidth={1024}
        canvasHeight={880}
      />
    );
    expect(html).toMatch(/role="region"/);
    expect(html).toMatch(/aria-labelledby="hud-heading"/);
    expect(html).toMatch(/id="hud-heading"/);
    expect(html).not.toMatch(/class="hud-info"[\s\S]{0,400}aria-live/);
    expect(html).toContain('Score:');
    expect(html).toContain('WPM:');
    expect(html).toContain('ACC:');
  });
});

// ============================================================================
// style.css — global .btn-primary/.btn-secondary/.btn-danger focus-visible
// ============================================================================

describe('Phase 35 — style.css adds :focus-visible to global button classes outside .tutorial', () => {
  it('declares .btn-primary:focus-visible with a 2px cyan outline', () => {
    expect(styleCssSrc).toMatch(
      /\.btn-primary:focus-visible[\s\S]{0,500}outline:\s*2px\s+solid\s+#00d9ff/
    );
  });

  it('declares .btn-secondary:focus-visible (ProfileSelector Cancel button)', () => {
    expect(styleCssSrc).toMatch(/\.btn-secondary:focus-visible/);
  });

  it('declares .btn-danger:focus-visible (ProfileSelector Delete button)', () => {
    expect(styleCssSrc).toMatch(/\.btn-danger:focus-visible/);
  });

  it('uses 2px outline-offset matching the Phase 14/19/33 convention', () => {
    const ruleBlock = styleCssSrc.match(
      /\.btn-primary:focus-visible[\s\S]{0,400}\.btn-secondary:focus-visible[\s\S]{0,400}\.btn-danger:focus-visible\s*\{[\s\S]*?\}/
    );
    expect(ruleBlock).not.toBeNull();
    expect(ruleBlock![0]).toMatch(/outline-offset:\s*2px/);
  });

  it('Phase 33 .tutorial .btn-primary:focus-visible rule still preserved (regression guard)', () => {
    expect(styleCssSrc).toMatch(/\.tutorial\s+\.btn-primary:focus-visible/);
  });
});

// ============================================================================
// DailyLessonModal — search input aria-label
// ============================================================================

describe('Phase 35 — DailyLessonModal search input has a programmatic aria-label', () => {
  it('source adds aria-label="Search lesson content" to the .daily-lesson-modal__search input', () => {
    const searchBlock = dailyLessonModalSrc.match(
      /className="daily-lesson-modal__search"[\s\S]{0,1500}?\/>/
    );
    expect(searchBlock).not.toBeNull();
    expect(searchBlock![0]).toMatch(/aria-label="Search lesson content"/);
  });

  it('search input still preserves the visible placeholder (regression guard)', () => {
    const searchBlock = dailyLessonModalSrc.match(
      /className="daily-lesson-modal__search"[\s\S]{0,1500}?\/>/
    );
    expect(searchBlock).not.toBeNull();
    expect(searchBlock![0]).toMatch(/placeholder=/);
  });

  it('DailyLessonModal renders the search input with aria-label (renderToStaticMarkup smoke)', () => {
    const html = renderToStaticMarkup(
      <DailyLessonModal
        lesson={
          {
            id: 'en_2026_08_17',
            language: 'en',
            meta: { relatedStages: [] },
            raw: { excerpt: 'raw' },
            wiki: { vocabulary: [], expressions: [], culture: null },
          } as unknown as DailyLesson
        }
        onClose={() => {}}
        onPractice={() => {}}
      />
    );
    expect(html).toMatch(/aria-label="Search lesson content"/);
    expect(html).toMatch(/placeholder="Search..."/);
  });
});