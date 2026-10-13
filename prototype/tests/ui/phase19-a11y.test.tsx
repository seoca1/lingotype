/**
 * Phase 19 — a11y: OSKeyboardInput BCP-47 lang mapping, StageScreen
 * audio/back-button semantics, OptionsScreen reset indicator, style.css
 * focus-visible coverage.
 *
 * Ported from the remote phase19-a11y suite (commit 1ba7d1c), adapted to the
 * local prop/type surface (OSKeyboardInputHandle ref, RefObject<HTMLCanvasElement | null>).
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRef } from 'react';
import { OSKeyboardInput, type OSKeyboardInputHandle } from '../../src/ui/OSKeyboardInput.js';
import { OptionsScreen } from '../../src/ui/OptionsScreen.js';
import { StageScreen } from '../../src/ui/StageScreen.js';
import { initialState } from '../../src/state/gameReducer.js';
import type { RefObject } from 'react';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const STORAGE_KEY = 'lingotype-options';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
  vi.useRealTimers();
});

describe('Phase 19 — OSKeyboardInput Chinese lang attribute', () => {
  const noop = () => {};

  it('zh language emits lang="zh-CN" for the hidden input', () => {
    const ref = createRef<OSKeyboardInputHandle>();
    const html = renderToStaticMarkup(
      <OSKeyboardInput
        ref={ref}
        enabled={true}
        language="zh"
        onChar={noop}
        onBackspace={noop}
        onEnter={noop}
      />
    );
    expect(html).toMatch(/lang="zh-CN"/);
  });

  it('all 7 supported languages get a mapped BCP 47 tag (zh included)', () => {
    const ref = createRef<OSKeyboardInputHandle>();
    const cases: Array<[string, string]> = [
      ['en', 'en'],
      ['jp', 'ja'],
      ['kr', 'ko'],
      ['es', 'es'],
      ['fr', 'fr'],
      ['de', 'de'],
      ['zh', 'zh-CN'],
    ];
    for (const [lang, expected] of cases) {
      const html = renderToStaticMarkup(
        <OSKeyboardInput
          ref={ref}
          enabled={true}
          language={lang}
          onChar={noop}
          onBackspace={noop}
          onEnter={noop}
        />
      );
      expect(html, `language=${lang}`).toMatch(new RegExp(`lang="${expected.replace('-', '\\-')}"`));
    }
  });

  it('unknown language still falls back to English (graceful default)', () => {
    const ref = createRef<OSKeyboardInputHandle>();
    const html = renderToStaticMarkup(
      <OSKeyboardInput
        ref={ref}
        enabled={true}
        language="xx-unknown"
        onChar={noop}
        onBackspace={noop}
        onEnter={noop}
      />
    );
    expect(html).toMatch(/lang="en"/);
  });
});

describe('Phase 19 — StageScreen audio + back button accessibility', () => {
  const baseProps = {
    canvasRef: { current: null } as unknown as RefObject<HTMLCanvasElement | null>,
    state: initialState,
    stage: null,
    languageLabel: 'Chinese (中文)',
    onBackToMenu: () => {},
  };

  it('Back button keeps the (Escape) suffix in its aria-label', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toContain('aria-label="Back to menu (Escape)"');
  });

  it('stage-back-btn class is wired for CSS focus-visible targeting', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toMatch(/class="[^"]*stage-back-btn[^"]*"/);
  });

  it('audio toggle button is rendered in both enabled/disabled states', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toContain('class="toggle-btn"');
    expect(html).toMatch(/aria-label="(Mute|Enable) sound effects"/);
  });

  it('audio toggle exposes aria-pressed reflecting state', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toMatch(/aria-pressed="(true|false)"/);
  });

  it('StageScreen source binds the volume slider id to its label', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const src = readFileSync(resolve(here, '../../src/ui/StageScreen.tsx'), 'utf-8');
    expect(src).toContain('id="stage-volume-slider"');
    expect(src).toMatch(/htmlFor="stage-volume-slider"/);
    expect(src).toContain('aria-valuetext');
  });
});

describe('Phase 19 — OptionsScreen reset indicator', () => {
  it('OptionsScreen renders without throwing (reset timer ref wired)', () => {
    expect(() =>
      renderToStaticMarkup(<OptionsScreen onClose={() => {}} />)
    ).not.toThrow();
  });

  it('does NOT show the reset indicator on first render (zero state)', () => {
    const html = renderToStaticMarkup(<OptionsScreen onClose={() => {}} />);
    expect(html).not.toContain('data-testid="options-reset-indicator"');
    expect(html).toContain('aria-label="Reset options to defaults"');
  });
});

describe('Phase 19 — style.css focus-visible coverage', () => {
  it('style.css ships focus-visible rules for the new StageScreen selectors', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const css = readFileSync(resolve(here, '../../src/style.css'), 'utf-8');
    expect(css).toMatch(/\.stage-info \.toggle-btn:focus-visible/);
    expect(css).toMatch(/\.stage-info input\[type="range"\]:focus-visible/);
    expect(css).toMatch(/\.stage-back-btn:focus-visible/);
  });
});
