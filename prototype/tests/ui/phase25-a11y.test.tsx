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
 * - `VirtualKeyboard` keys: each key button now exposes a descriptive
 *   `aria-label` (`"key K"`, `"key ㅎ"`, etc.) instead of relying on
 *   the visible glyph. The expected next key announces
 *   `aria-pressed="true"` and appends `, expected next` to its label.
 *   The shift toggle and the Backspace / Space / Enter controls also
 *   got accessible names. The keyboard wrapper itself now exposes
 *   `role="group"` + `aria-label="Virtual keyboard"`.
 *
 * - `EnemyTooltip`: the hover tooltip now exposes `role="dialog"` +
 *   `aria-label="<word> details"` so SR users get a labelled container
 *   for meaning + pronunciation + meta. The close button label carries
 *   the `(Escape)` suffix. Decorative emoji meta chips are now
 *   `aria-hidden` so SR users don't get redundant "📁 greeting" reading.
 *
 * Component markup is tested via renderToStaticMarkup (jsdom doesn't fire
 * :focus-visible); source-level assertions verify the unwrappable
 * contracts.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { KoreanKeyboardWarning } from '../../src/ui/KoreanKeyboardWarning.js';
import { NonKoreanKeyboardWarning } from '../../src/ui/NonKoreanKeyboardWarning.js';
import { VirtualKeyboard } from '../../src/ui/VirtualKeyboard.js';
import { EnemyTooltip } from '../../src/ui/EnemyTooltip.js';
import type { Target } from '../../src/types.js';

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

// Stub window.speechSynthesis (used by EnemyTooltip's TTS button) — jsdom
// doesn't ship it.
if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
  (window as any).speechSynthesis = {
    cancel: () => {},
    speak: () => {},
  };
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
// VirtualKeyboard — accessible key labels + expected-key announcement
// ============================================================================

describe('Phase 25 — VirtualKeyboard keys expose accessible names + expected-key state', () => {
  it('keyboard wrapper exposes role="group" + aria-label', () => {
    const html = renderToStaticMarkup(
      <VirtualKeyboard language="en" onKeyPress={() => {}} />
    );
    expect(html).toMatch(
      /<div[^>]*class="virtual-keyboard"[^>]*role="group"[^>]*aria-label="Virtual keyboard"/
    );
  });

  it('each key carries an aria-label starting with "key "', () => {
    const html = renderToStaticMarkup(
      <VirtualKeyboard language="en" onKeyPress={() => {}} />
    );
    // Spot-check several QWERTY keys
    expect(html).toMatch(/aria-label="key a"/);
    expect(html).toMatch(/aria-label="key s"/);
    expect(html).toMatch(/aria-label="key d"/);
    expect(html).toMatch(/aria-label="key z"/);
  });

  it('expected key announces aria-pressed + ", expected next" suffix', () => {
    const html = renderToStaticMarkup(
      <VirtualKeyboard language="en" expectedChar="s" onKeyPress={() => {}} />
    );
    expect(html).toMatch(/<button[^>]*aria-label="key s, expected next"[^>]*aria-pressed="true"/);
  });

  it('non-expected keys do NOT carry aria-pressed', () => {
    const html = renderToStaticMarkup(
      <VirtualKeyboard language="en" expectedChar="s" onKeyPress={() => {}} />
    );
    // 'a' is not the expected one — should not have aria-pressed
    expect(html).not.toMatch(/<button[^>]*aria-label="key a"[^>]*aria-pressed/);
  });

  it('control buttons expose descriptive aria-labels (Space / Backspace / Enter / Shift)', () => {
    const html = renderToStaticMarkup(
      <VirtualKeyboard language="en" onKeyPress={() => {}} />
    );
    expect(html).toMatch(/aria-label="Space"/);
    expect(html).toMatch(/aria-label="Backspace"/);
    expect(html).toMatch(/aria-label="Enter"/);
    expect(html).toMatch(/aria-label="Shift, off"/);
  });
});

// ============================================================================
// EnemyTooltip — dialog semantics + (Escape) suffix on close
// ============================================================================

const sampleTarget: Target = {
  text: 'hello',
  acceptedInputs: ['hello'],
  meaning: 'greeting',
  category: 'greeting',
  level: 1,
};

describe('Phase 25 — EnemyTooltip exposes dialog role + (Escape) suffix', () => {
  it('tooltip is a dialog labelled with the word details', () => {
    const html = renderToStaticMarkup(
      <EnemyTooltip
        target={sampleTarget}
        x={100}
        y={100}
        language="en"
        onTtsPlay={() => {}}
        onClose={() => {}}
      />
    );
    expect(html).toMatch(/<div[^>]*class="enemy-tooltip"[^>]*role="dialog"/);
    expect(html).toMatch(/aria-label="hello details"/);
  });

  it('close button exposes (Escape) suffix in its aria-label', () => {
    const html = renderToStaticMarkup(
      <EnemyTooltip
        target={sampleTarget}
        x={100}
        y={100}
        language="en"
        onTtsPlay={() => {}}
        onClose={() => {}}
      />
    );
    expect(html).toMatch(/aria-label="Close \(Escape\)"/);
  });

  it('decorative meta chips are aria-hidden so SR users do not hear "folder greeting"', () => {
    const html = renderToStaticMarkup(
      <EnemyTooltip
        target={sampleTarget}
        x={100}
        y={100}
        language="en"
        onTtsPlay={() => {}}
        onClose={() => {}}
      />
    );
    expect(html).toMatch(/<span class="enemy-tooltip__cat" aria-hidden="true">📁 greeting<\/span>/);
  });
});
