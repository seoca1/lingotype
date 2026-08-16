/**
 * Phase 35 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31/32/33/34:
 *
 * - `StageScreen` `.hud-info` SR-spam fix: the HUD was wired as
 *   `<div role="status" aria-live="polite" aria-label="Score X, ...">`,
 *   which re-rendered on every game tick (~60Hz) and re-announced the
 *   full stats string to screen readers on every combo bump, score
 *   delta, and WPM recalculation — a real SR-spam bug that drowned out
 *   the canvas aria-label added in Phase 23. The `aria-label=` ALSO
 *   overrode the visible text (same anti-pattern Phase 32/34 fixed
 *   for the kbd-hint footers). Phase 35 replaces the live region with
 *   a labelled `role="region"` containing a screen-reader-only heading
 *   so SR users can navigate into "Game stats" via landmark, and the
 *   visible `<p>` text is aria-hidden because the canvas already
 *   announces the typed-so-far count.
 *
 * - `style.css` `.btn-primary/.btn-secondary/.btn-danger:focus-visible`
 *   outside `.tutorial`: the same three classes were wired for the
 *   Tutorial screen in Phase 33, but the OUTSIDE-tutorial uses —
 *   ProfileSelector's per-card Play (`.btn-primary`) and Delete
 *   (`.btn-danger`) buttons, the profile-create-modal Cancel
 *   (`.btn-secondary`) and Create (`.btn-primary`) actions — never
 *   received a visible focus ring. Keyboard users tabbing through
 *   the profile picker saw no indicator on the most destructive
 *   actions. Phase 35 adds the global focus-visible rule.
 *
 * - `DailyLessonModal` search input aria-label: the only field on the
 *   lesson modal had a Korean/English `placeholder` but no programmatic
 *   label, so SR users landing on it heard only "edit text" with no
 *   context (WCAG 1.3.1 + 4.1.2). Phase 26/30 wired htmlFor/id pairing
 *   to SettingsScreen/OptionsScreen inputs; Phase 35 closes the gap on
 *   the modal search.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/
 * 26/27/28/29/30/31/32/33/34).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { StageScreen } from '../../src/ui/StageScreen.js';
import { DailyLessonModal } from '../../src/ui/DailyLessonModal.js';

const here = dirname(fileURLToPath(import.meta.url));
const stageScreenSrc = readFileSync(
  resolve(here, '../../src/ui/StageScreen.tsx'),
  'utf-8'
);
const dailyLessonModalSrc = readFileSync(
  resolve(here, '../../src/ui/DailyLessonModal.tsx'),
  'utf-8'
);
const styleCssSrc = readFileSync(
  resolve(here, '../../src/style.css'),
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
// StageScreen — hud-info SR-spam fix
// ============================================================================

describe('Phase 35 — StageScreen hud-info no longer fires a polite announcement on every render', () => {
  it('hud-info container is now role="region" + aria-labelledby (NOT role="status" aria-live="polite")', () => {
    // The previous `role="status" aria-live="polite"` fired a polite
    // SR announcement on every state update because the wrapper
    // re-rendered ~60Hz during gameplay. Phase 35 replaces the live
    // region with a labelled region so SR users hear structure once,
    // not a stats update per frame.
    const hudBlock = stageScreenSrc.match(
      /className="hud-info"[\s\S]{0,800}<\/div>/
    );
    expect(hudBlock).not.toBeNull();
    expect(hudBlock![0]).toMatch(/role="region"/);
    expect(hudBlock![0]).toMatch(/aria-labelledby="hud-heading"/);
    expect(hudBlock![0]).not.toMatch(/aria-live="polite"/);
    expect(hudBlock![0]).not.toMatch(/role="status"/);
  });

  it('hud-info visually-hidden h3 exposes "Game stats" so SR users hear the region name on landmark nav', () => {
    // The labelled region needs an actual element with that id for
    // aria-labelledby to resolve. Phase 32/33 used the same .visually-
    // hidden utility (already in style.css) so SR users navigate by
    // landmark and hear "Game stats, region".
    expect(stageScreenSrc).toMatch(
      /id="hud-heading"[^>]*className="visually-hidden"/
    );
    expect(stageScreenSrc).toMatch(/Game stats/);
  });

  it('hud-info source REMOVED the bogus aria-label that overrode visible text', () => {
    // The previous `aria-label={`Score ${state.score}, ...`}` overrode
    // the readable visible text — the same anti-pattern Phase 32/34
    // fixed for kbd-hints. SR users never heard the visible "Score:",
    // "WPM:", "ACC:" labels.
    const hudBlock = stageScreenSrc.match(
      /className="hud-info"[\s\S]{0,800}<\/div>/
    );
    expect(hudBlock).not.toBeNull();
    // The opening <div ...> block must not contain aria-label=.
    expect(hudBlock![0].split('</div>')[0]).not.toMatch(/aria-label=/);
  });

  it('StageScreen renders the hud-info as a labelled region with no aria-live (renderToStaticMarkup smoke)', () => {
    const html = renderToStaticMarkup(
      <StageScreen
        // Provide a minimal canvas ref-shaped stub; renderToStaticMarkup
        // doesn't actually invoke refs.
        canvasRef={{ current: null } as any}
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
            missions: { length: 0, map: () => ({}) } as any,
            totalErrors: 0,
          } as any
        }
        stage={
          {
            id: 'en_t_1',
            language: 'en',
            name: 'Tier 1',
            description: 'desc',
            missions: [],
            corpusFilter: {},
          } as any
        }
        languageLabel="EN"
        canvasWidth={1024}
        canvasHeight={880}
      />
    );
    // The labelled region with its visually-hidden heading is present.
    expect(html).toMatch(/role="region"/);
    expect(html).toMatch(/aria-labelledby="hud-heading"/);
    expect(html).toMatch(/id="hud-heading"/);
    // Critically, NO aria-live on the HUD wrapper (Phase 35 closes the
    // SR-spam bug).
    expect(html).not.toMatch(/class="hud-info"[\s\S]{0,400}aria-live/);
    // The visible eye-candy text is preserved.
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
    // The Play button inside each ProfileCard (and the Create button in
    // the profile-create-modal) gets a visible focus ring when tabbed.
    expect(styleCssSrc).toMatch(
      /\.btn-primary:focus-visible[\s\S]{0,500}outline:\s*2px\s+solid\s+#00d9ff/
    );
  });

  it('declares .btn-secondary:focus-visible (ProfileSelector Cancel button)', () => {
    expect(styleCssSrc).toMatch(/\.btn-secondary:focus-visible/);
  });

  it('declares .btn-danger:focus-visible (ProfileSelector Delete button)', () => {
    // The Delete button is destructive — a missing focus ring is the
    // highest-impact gap because tabbing past it without visual
    // confirmation risks an accidental Enter activation.
    expect(styleCssSrc).toMatch(/\.btn-danger:focus-visible/);
  });

  it('uses 2px outline-offset matching the Phase 14/19/33 convention', () => {
    // All three global classes must share the same 2px offset so the
    // visual cadence stays consistent across the app (every cyan-
    // ringed button has the same offset).
    const ruleBlock = styleCssSrc.match(
      /\.btn-primary:focus-visible[\s\S]{0,400}\.btn-secondary:focus-visible[\s\S]{0,400}\.btn-danger:focus-visible\s*\{[\s\S]*?\}/
    );
    expect(ruleBlock).not.toBeNull();
    expect(ruleBlock![0]).toMatch(/outline-offset:\s*2px/);
  });

  it('Phase 33 .tutorial .btn-primary:focus-visible rule still preserved (regression guard)', () => {
    // Adding the global rule below Phase 33 must not remove the
    // tutorial-scoped rule above it. Both coexist so the visual
    // contract stays consistent across the app.
    expect(styleCssSrc).toMatch(/\.tutorial\s+\.btn-primary:focus-visible/);
  });
});

// ============================================================================
// DailyLessonModal — search input aria-label
// ============================================================================

describe('Phase 35 — DailyLessonModal search input has a programmatic aria-label', () => {
  it('source adds aria-label="Search lesson content" to the .daily-lesson-modal__search input', () => {
    // WCAG 1.3.1 + 4.1.2: placeholders disappear on focus and most SR
    // engines do not expose placeholder as the accessible name. The
    // previous "단어 검색..." / "Search..." placeholder was the only
    // label, leaving SR users with "edit text" and no context.
    // The input block is bracketed by a className at the top and `/>`
    // at the bottom; the Phase 35 comment sits between them so the
    // window is wide enough to need a generous {0,1500} bound.
    // Locate the block by `className=` then `/>` and assert the
    // aria-label string is inside.
    const searchBlock = dailyLessonModalSrc.match(
      /className="daily-lesson-modal__search"[\s\S]{0,1500}?\/>/
    );
    expect(searchBlock).not.toBeNull();
    expect(searchBlock![0]).toMatch(/aria-label="Search lesson content"/);
  });

  it('search input still preserves the visible placeholder (regression guard)', () => {
    // The placeholder is the primary label for sighted users. Removing
    // it accidentally would break the visible UX. The aria-label adds
    // a programmatic name without removing the placeholder.
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
          } as any
        }
        onClose={() => {}}
        onPractice={() => {}}
      />
    );
    // The input renders with both the placeholder AND the new aria-label,
    // which is the ideal contract (placeholder visible to sighted users,
    // aria-label exposed to AT).
    expect(html).toMatch(/aria-label="Search lesson content"/);
    expect(html).toMatch(/placeholder="Search..."/);
  });
});
