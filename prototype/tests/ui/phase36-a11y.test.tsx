/**
 * Phase 36 — Final polish + accessibility tests (Slice 3 port + Slice 4a
 * SettingsScreen ARIA progressbar-value + ProfileSelector avatar radiogroup
 * re-enable).
 *
 * Covers the Phase 36 improvements adopted into Slice 3 + the SettingsScreen
 * slider progressbar-value tuple + avatar radiogroup re-enabled by Slice 4a
 * (and the avatar arrow-key nav that landed in the uncommitted slice 0-3
 * ProfileSelector changes which Slice 4a leaves intact per task spec):
 *
 * - `MarkdownView` table semantics (WCAG 1.3.1 info-and-relationships).
 * - `SettingsScreen` volume slider ARIA progressbar-value tuple (Slice 4a).
 * - `ProfileSelector` avatar radiogroup + arrow-key navigation (slice 0-3).
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase36-a11y.test.tsx`,
 *   RE-ENABLED (2026-10-13) Slice 4a:
 *   - `SettingsScreen` volume slider ARIA progressbar-value tuple:
 *     RE-ENABLED — Slice 4a adds the full
 *     aria-valuenow/valuemin/valuemax/aria-valuetext tuple on a 0-100
 *     percent scale.
 *   - `ProfileSelector` avatar radiogroup arrow-key navigation:
 *     RE-ENABLED — slice 0-3 left `avatarRefs` /
 *     `handleAvatarKeyDown` / `role="radiogroup"` / `role="radio"` in
 *     place; Slice 4a leaves those uncommitted changes intact per task
 *     spec ("Do NOT revert uncommitted slice 0–3 changes"). The
 *     formerly-skipped assertions are now real source-level checks.
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
    // The caption text is synthesised from the first header — here "Type"
    // → "Type table".
    expect(html).toMatch(/<caption[^>]*>Type table<\/caption>/);
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

  it('falls back to "Data table" caption when the header row is empty', () => {
    const md = `
|  |  |  |
| --- | --- | --- |
| ojala | subjuntivo | wishing |
`;
    const html = renderToStaticMarkup(<MarkdownView source={md} />);
    expect(html).toMatch(/<caption[^>]*>Data table<\/caption>/);
  });

  it('tags every <th> with scope="col" so SR engines announce header context per cell', () => {
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
    expect(markdownViewSrc).toMatch(/case 'table'[\s\S]{0,3000}<th[^>]*scope="col"/);
    expect(markdownViewSrc).toContain('<caption');
    expect(markdownViewSrc).toContain('className="visually-hidden"');
  });
});

// ============================================================================
// Out-of-scope skip blocks — referenced above; listed here so a future
// auditor can see at a glance which remote assertions were deferred
// rather than silently dropped.
// ============================================================================

// Slice 4a: SettingsScreen volume slider ARIA progressbar-value block
// RE-ENABLED. Slice 4a adds the full aria-valuenow/valuemin/valuemax +
// aria-valuetext tuple. The previously-skipped assertions are now real.
describe('Phase 36 — SettingsScreen volume slider ARIA progressbar-value (RE-ENABLED in Slice 4a)', () => {
  it('volume slider source exposes aria-valuenow on a 0-100 percent scale', () => {
    expect(settingsScreenSrc).toMatch(/aria-valuenow=\{Math\.round\(volume \* 100\)\}/);
    expect(settingsScreenSrc).toMatch(/aria-valuemin=\{0\}/);
    expect(settingsScreenSrc).toMatch(/aria-valuemax=\{100\}/);
  });

  it('volume slider preserves the existing aria-valuetext (regression guard)', () => {
    expect(settingsScreenSrc).toMatch(/aria-valuetext=\{`\$\{Math\.round\(volume \* 100\)\} percent`\}/);
  });

  it('SettingsScreen source ships a Phase 36 anchor comment for the ARIA progressbar-value upgrade', () => {
    expect(settingsScreenSrc).toMatch(/Phase 36/);
  });
});

// Slice 4a + slice 0-3: ProfileSelector avatar radiogroup arrow-key
// navigation block RE-ENABLED. Slice 0-3 left avatarRefs +
// handleAvatarKeyDown in place; Slice 4a leaves those uncommitted
// changes intact. The previously-skipped assertions are now real.
describe('Phase 36 — ProfileSelector avatar radiogroup arrow-key navigation (RE-ENABLED in Slice 4a)', () => {
  it('ProfileSelector source declares avatarRefs as a ref array (focus tracking)', () => {
    expect(profileSelectorSrc).toMatch(
      /const avatarRefs = useRef<\(HTMLButtonElement \| null\)\[\]>/
    );
  });

  it('ProfileSelector source declares a handleAvatarKeyDown function', () => {
    expect(profileSelectorSrc).toMatch(/handleAvatarKeyDown/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'ArrowRight'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'ArrowLeft'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'ArrowDown'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'ArrowUp'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'Home'/);
    expect(profileSelectorSrc).toMatch(/e\.key === 'End'/);
  });

  it('handleAvatarKeyDown calls e.preventDefault() so arrows do not scroll the page or move caret', () => {
    expect(profileSelectorSrc).toMatch(
      /handleAvatarKeyDown[\s\S]{0,1000}e\.preventDefault\(\)/
    );
  });

  it('handleAvatarKeyDown wraps around the avatar list (last → first, first → last)', () => {
    expect(profileSelectorSrc).toMatch(/index === last \? 0 : index \+ 1/);
    expect(profileSelectorSrc).toMatch(/index === 0 \? last : index - 1/);
  });

  it('handleAvatarKeyDown updates selectedAvatar state AND focuses the new button via the ref', () => {
    expect(profileSelectorSrc).toMatch(/setSelectedAvatar\(next\)/);
    expect(profileSelectorSrc).toMatch(/avatarRefs\.current\[nextIndex\]\?\.focus\(\)/);
  });

  it('every avatar button source wires the ref-setter callback', () => {
    expect(profileSelectorSrc).toMatch(/ref=\{\(el\) => \{ avatarRefs\.current\[idx\] = el; \}\}/);
  });

  it('every avatar button source wires onKeyDown to handleAvatarKeyDown(idx)', () => {
    expect(profileSelectorSrc).toMatch(/onKeyDown=\{\(e\) => handleAvatarKeyDown\(e, idx\)\}/);
  });
});
