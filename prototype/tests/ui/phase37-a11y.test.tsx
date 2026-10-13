/**
 * Phase 37 — a11y: ResultScreen missions list semantics.
 *
 * Ported from the remote phase37-a11y suite (commit 1ba7d1c). The remote
 * WeakWordModal-TTS and CharacterSelect-cardRefs blocks are deferred locally
 * (the local WeakWordModal is the weak-words panel, and CharacterSelect does
 * not yet carry cardRefs DOM-focus tracking).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { ResultScreen } from '../../src/ui/ResultScreen.js';
import type { MissionConfig } from '../../src/types.js';

const here = dirname(fileURLToPath(import.meta.url));
const resultScreenSrc = readFileSync(
  resolve(here, '../../src/ui/ResultScreen.tsx'),
  'utf-8'
);

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

describe('Phase 37 — ResultScreen missions list exposes role="list" + role="listitem"', () => {
  it('missions container is a labelled list landmark (WCAG 1.3.1: info-and-relationships)', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toMatch(/<div class="result-missions" role="list" aria-labelledby="result-missions-heading">/);
  });

  it('each mission row is tagged as a listitem so the list has a real group of items', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    const missionsBlock = html.match(/<div class="result-missions"[\s\S]*?<\/div>\s*<\/div>/);
    expect(missionsBlock).not.toBeNull();
    const listitemCount = (missionsBlock![0].match(/role="listitem"/g) ?? []).length;
    expect(listitemCount).toBe(3);
  });

  it('missions h2 carries id="result-missions-heading" so aria-labelledby resolves', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toContain('id="result-missions-heading"');
  });

  it('per-row aria-label still names cleared/failed (Phase 24 regression guard)', () => {
    const html = renderToStaticMarkup(<ResultScreen {...baseProps} />);
    expect(html).toContain('aria-label="Defeat 5 enemies: cleared"');
    expect(html).toContain('aria-label="90% accuracy: failed"');
    expect(html).toContain('aria-label="Combo 10: cleared"');
  });

  it('ResultScreen source declares the phase-37 anchor comment for the list semantics change', () => {
    expect(resultScreenSrc).toMatch(/Phase 37/);
  });
});

describe.skip('Phase 37 — WeakWordModal TTS button (DEFERRED: local WeakWordModal is the weak-words panel, not the selected-word dialog)', () => {
  it.skip('[feature-deferred: local WeakWordModal takes {words}, remote takes {selected, onClose} + a TTS button] TTS button source grants aria-label that names the word being spoken', () => {});
  it.skip('[feature-deferred: local WeakWordModal takes {words}, remote takes {selected, onClose} + a TTS button] WeakWordModal TTS button still has aria-label after the rename (renderToStaticMarkup smoke)', () => {});
  it.skip('[feature-deferred: local WeakWordModal takes {words}, remote takes {selected, onClose} + a TTS button] TTS button source still preserves the visible "🔊 Listen" text (regression guard)', () => {});
});

describe.skip('Phase 37 — CharacterSelect cardRefs DOM focus tracking (DEFERRED: local CharacterSelect has no cardRefs array yet)', () => {
  it.skip('[feature-deferred: local CharacterSelect does not implement cardRefs/DOM focus tracking] CharacterSelect declares cardRefs as a ref array (focus tracking)', () => {});
  it.skip('[feature-deferred: not implemented locally] the dropdown no longer carries the old imgRefs array', () => {});
  it.skip('[feature-deferred: not implemented locally] each card mounts a ref-setter that populates cardRefs', () => {});
  it.skip('[feature-deferred: not implemented locally] arrow-key handler calls .focus() on cardRefs.current[next]', () => {});
  it.skip('[feature-deferred: not implemented locally] ArrowRight wrap-around moves focus to index 0 when at index 2', () => {});
  it.skip('[feature-deferred: not implemented locally] number-key shortcuts (1, 2, 3) also move DOM focus to the matching card', () => {});
  it.skip('[feature-deferred: not implemented locally] CharacterSelect ships a phase-37 anchor comment for the cardRefs refactor', () => {});
  it.skip('[feature-deferred: not implemented locally] CharacterSelect still ships role="radiogroup" + role="radio" (regression guard)', () => {});
});
