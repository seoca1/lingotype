/**
 * Phase 21 — Final polish + accessibility tests.
 *
 * Covers the three Phase 21 improvements layered on top of Phase 14/17/19/20:
 * - ResultScreen: the unlock + streak banners now expose role="status" +
 *   aria-live="polite" + aria-label so screen readers announce the celebration
 *   instead of going silent. Weak-word chips carry descriptive aria-labels.
 * - ProfileSelector: the "add profile" card was a div with no keyboard access;
 *   now it's a button with aria-label. The create modal is a proper dialog
 *   (role + aria-modal + aria-label) with input htmlFor/id binding. Avatars
 *   use role=radio so SR users get selection semantics.
 * - CharacterSelect: cards were divs without role/tabIndex — now they are
 *   role=radio cards with aria-checked + aria-label + Enter/Space keyboard
 *   activation. style.css gains focus-visible rules for both surfaces.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't fire
 * :focus-visible) and source-level checks confirm CSS rule coverage.
 */

// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProfileSelector } from '../../src/ui/ProfileSelector.js';
import { CharacterSelect } from '../../src/ui/CharacterSelect.js';
import type { UserProfile } from '../../src/types.js';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, '../../src/style.css'), 'utf-8');

const baseProfile: UserProfile = {
  id: 'p1',
  name: '테스트',
  avatar: '👤',
  createdAt: 1700000000000,
  lastPlayedAt: 1700000000000,
  progress: {
    level: 1,
    totalScore: 0,
    unlockedStages: [],
    achievements: [],
    stageRecords: {},
    stats: {
      totalEnemiesDefeated: 0,
      totalStagesCleared: 0,
      totalPlayTimeMs: 0,
      bestWpm: { en: 0, jp: 0, es: 0, kr: 0 },
      avgAccuracy: { en: 0, jp: 0, es: 0, kr: 0 },
    },
  },
};

const noop = () => {};
const noopDispatch = () => {};

// ============================================================================
// ResultScreen — phase 21 improvements live in this file but we test the
// resulting markup via a thin wrapper component. To keep the test surface
// narrow we test the source-level contract instead: the file MUST contain
// role="status" + aria-live for both banners.
// ============================================================================

describe('Phase 21 — ResultScreen banner + chip accessibility (source contract)', () => {
  const resultSrc = readFileSync(
    resolve(here, '../../src/ui/ResultScreen.tsx'),
    'utf-8'
  );

  it('unlock banner exposes role="status" + aria-live="polite"', () => {
    // The phase 21 fix wires role/aria-live into the result-unlock-banner div.
    // Source-level check is robust against jsdom's :focus-visible gap and
    // matches the pattern Phase 20 used for style.css coverage.
    expect(resultSrc).toMatch(/result-unlock-banner[\s\S]{0,200}role="status"/);
    expect(resultSrc).toMatch(/result-unlock-banner[\s\S]{0,200}aria-live="polite"/);
  });

  it('unlock banner exposes an aria-label summarizing the count', () => {
    expect(resultSrc).toMatch(/result-unlock-banner[\s\S]{0,300}aria-label=/);
  });

  it('streak banner exposes role="status" + aria-live="polite"', () => {
    expect(resultSrc).toMatch(/result-streak-banner[\s\S]{0,200}role="status"/);
    expect(resultSrc).toMatch(/result-streak-banner[\s\S]{0,200}aria-live="polite"/);
  });

  it('streak banner exposes an aria-label summarizing the streak state', () => {
    expect(resultSrc).toMatch(/result-streak-banner[\s\S]{0,300}aria-label=/);
  });

  it('weak-word chip button exposes a descriptive aria-label', () => {
    expect(resultSrc).toMatch(/weak-word-chip[\s\S]{0,400}aria-label=/);
  });
});

// ============================================================================
// ProfileSelector
// ============================================================================

describe('Phase 21 — ProfileSelector add-profile card is keyboard-accessible', () => {
  it('renders the add-profile card as a <button>, not a <div>', () => {
    const html = renderToStaticMarkup(
      <ProfileSelector
        profiles={[]}
        onSelect={noop}
        onCreate={noop}
        onDelete={noop}
      />
    );
    // Was: <div class="profile-card profile-card-add" ...>
    // Phase 21: <button type="button" class="profile-card profile-card-add" ...>
    expect(html).toMatch(
      /<button[^>]*type="button"[^>]*class="profile-card profile-card-add"/
    );
  });

  it('add-profile card exposes an aria-label so SR users hear "Create new profile"', () => {
    const html = renderToStaticMarkup(
      <ProfileSelector
        profiles={[]}
        onSelect={noop}
        onCreate={noop}
        onDelete={noop}
      />
    );
    expect(html).toMatch(
      /<button[^>]*class="profile-card profile-card-add"[^>]*aria-label="Create new profile"/
    );
  });
});

describe('Phase 21 — ProfileSelector create-modal is a proper dialog', () => {
  it('modal container exposes role="dialog" + aria-modal="true" + aria-label', () => {
    // We exercise the open state by mounting with a profile so the modal
    // can be triggered; since the modal is local state, we instead check
    // the source-level contract for the dialog wiring. This matches the
    // pattern Phase 20 used for component-internal CSS rules.
    const src = readFileSync(
      resolve(here, '../../src/ui/ProfileSelector.tsx'),
      'utf-8'
    );
    expect(src).toMatch(/role="dialog"/);
    expect(src).toMatch(/aria-modal="true"/);
    expect(src).toMatch(/aria-label="Create new profile"/);
  });

  it('name input is bound via id + htmlFor (label association)', () => {
    const src = readFileSync(
      resolve(here, '../../src/ui/ProfileSelector.tsx'),
      'utf-8'
    );
    expect(src).toMatch(/htmlFor="profile-name-input"/);
    expect(src).toMatch(/id="profile-name-input"/);
  });

  it('avatar options are exposed as role=radio with aria-checked', () => {
    const src = readFileSync(
      resolve(here, '../../src/ui/ProfileSelector.tsx'),
      'utf-8'
    );
    expect(src).toMatch(/role="radio"/);
    expect(src).toMatch(/aria-checked=/);
    expect(src).toMatch(/role="radiogroup"/);
  });
});

describe('Phase 21 — ProfileSelector profile-card buttons expose aria-labels', () => {
  it('play button on a profile card uses an aria-label that names the profile', () => {
    const html = renderToStaticMarkup(
      <ProfileSelector
        profiles={[baseProfile]}
        onSelect={noop}
        onCreate={noop}
        onDelete={noop}
      />
    );
    expect(html).toMatch(/aria-label="Play as 테스트"/);
  });

  it('delete button on a profile card uses an aria-label that names the profile', () => {
    const html = renderToStaticMarkup(
      <ProfileSelector
        profiles={[baseProfile]}
        onSelect={noop}
        onCreate={noop}
        onDelete={noop}
      />
    );
    expect(html).toMatch(/aria-label="Delete profile 테스트"/);
  });
});

// ============================================================================
// CharacterSelect
// ============================================================================

describe('Phase 21 — CharacterSelect cards are keyboard-accessible radios', () => {
  it('character-grid is a radiogroup with an aria-label', () => {
    const html = renderToStaticMarkup(
      <CharacterSelect language="en" dispatch={noopDispatch} />
    );
    expect(html).toMatch(/role="radiogroup"[^>]*class="character-grid"|class="character-grid"[^>]*role="radiogroup"/);
    expect(html).toMatch(/aria-label="Choose your character"/);
  });

  it('each character card is role=radio with aria-checked', () => {
    const html = renderToStaticMarkup(
      <CharacterSelect language="en" dispatch={noopDispatch} />
    );
    // 3 cards for the default language set; each must be role=radio.
    const radios = html.match(/role="radio"[^>]*aria-checked/g);
    expect(radios?.length ?? 0).toBe(3);
  });

  it('the selected card has aria-checked="true" and others aria-checked="false"', () => {
    const html = renderToStaticMarkup(
      <CharacterSelect language="en" dispatch={noopDispatch} />
    );
    // SelectedIndex starts at 0, so card 0 is checked.
    expect(html).toMatch(/class="character-card selected"[^>]*aria-checked="true"|role="radio"[^>]*aria-checked="true"[^>]*class="character-card selected"/);
  });

  it('each character card exposes a descriptive aria-label', () => {
    const html = renderToStaticMarkup(
      <CharacterSelect language="en" dispatch={noopDispatch} />
    );
    // The aria-label must mention "Press N to select" hint and the style.
    expect(html).toMatch(/aria-label="[^"]*Press \d+ to select/);
    expect(html).toMatch(/aria-label="[^"]*style\./);
  });

  it('confirm button exposes an aria-label naming the chosen character', () => {
    const html = renderToStaticMarkup(
      <CharacterSelect language="en" dispatch={noopDispatch} />
    );
    expect(html).toMatch(/aria-label="Confirm selection of/);
  });

  it('controls block has an aria-label so SR users hear "Keyboard shortcuts"', () => {
    const html = renderToStaticMarkup(
      <CharacterSelect language="en" dispatch={noopDispatch} />
    );
    expect(html).toMatch(/class="controls"[^>]*aria-label="Keyboard shortcuts"/);
  });
});

// ============================================================================
// style.css — phase 21 focus-visible coverage
// ============================================================================

describe('Phase 21 — style.css focus-visible coverage', () => {
  it('ships :focus-visible rule for .character-card', () => {
    expect(css).toMatch(/\.character-card:focus-visible/);
  });

  it('ships :focus-visible rule for .profile-card-add', () => {
    expect(css).toMatch(/\.profile-card-add:focus-visible/);
  });

  it('Phase 21 block has a phase anchor comment', () => {
    expect(css).toMatch(/\/\* Phase 21:.*focus-visible/);
  });

  it('preserves Phase 20 Menu + LanguageSelection focus-visible rules (regression)', () => {
    expect(css).toMatch(/\.back-btn:focus-visible/);
    expect(css).toMatch(/\.options-btn:focus-visible/);
    expect(css).toMatch(/\.language-card:focus-visible/);
  });

  it('preserves Phase 19 StageScreen focus-visible rules (regression)', () => {
    expect(css).toMatch(/\.stage-back-btn:focus-visible/);
    expect(css).toMatch(/\.stage-info \.toggle-btn:focus-visible/);
  });
});
