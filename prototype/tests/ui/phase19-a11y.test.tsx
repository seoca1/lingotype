/**
 * Phase 19 — Final polish + Chinese accessibility tests.
 *
 * Covers the three Phase 19 improvements layered on top of Phase 14/17:
 * - OSKeyboardInput BCP 47 lang attribute now maps Chinese ('zh') to
 *   'zh-CN' (Simplified pinyin IME). Previously fell through to 'en'.
 * - StageScreen audio controls + Back button now expose accessible
 *   labels; volume slider has an explicit id+label pair so the input
 *   isn't a label-less lone range input.
 * - OptionsScreen "Reset to defaults" now surfaces a transient toast
 *   indicator (role="status" + aria-live="polite") confirming the
 *   silent reset ran.
 *
 * OSKeyboardInput renders an <input lang="..."> in its output; we test
 * via renderToStaticMarkup on a minimal prop set so we don't need a DOM.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRef } from 'react';
import { OSKeyboardInput } from '../../src/ui/OSKeyboardInput.js';
import { OptionsScreen } from '../../src/ui/OptionsScreen.js';
import { StageScreen } from '../../src/ui/StageScreen.js';
import { initialState } from '../../src/state/gameReducer.js';
import type { RefObject } from 'react';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Polyfill localStorage so OptionsScreen doesn't choke during the
// saveOptions useEffect — same shim used by optionsStorage.test.tsx.
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
    const ref = createRef<{ focus: () => void }>();
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
    // Simplified Chinese BCP 47 — pinyin IME hint for mobile OS keyboards.
    expect(html).toMatch(/lang="zh-CN"/);
  });

  it('all 7 supported languages get a mapped BCP 47 tag (zh included)', () => {
    const ref = createRef<{ focus: () => void }>();
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
    const ref = createRef<{ focus: () => void }>();
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
    canvasRef: { current: null } as RefObject<HTMLCanvasElement>,
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
    // Slider block is gated on audio.isEnabled(); jsdom has no AudioContext,
    // so the AudioManager singleton reports disabled and the slider doesn't
    // render here. The audio toggle IS always rendered, so we verify its
    // accessible name instead (works for either state).
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toContain('class="toggle-btn"');
    expect(html).toMatch(/aria-label="(Mute|Enable) sound effects"/);
  });

  it('audio toggle exposes aria-pressed reflecting state', () => {
    const html = renderToStaticMarkup(<StageScreen {...baseProps} />);
    expect(html).toMatch(/aria-pressed="(true|false)"/);
  });

  it('StageScreen source binds the volume slider id to its label', () => {
    // Slider markup only renders when audio.isEnabled() === true. jsdom
    // has no AudioContext, so the slider block doesn't render here.
    // Source-level check: when the manager IS enabled (real browser),
    // the label-for / slider-id pair must be wired correctly.
    const here = dirname(fileURLToPath(import.meta.url));
    const src = readFileSync(
      resolve(here, '../../src/ui/StageScreen.tsx'),
      'utf-8'
    );
    expect(src).toContain('id="stage-volume-slider"');
    expect(src).toMatch(/htmlFor="stage-volume-slider"/);
    expect(src).toContain('aria-valuetext');
  });
});

describe('Phase 19 — OptionsScreen reset indicator', () => {
  it('OptionsScreen renders without throwing (reset timer ref wired)', () => {
    // Defensive: the new useRef for the reset-feedback timer must not
    // crash the render path under renderToStaticMarkup. If the hook order
    // is wrong, React 18 throws "Rendered more hooks than during the
    // previous render" and this test goes red.
    expect(() =>
      renderToStaticMarkup(<OptionsScreen onClose={() => {}} />)
    ).not.toThrow();
  });

  it('does NOT show the reset indicator on first render (zero state)', () => {
    const html = renderToStaticMarkup(<OptionsScreen onClose={() => {}} />);
    // The reset-feedback banner uses a unique testid; the "Reset to defaults"
    // text also appears in the reset button itself, so we test only for the
    // unique indicator testid. The CSS class lives in the embedded <style>
    // block which is part of every render, so we can't use it as a
    // state-distinguishing signal here.
    expect(html).not.toContain('data-testid="options-reset-indicator"');
    // The reset button (which triggers the indicator) is still rendered.
    expect(html).toContain('aria-label="Reset options to defaults"');
  });
});

describe('Phase 19 — style.css focus-visible coverage', () => {
  it('style.css ships focus-visible rules for the new StageScreen selectors', () => {
    // Read the CSS module and verify the Phase 19 rules landed. We test the
    // CSS source rather than rendered output because focus-visible only
    // fires under real keyboard interaction (jsdom doesn't honor it).
    const here = dirname(fileURLToPath(import.meta.url));
    const filePath = resolve(here, '../../src/style.css');
    const css = readFileSync(filePath, 'utf-8');
    expect(css).toMatch(/\.stage-info \.toggle-btn:focus-visible/);
    expect(css).toMatch(/\.stage-info input\[type="range"\]:focus-visible/);
    expect(css).toMatch(/\.stage-back-btn:focus-visible/);
  });
});
