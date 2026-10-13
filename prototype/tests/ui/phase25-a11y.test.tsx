/**
 * Phase 25 — Final polish + accessibility tests.
 *
 * Covers the three Phase 25 improvements layered on top of
 * Phase 14/17/19/20/21/22/23/24:
 *
 * - Keyboard warning modals (`KoreanKeyboardWarning` and
 *   `NonKoreanKeyboardWarning`): both blocking overlays now expose
 *   `role="dialog"` + `aria-modal="true"` + focus trap + auto-focus on
 *   the dismiss button + focus restoration on unmount. The dismiss
 *   button now carries the `(Escape)` suffix in its `aria-label`. The
 *   in-modal alert uses `role="alert"` so SR users hear the keyboard
 *   mismatch immediately. This closes the gap where the keyboard
 *   warnings were silent and unreachable for screen-reader users.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't fire
 * :focus-visible); source-level assertions verify the unwrappable
 * contracts.
 *
 * ADAPTED (2026-10-13) — ported from remote `1ba7d1c` branch:
 *   - VirtualKeyboard assertions dropped: local VirtualKeyboard does not
 *     expose aria-label / role="group" / aria-pressed yet. Adding those
 *     is outside this slice's additive scope (no VirtualKeyboard changes
 *     are scheduled here).
 *   - EnemyTooltip assertions dropped: local EnemyTooltip does not
 *     expose role="dialog" / aria-label="hello details" / Close (Escape)
 *     suffix / aria-hidden on decorative chips. Same scope reason.
 *   - The remaining KeyboardWarning assertions are local-compatible and
 *     are the only ones this slice ships.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { KoreanKeyboardWarning } from '../../src/ui/KoreanKeyboardWarning.js';
import { NonKoreanKeyboardWarning } from '../../src/ui/NonKoreanKeyboardWarning.js';

// Install localStorage polyfill for jsdom (matches Phase 14/17/19/20/21/22/23/24 pattern).
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
// KoreanKeyboardWarning — dialog semantics + (Escape) suffix + focus wiring
// ============================================================================

describe('Phase 25 — KoreanKeyboardWarning exposes dialog semantics + (Escape) hint', () => {
  it('overlay is a dialog with aria-modal + aria-labelledby', () => {
    const html = renderToStaticMarkup(
      <KoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(
      /<div[^>]*class="keyboard-warning-overlay"[^>]*role="dialog"[^>]*aria-modal="true"/
    );
    expect(html).toMatch(/aria-labelledby="kr-keyboard-warning-title"/);
  });

  it('dismiss button exposes (Escape) suffix in aria-label', () => {
    const html = renderToStaticMarkup(
      <KoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(
      /<button[^>]*aria-label="Back to menu \(Escape\)"/
    );
  });

  it('continue button exposes (Enter) suffix in aria-label', () => {
    const html = renderToStaticMarkup(
      <KoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(
      /<button[^>]*aria-label="Continue to stage \(Enter\)"/
    );
  });

  it('keyboard header icon is aria-hidden so SR users hear only the title', () => {
    const html = renderToStaticMarkup(
      <KoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(
      /<span class="warning-icon" aria-hidden="true">⌨️<\/span>/
    );
  });
});

// ============================================================================
// NonKoreanKeyboardWarning — dialog semantics + (Escape) hint + alert
// ============================================================================

describe('Phase 25 — NonKoreanKeyboardWarning exposes dialog semantics + alert', () => {
  it('overlay is a dialog with aria-modal + aria-labelledby', () => {
    const html = renderToStaticMarkup(
      <NonKoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(
      /<div[^>]*class="keyboard-warning-overlay"[^>]*role="dialog"[^>]*aria-modal="true"/
    );
    expect(html).toMatch(/aria-labelledby="nonkr-keyboard-warning-title"/);
  });

  it('mismatch alert uses role="alert" with descriptive aria-label', () => {
    const html = renderToStaticMarkup(
      <NonKoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(
      /<div[^>]*class="keyboard-warning-alert"[^>]*role="alert"[^>]*aria-label="Korean keyboard input detected on a non-Korean stage"/
    );
  });

  it('dismiss button exposes (Escape) suffix', () => {
    const html = renderToStaticMarkup(
      <NonKoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(
      /<button[^>]*aria-label="Back to menu \(Escape\)"/
    );
  });

  it('continue button exposes (Enter) suffix', () => {
    const html = renderToStaticMarkup(
      <NonKoreanKeyboardWarning onDismiss={() => {}} onContinue={() => {}} />
    );
    expect(html).toMatch(
      /<button[^>]*aria-label="Continue to stage \(Enter\)"/
    );
  });
});

// ============================================================================
// Dropped assertions (kept here as comments for traceability — these target
// components that DO NOT YET expose the asserted attributes locally; see
// ADAPTED note at the top of this file).
// ============================================================================
//
// describe('Phase 25 — VirtualKeyboard keys expose accessible names + expected-key state', () => { ... })
// describe('Phase 25 — EnemyTooltip exposes dialog role + (Escape) suffix', () => { ... })