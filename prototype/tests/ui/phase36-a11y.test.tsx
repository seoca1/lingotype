/**
 * Phase 36 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31/32/33/34/35:
 *
 * - `MarkdownView` table semantics: tables rendered with no <caption> and
 *   no `scope="col"` on <th>, so SR users heard each cell in isolation
 *   (WCAG 1.3.1: info-and-relationships). Phase 36 wraps every table in
 *   a visually-hidden <caption> (using the Phase 32 `.visually-hidden`
 *   utility) and tags every header cell with `scope="col"` so SR engines
 *   announce header context with each data cell. The markdown source
 *   itself doesn't carry a caption attribute, so we synthesize one from
 *   the first header + "table" suffix, with a "Data table" fallback.
 *
 * - `SettingsScreen` volume slider ARIA progressbar-value pattern:
 *   Phase 26 added htmlFor + aria-valuetext="N percent" to the volume
 *   slider, but no aria-valuenow/valuemin/valuemax. Several SR engines
 *   (older VoiceOver, NVDA with default voice settings) only announce
 *   aria-valuenow and ignore aria-valuetext when both are present.
 *   Phase 36 adds the full progressbar-value tuple on a 0-100 percent
 *   scale so every SR engine hears the live numeric value while the
 *   existing aria-valuetext continues to carry the natural-language
 *   phrasing for engines that prefer it.
 *
 * - `ProfileSelector` avatar radiogroup arrow-key navigation: the
 *   avatar picker ships role="radiogroup" + 12 role="radio" buttons,
 *   but before Phase 36 keyboard-only users could NOT change their
 *   selection (only mouse click was wired). A radiogroup without
 *   arrow-key navigation violates WAI-ARIA Authoring Practices 1.2.
 *   Phase 36 adds onKeyDown to each avatar handling LeftArrow,
 *   RightArrow, UpArrow, DownArrow, Home, End with wrap-around, plus
 *   ref-based DOM focus tracking so the visual highlight follows
 *   keyboard selection (mirrors the Phase 27/29 LanguageSelection +
 *   Menu arrow-key pattern).
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/
 * 26/27/28/29/30/31/32/33/34/35).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownView } from '../../src/ui/MarkdownView.js';

const here = dirname(fileURLToPath(import.meta.url));
const markdownViewSrc = readFileSync(
  resolve(here, '../../src/ui/MarkdownView.tsx'),
  'utf-8'
);
const settingsScreenSrc = readFileSync(
  resolve(here, '../../src/ui/SettingsScreen.tsx'),
  'utf-8'
);
const profileSelectorSrc = readFileSync(
  resolve(here, '../../src/ui/ProfileSelector.tsx'),
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
// MarkdownView — table <caption> + scope="col" accessibility
// ============================================================================

describe('Phase 36 — MarkdownView table semantics (WCAG 1.3.1)', () => {
  it('renders a visually-hidden <caption> on every table (programmatic table name)', () => {
    const md = `
| Type | Mode | When |
| --- | --- | --- |
| ojala | subjuntivo | wishing |
`;
    const html = renderToStaticMarkup(<MarkdownView source={md} />);
    // Captions announce the table name on landmark nav in NVDA / JAWS.
    expect(html).toMatch(/<caption[^>]*>Data table|.*table<\/caption>/);
    expect(html).toMatch(/<caption[^>]*class="visually-hidden"/);
  });

  it('derives the caption text from the first header (e.g. "Type table")', () => {
    const md = `
| Type | Mode | When |
| --- | --- | --- |
| ojala | subjuntivo | wishing |
`;
    const html = renderToStaticMarkup(<MarkdownView source={md} />);
    // First header "Type" → caption "Type table" so SR users hearing the
    // landmark get a meaningful name like "Type table, table".
    expect(html).toMatch(/<caption[^>]*>Type table<\/caption>/);
  });

  it('tag every <th> with scope="col" so SR engines announce header context per cell', () => {
    const md = `
| Type | Mode | When |
| --- | --- | --- |
| ojala | subjuntivo | wishing |
`;
    const html = renderToStaticMarkup(<MarkdownView source={md} />);
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>Type<\/th>/);
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>Mode<\/th>/);
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>When<\/th>/);
  });

  it('table cell content still renders correctly after adding scope="col" (regression guard)', () => {
    const md = `
| Type | Mode | When |
| --- | --- | --- |
| ojala | subjuntivo | wishing |
`;
    const html = renderToStaticMarkup(<MarkdownView source={md} />);
    expect(html).toContain('<td>ojala</td>');
    expect(html).toContain('<td>subjuntivo</td>');
    expect(html).toContain('<td>wishing</td>');
  });

  it('MarkdownView source declares the case-tables branch with the new caption + scope attrs', () => {
    // Source-level guard: ensures the pattern doesn't drift back to the
    // pre-Phase-36 <th> without scope. The combined regex spans the full
    // Phase 36 block (caption + scope="col" on <th>) using a wider window
    // to tolerate the phase-anchor comment + captionText ternary logic.
    expect(markdownViewSrc).toMatch(/case 'table':[\s\S]{0,3000}<th[^>]*scope="col"/);
    expect(markdownViewSrc).toContain('<caption');
    expect(markdownViewSrc).toContain('className="visually-hidden"');
  });
});

// ============================================================================
// SettingsScreen — volume slider ARIA progressbar-value tuple
// ============================================================================

describe('Phase 36 — SettingsScreen volume slider ARIA progressbar-value', () => {
  it('volume slider source exposes aria-valuenow on a 0-100 percent scale', () => {
    // Phase 26 added aria-valuetext. Phase 36 adds the full
    // aria-valuenow/valuemin/valuemax tuple so SR engines that ignore
    // aria-valuetext still hear the numeric value.
    expect(settingsScreenSrc).toMatch(/aria-valuenow=\{Math\.round\(volume \* 100\)\}/);
    expect(settingsScreenSrc).toMatch(/aria-valuemin=\{0\}/);
    expect(settingsScreenSrc).toMatch(/aria-valuemax=\{100\}/);
  });

  it('volume slider preserves the existing aria-valuetext (regression guard)', () => {
    // Engines that prefer natural-language phrasing still hear
    // "50 percent" rather than the bare numeric "50".
    expect(settingsScreenSrc).toMatch(/aria-valuetext=\{?`\$\{Math\.round\(volume \* 100\)\} percent`/);
  });

  it('SettingsScreen source ships a phase-36 anchor comment for the ARIA progressbar-value upgrade', () => {
    // The convention documented across Phase 14/19/20/21/27/29/30/31/32/
    // 33/34/35 is to anchor every new a11y block with a phase-anchor
    // comment so future maintainers know why aria-valuenow was added.
    expect(settingsScreenSrc).toMatch(/Phase 36/);
  });
});

// ============================================================================
// ProfileSelector — avatar radiogroup arrow-key navigation
// ============================================================================

describe('Phase 36 — ProfileSelector avatar radiogroup arrow-key navigation', () => {
  it('ProfileSelector source declares avatarRefs as a ref array (focus tracking)', () => {
    // Phase 27/29 convention: a useRef array of HTMLButtonElement
    // references so arrow keys can move DOM focus along with state.
    expect(profileSelectorSrc).toMatch(/const avatarRefs = useRef<\(HTMLButtonElement \| null\)\[\]>/);
  });

  it('ProfileSelector source declares a handleAvatarKeyDown function', () => {
    // The handler handles LeftArrow, RightArrow, UpArrow, DownArrow,
    // Home, End and lets Space/Enter fall through to the click handler.
    expect(profileSelectorSrc).toMatch(/handleAvatarKeyDown/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'ArrowRight'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'ArrowLeft'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'ArrowDown'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'ArrowUp'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'Home'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'End'/);
  });

  it('handleAvatarKeyDown calls e.preventDefault() so arrows do not scroll the page or move caret', () => {
    // Widen the window across the arrow-key if/else block since the
    // preventDefault sits inside the last branch of the chain (after
    // up/down/home/end handling).
    expect(profileSelectorSrc).toMatch(/handleAvatarKeyDown[\s\S]{0,1500}e\.preventDefault\(\)/);
  });

  it('handleAvatarKeyDown wraps around the avatar list (last → first, first → last)', () => {
    // WAI-ARIA radiogroup pattern requires wrap-around at the edges so
    // users never get stuck at index 0 or the last index.
    expect(profileSelectorSrc).toMatch(/const last = AVATAR_OPTIONS\.length - 1/);
    expect(profileSelectorSrc).toMatch(/nextIndex = index === last \? 0 : index \+ 1/);
    expect(profileSelectorSrc).toMatch(/nextIndex = index === 0 \? last : index - 1/);
  });

  it('handleAvatarKeyDown updates selectedAvatar state AND focuses the new button via the ref', () => {
    // Mirrors the Phase 29 Menu ref-tracking pattern so DOM focus follows
    // the visual highlight (otherwise SR users would hear the state move
    // but DOM focus stay put).
    expect(profileSelectorSrc).toMatch(/setSelectedAvatar\(next\)/);
    expect(profileSelectorSrc).toMatch(/avatarRefs\.current\[nextIndex\]\?\.focus\(\)/);
  });

  it('every avatar button source wires the ref-setter callback (focusable target available)', () => {
    expect(profileSelectorSrc).toMatch(/ref=\{\(el\) => \{ avatarRefs\.current\[idx\] = el; \}\}/);
  });

  it('every avatar button source wires onKeyDown to handleAvatarKeyDown(idx)', () => {
    expect(profileSelectorSrc).toMatch(/onKeyDown=\{\(e\) => handleAvatarKeyDown\(e, idx\)\}/);
  });

  it('ProfileSelector renders the avatar radiogroup with role="radiogroup" + role="radio" (regression guard)', () => {
    // Sanity check that the existing radiogroup + radio roles are still
    // there — Phase 36 only added keyboard handling, didn't rewrite
    // markup. Source-level since the modal-open branch only renders when
    // the user clicks "+ 새 프로필", which jsdom can't drive without
    // event-shim plumbing (covered by Phase 21 modal-source tests).
    expect(profileSelectorSrc).toMatch(/role="radiogroup"/);
    expect(profileSelectorSrc).toMatch(/role="radio"/);
  });
});
