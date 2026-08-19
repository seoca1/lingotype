/**
 * Phase 32 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31:
 *
 * - `Tutorial` features list landmark: the welcome page shipped 4 feature
 *   cards as plain `<div>` siblings inside `.tutorial-features` — SR
 *   users tabbing through heard 4 consecutive generic divs with no list
 *   context. Phase 32 wraps the cards in `<ul role="list">` inside a
 *   `role="group" aria-label="Game features"` wrapper so SR users get
 *   a labelled list landmark (matches Phase 22 DailyLessonModal pattern).
 *
 * - `Tutorial` page region landmarks + (Enter) suffix: the three tutorial
 *   pages (welcome / language / mechanics) had no `role="region"`
 *   landmark, so SR users navigating by landmarks couldn't jump straight
 *   to a tutorial page. Phase 32 wraps each in `role="region"` +
 *   `aria-labelledby` pointing at a heading (visible on welcome,
 *   visually-hidden on language/mechanics via the new `.visually-hidden`
 *   utility — matches the Phase 27 ResultScreen pattern). Also adds
 *   `(Enter)` suffix to the relevant action button aria-labels so the
 *   keyboard shortcut is discoverable (matches Phase 14/22/24/25/27/29
 *   convention).
 *
 * - `Menu` tier section aria-labelledby + kbd-hint SR regression fix:
 *   each tier `<section>` now exposes `aria-labelledby` pointing at its
 *   `<h3>` tier-title so SR users navigating by landmarks hear the tier
 *   name on entry. The `<p class="menu-kbd-hint">` previously carried
 *   `aria-label="Keyboard shortcuts"` which OVERRODE the readable
 *   `<small><kbd>` content — SR users heard "Keyboard shortcuts" but
 *   never the actual key names. Phase 32 removes that aria-label so SR
 *   users now hear the full hint content (←/→/↑/↓ navigate · Enter
 *   start · Esc back).
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/
 * 26/27/28/29/30/31).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Tutorial } from '../../src/ui/Tutorial.js';
import { Menu } from '../../src/ui/Menu.js';

const here = dirname(fileURLToPath(import.meta.url));
const tutorialSrc = readFileSync(
  resolve(here, '../../src/ui/Tutorial.tsx'),
  'utf-8'
);
const menuSrc = readFileSync(
  resolve(here, '../../src/ui/Menu.tsx'),
  'utf-8'
);
const styleCssSrc = readFileSync(
  resolve(here, '../../src/style.css'),
  'utf-8'
);

// Install localStorage polyfill for jsdom (matches Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31 pattern).
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
// Tutorial — features list landmark (welcome page)
// ============================================================================

describe('Phase 32 — Tutorial exposes a "Game features" list landmark on the welcome page', () => {
  it('renders the welcome page without throwing (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(
        <Tutorial onComplete={() => {}} onStartTutorialStage={() => {}} />
      )
    ).not.toThrow();
  });

  it('Tutorial source wires role="group" aria-label="Game features" on the features wrapper', () => {
    // The wrapper must carry a labelled group landmark so SR users tabbing
    // into the section hear "Game features, group" instead of 4 generic divs.
    expect(tutorialSrc).toMatch(
      /className="tutorial-features"[\s\S]{0,200}role="group"[\s\S]{0,200}aria-label="Game features"/
    );
  });

  it('Tutorial source wraps the 4 feature cards in <ul role="list">', () => {
    // SR users need a list role to hear "list of 4 items" when navigating
    // to the feature block. The <ul> must be inside the labelled group so
    // landmark navigation works.
    expect(tutorialSrc).toMatch(/role="list"\s+aria-label="Game features list"/);
    expect(tutorialSrc).toMatch(/<li className="feature">/);
  });

  it('Tutorial welcome page exposes role="region" tied to the H1 via aria-labelledby', () => {
    // Welcome page has a visible H1, so it carries an id that the surrounding
    // region references via aria-labelledby (matches Phase 27 ResultScreen).
    expect(tutorialSrc).toMatch(/aria-labelledby="tutorial-welcome-title"/);
    expect(tutorialSrc).toMatch(/id="tutorial-welcome-title"[^>]*>LingoType에 오신/);
  });
});

// ============================================================================
// Tutorial — page region landmarks + (Enter) suffix
// ============================================================================

describe('Phase 32 — Tutorial language + mechanics pages expose role="region" + (Enter) suffix', () => {
  it('Tutorial language page exposes role="region" aria-labelledby="tutorial-language-title"', () => {
    // The language page H1 is visually hidden via .visually-hidden (the new
    // Phase 32 utility) so the existing layout is unchanged but SR users
    // still hear the region name.
    expect(tutorialSrc).toMatch(
      /aria-labelledby="tutorial-language-title"[\s\S]{0,400}id="tutorial-language-title"/
    );
  });

  it('Tutorial mechanics page exposes role="region" aria-labelledby="tutorial-mechanics-title"', () => {
    expect(tutorialSrc).toMatch(
      /aria-labelledby="tutorial-mechanics-title"[\s\S]{0,400}id="tutorial-mechanics-title"/
    );
  });

  it('Tutorial language-page "Start tutorial stage" button carries (Enter) suffix', () => {
    // Matches the Phase 14/22/24/25/27/29 convention so SR users hear the
    // keyboard shortcut on the action that the visible small-text hint
    // references ("Press Enter to start the practice stage").
    expect(tutorialSrc).toMatch(
      /aria-label=\{`Start \$\{selectedLanguage\.toUpperCase\(\)\} tutorial stage \(Enter\)`\}/
    );
  });

  it('Tutorial mechanics-page "Complete tutorial" button carries (Enter) suffix', () => {
    // Matches the Phase 14/22/24/25/27/29 convention so the "Press Enter to
    // enter the game" small-text hint is also announced via the button name.
    expect(tutorialSrc).toMatch(
      /aria-label="Complete tutorial and enter menu \(Enter\)"/
    );
  });

  it('Tutorial mechanics-page "Finish tutorial" nav button carries (Enter) suffix', () => {
    // The mechanics nav button's aria-label uses a ternary to add the suffix
    // only on the final step. Verify both branches are intact.
    expect(tutorialSrc).toMatch(
      /mechanicsStep === GAME_MECHANICS\.length - 1[\s\S]{0,200}'Finish tutorial \(Enter\)'/
    );
  });
});

// ============================================================================
// Menu — tier section aria-labelledby + kbd-hint SR regression fix
// ============================================================================

describe('Phase 32 — Menu tier sections expose aria-labelledby tied to h3 + kbd-hint SR regression fix', () => {
  const baseProps = {
    language: 'en' as const,
    onStartStage: () => {},
    onShowCharacterSelect: () => {},
    onBackToLanguageSelect: () => {},
    stageRecords: {},
  };

  it('Menu renders the EN tiered stage grid without throwing (smoke)', () => {
    expect(() =>
      renderToStaticMarkup(<Menu {...baseProps} />)
    ).not.toThrow();
  });

  it('Menu source wires aria-labelledby on the Tier 0 <section>', () => {
    // Tier 0 only renders for JP (EN has no Tier 0) but the source-level
    // wiring must still declare aria-labelledby so the JP render gets the
    // landmark (matches Phase 27 ResultScreen region pattern).
    expect(menuSrc).toMatch(/aria-labelledby="tier-title-0"/);
  });

  it('Menu source wires aria-labelledby on each Tier 1-5 <section>', () => {
    // The Tier 1-5 map loop must declare aria-labelledby with the stable
    // per-tier id `tier-title-${tier}`. Look for both the section binding
    // and the matching h3 id within the loop body.
    expect(menuSrc).toMatch(/aria-labelledby=\{`tier-title-\$\{tier\}`\}/);
    expect(menuSrc).toMatch(/id=\{`tier-title-\$\{tier\}`\}/);
  });

  it('Menu source wires id="tier-title-0" on the Tier 0 h3 (matches section aria-labelledby)', () => {
    // Stable per-tier id so the aria-labelledby on the section resolves.
    expect(menuSrc).toMatch(/id="tier-title-0"[^>]*className="tier-title"/);
  });

  it('Menu source REMOVED the aria-label="Keyboard shortcuts" on the kbd-hint (SR regression fix)', () => {
    // The previous aria-label OVERRODE the readable <small><kbd> content.
    // SR users heard only "Keyboard shortcuts" and never learned the actual
    // shortcuts. Phase 32 removes it so the full hint is announced.
    // We check that the specific line is gone — the className is still
    // there but the aria-label attribute must NOT be present.
    expect(menuSrc).not.toMatch(
      /className="menu-kbd-hint"[\s\S]{0,200}aria-label="Keyboard shortcuts"/
    );
  });

  it('Menu source keeps the <kbd> key names so SR users hear the actual shortcuts', () => {
    // The kbd elements + visible text must still be in place — we're only
    // removing the aria-label override, not the content.
    expect(menuSrc).toMatch(/<kbd>←<\/kbd>\/<\w+>→<\/[^>]+>\/<\w+>↑<\/[^>]+>\/<\w+>↓<\/[^>]+>/);
    expect(menuSrc).toMatch(/<kbd>Enter<\/[^>]+>\s+start/);
    expect(menuSrc).toMatch(/<kbd>Esc<\/[^>]+>\s+back/);
  });
});

// ============================================================================
// style.css — visually-hidden utility (Phase 32)
// ============================================================================

describe('Phase 32 — style.css ships a .visually-hidden utility', () => {
  it('declares .visually-hidden with the standard 1px-clip-rect pattern', () => {
    // The utility must keep content accessible to AT but hidden visually.
    // Standard pattern: position:absolute + width:1px + height:1px + clip.
    expect(styleCssSrc).toMatch(/\.visually-hidden\s*\{/);
    expect(styleCssSrc).toMatch(
      /\.visually-hidden[\s\S]{0,400}position:\s*absolute[\s\S]{0,200}clip:\s*rect\(0,\s*0,\s*0,\s*0\)/
    );
  });

  it('Phase 32 visually-hidden block carries a phase-anchor comment', () => {
    // Matches the Phase 14/17/19/20/21/22/23/24/25/26/27/29/30/31 convention.
    expect(styleCssSrc).toMatch(/Phase 32:[\s\S]{0,800}\.visually-hidden\s*\{/);
  });
});