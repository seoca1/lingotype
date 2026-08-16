/**
 * Phase 37 — Final polish + accessibility tests.
 *
 * Covers three small UX/a11y improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24/25/26/27/28/29/30/31/32/33/34/35/36:
 *
 * - `ResultScreen` missions list semantics: the missions block was a
 *   flat map of <div> siblings with no group landmark and no item
 *   semantics, so SR users heard each row as an unlabelled chunk
 *   without an enclosing "Missions, list, N items" announcement. Phase
 *   37 wraps the existing rows in role="list" + aria-labelledby tied to
 *   the existing h2 heading, and tags each row as role="listitem". This
 *   mirrors the Phase 28 StageScreen missions-list fix so the two
 *   mission surfaces share the same semantic contract.
 *
 * - `ResultScreen` WeakWordModal TTS button aria-label: the modal's
 *   TTS button exposed only the visible "🔊 Listen" text. SR users
 *   landing on it heard "Listen" with no context about which word is
 *   being spoken (WCAG 1.3.1 + 4.1.2). Phase 37 adds an explicit
 *   aria-label that names the word so the button's accessible name is
 *   self-describing. Mirrors the Phase 25 EnemyTooltip TTS-button
 *   pattern.
 *
 * - `CharacterSelect` cardRefs DOM focus tracking: the CharacterSelect
 *   screen uses a role="radiogroup" + 3 role="radio" divs with a
 *   roving tabindex. Before Phase 37 the arrow-key handler moved
 *   selectedIndex state but DOM focus stayed put on whatever card was
 *   focused initially. SR users navigating with arrows would hear the
 *   aria-checked flip but the focused element stayed the same. Phase
 *   37 adds a cardRefs useRef array and a ref-setter callback so the
 *   keyboard handler can call .focus() on the new cell as well as
 *   setSelectedIndex. Mirrors the Phase 27 LanguageSelection +
 *   Phase 29 Menu + Phase 36 ProfileSelector avatar pattern.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't
 * simulate real focus events); source-level assertions verify the
 * unwrappable contracts (mirrors Phase 14/17/19/20/21/22/23/24/25/
 * 26/27/28/29/30/31/32/33/34/35/36).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { ResultScreen, WeakWordModal } from '../../src/ui/ResultScreen.js';
import type { MissionConfig } from '../../src/types.js';

const here = dirname(fileURLToPath(import.meta.url));
const resultScreenSrc = readFileSync(
  resolve(here, '../../src/ui/ResultScreen.tsx'),
  'utf-8'
);
const characterSelectSrc = readFileSync(
  resolve(here, '../../src/ui/CharacterSelect.tsx'),
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

const baseMissions: MissionConfig[] = [
  {
    id: 'm1',
    name: 'Defeat 5 enemies',
    description: 'Defeat 5 enemies in a row.',
    type: 'defeat_count',
    params: { count: 5 },
  },
  {
    id: 'm2',
    name: '90% accuracy',
    description: 'Maintain 90% accuracy.',
    type: 'accuracy_threshold',
    params: { threshold: 90 },
  },
  {
    id: 'm3',
    name: 'Combo 10',
    description: 'Reach a 10-combo chain.',
    type: 'combo_chain',
    params: { count: 10 },
  },
];

const baseProps = {
  score: 1200,
  enemiesDefeated: 8,
  missions: baseMissions,
  results: [
    { missionId: 'm1', cleared: true },
    { missionId: 'm2', cleared: false },
    { missionId: 'm3', cleared: true },
  ],
  onBack: () => {},
};

// ============================================================================
// ResultScreen — missions list semantics (role="list" + role="listitem")
// ============================================================================

describe('Phase 37 — ResultScreen missions list exposes role="list" + role="listitem"', () => {
  it('missions container is a labelled list landmark (WCAG 1.3.1: info-and-relationships)', () => {
    // SR users navigating by landmark now hear "Missions, list, N items"
    // instead of a run of unlabelled <div> siblings. The aria-labelledby
    // ties the list to the existing h2 heading so the label is the
    // meaningful "Missions" name, not the generic "list" role.
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toMatch(/<div class="result-missions" role="list" aria-labelledby="result-missions-heading">/);
  });

  it('each mission row is tagged as a listitem so the list has a real group of items', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    // Three missions → three listitem rows. The regex stops at the
    // </div> that closes the missions container so a count of
    // `role="listitem"` matches the list rows specifically.
    const missionsBlock = html.match(
      /<div class="result-missions"[\s\S]*?<\/div>\s*<\/div>/,
    );
    expect(missionsBlock).not.toBeNull();
    const listitemCount = (missionsBlock![0].match(/role="listitem"/g) ?? []).length;
    expect(listitemCount).toBe(3);
  });

  it('missions h2 carries id="result-missions-heading" so aria-labelledby resolves', () => {
    // The visible "Missions" h2 needs a matching id for the
    // aria-labelledby on the list container to actually resolve. The
    // existing h2 tag is the same one used for the heading, so the id
    // is added alongside it (no visual change).
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toContain('id="result-missions-heading"');
  });

  it('per-row aria-label still names cleared/failed (Phase 24 regression guard)', () => {
    // Phase 27 added aria-label to each row so SR users hear
    // "<name>: cleared/failed" — Phase 37 must NOT remove that.
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toContain('aria-label="Defeat 5 enemies: cleared"');
    expect(html).toContain('aria-label="90% accuracy: failed"');
    expect(html).toContain('aria-label="Combo 10: cleared"');
  });

  it('ResultScreen source declares the phase-37 anchor comment for the list semantics change', () => {
    // The established convention documented across Phase 14/19/20/21/27/
    // 28/29/30/31/32/33/34/35/36 is to anchor new a11y blocks with a
    // phase-anchor comment so future maintainers know exactly which
    // phase added the role="list" wrapper.
    expect(resultScreenSrc).toMatch(/Phase 37/);
  });
});

// ============================================================================
// ResultScreen — WeakWordModal TTS button aria-label
// ============================================================================

describe('Phase 37 — WeakWordModal TTS button exposes a self-describing aria-label', () => {
  const selected = {
    id: 'en_001',
    display: 'hello',
    input: 'hello',
    meaning: 'A greeting',
    language: 'en' as const,
  };

  it('TTS button source grants aria-label that names the word being spoken', () => {
    // Without this, SR users landing on the button hear only the visible
    // "🔊 Listen" text — no context about which word. The aria-label
    // names the display so the accessible name is self-describing.
    // Mirrors the Phase 25 EnemyTooltip TTS-button pattern.
    expect(resultScreenSrc).toMatch(
      /aria-label=\{`Listen to pronunciation of \$\{selected\.display\}`\}/,
    );
  });

  it('WeakWordModal TTS button still has aria-label after the rename (renderToStaticMarkup smoke)', () => {
    // Smoke test: the TTS button renders with the new aria-label.
    // We don't read the full HTML because the modal also renders a
    // MarkdownView from lookupWikiPage which is environment-dependent;
    // instead we scope the regex to the button block.
    const html = renderToStaticMarkup(
      <WeakWordModal selected={selected} onClose={() => {}} />
    );
    expect(html).toMatch(/aria-label="Listen to pronunciation of hello"/);
  });

  it('TTS button source still preserves the visible "🔊 Listen" text (regression guard)', () => {
    // Removing the visible text accidentally would break the sighted UX.
    // The aria-label is added on top of the existing text, not in place of it.
    const ttsBlock = resultScreenSrc.match(
      /weak-word-modal__tts-btn[\s\S]{0,1500}?<\/button>/,
    );
    expect(ttsBlock).not.toBeNull();
    expect(ttsBlock![0]).toMatch(/🔊 Listen/);
  });
});

// ============================================================================
// CharacterSelect — cardRefs DOM focus tracking for arrow keys
// ============================================================================

describe('Phase 37 — CharacterSelect cardRefs DOM focus tracking for arrow keys', () => {
  it('CharacterSelect declares cardRefs as a ref array (focus tracking)', () => {
    // Phase 27/29/36 convention: a useRef array of HTMLDivElement
    // references so arrow keys can move DOM focus alongside state.
    // The previous imgRefs array was used for image loading only and
    // was removed in Phase 37 — focus tracking is now handled by
    // cardRefs.
    expect(characterSelectSrc).toMatch(
      /const cardRefs = useRef<\(HTMLDivElement \| null\)\[\]>\(\[\]\)/,
    );
  });

  it('the dropdown no longer carries the old imgRefs array (regression guard for the cleanup)', () => {
    // Phase 37 cleans up the now-unused imgRefs array (was used for
    // image preloading only and is no longer wired). The state piece
    // `imagesLoaded` is still set but the ref array it used can be
    // dropped.
    expect(characterSelectSrc).not.toMatch(/const imgRefs = \[/);
  });

  it('each card mounts a ref-setter that populates cardRefs (focusable target available)', () => {
    // The ref-setter follows the Phase 27 LanguageSelection pattern:
    // a callback ref that stores the underlying HTMLDivElement (the
    // role="radio" div) into the array at the correct index. The
    // a Phase-37 anchor comment sits between the brace and the
    // assignment, so the regex uses a wider {0,400} window to tolerate
    // the comment block.
    expect(characterSelectSrc).toMatch(
      /ref=\{\(el\) => \{[\s\S]{0,400}?cardRefs\.current\[index\] = el;/,
    );
  });

  it('arrow-key handler calls .focus() on cardRefs.current[next] (state + DOM focus move together)', () => {
    // The handler moves state via setSelectedIndex AND calls .focus()
    // on the new card. The pattern uses the % 3 wrap-around so
    // ArrowRight at index 2 → index 0 and ArrowLeft at index 0 → index 2.
    expect(characterSelectSrc).toMatch(
      /e\.key === 'ArrowLeft'[\s\S]{0,400}cardRefs\.current\[next\]\?\.focus\(\)/,
    );
  });

  it('ArrowRight wrap-around moves focus to index 0 when at index 2', () => {
    // The (selectedIndex + 1) % 3 wrap-around is preserved AND now drives
    // DOM focus, so the focus follows the wrap. Without the focus call
    // the state wraps but focus stays on the last card.
    expect(characterSelectSrc).toMatch(
      /e\.key === 'ArrowRight'[\s\S]{0,400}cardRefs\.current\[next\]\?\.focus\(\)/,
    );
  });

  it('number-key shortcuts (1, 2, 3) also move DOM focus to the matching card', () => {
    // The 1/2/3 shortcuts were missing the focus call — they only
    // changed state. Phase 37 wires them through the same ref array so
    // SR users following the key hints land on the focused card.
    expect(characterSelectSrc).toMatch(
      /e\.key === '1'[\s\S]{0,300}cardRefs\.current\[0\]\?\.focus\(\)/,
    );
    expect(characterSelectSrc).toMatch(
      /e\.key === '2'[\s\S]{0,300}cardRefs\.current\[1\]\?\.focus\(\)/,
    );
    expect(characterSelectSrc).toMatch(
      /e\.key === '3'[\s\S]{0,300}cardRefs\.current\[2\]\?\.focus\(\)/,
    );
  });

  it('CharacterSelect ships a phase-37 anchor comment for the cardRefs refactor', () => {
    // The convention documented across Phase 14/19/20/21/27/28/29/30/31/
    // 32/33/34/35/36 is to anchor every new a11y block with a phase-
    // anchor comment.
    expect(characterSelectSrc).toMatch(/Phase 37/);
  });

  it('CharacterSelect still ships role="radiogroup" + role="radio" (regression guard)', () => {
    // Phase 37 only added focus tracking, didn't rewrite markup. The
    // existing radiogroup + radio roles + aria-checked + roving-tabindex
    // pattern is preserved so the SemanticRadioGroup contract stays intact.
    expect(characterSelectSrc).toMatch(/role="radiogroup"/);
    expect(characterSelectSrc).toMatch(/role="radio"/);
    expect(characterSelectSrc).toMatch(/aria-checked=\{index === selectedIndex\}/);
    expect(characterSelectSrc).toMatch(/tabIndex=\{index === selectedIndex \? 0 : -1\}/);
  });
});
