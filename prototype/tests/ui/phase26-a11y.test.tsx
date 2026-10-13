/**
 * Phase 26 — Final polish + accessibility tests (Slice 3 port + Slice 4a
 * SettingsScreen re-enable).
 *
 * Covers three small UX/a11y improvements from the remote Phase 26:
 *
 * - `SettingsScreen` sound toggle: now uses `id="settings-sound-toggle"`
 *   + explicit `htmlFor` pairing + `aria-label` on the checkbox input.
 * - `SettingsScreen` volume slider: now uses `id="settings-volume-slider"`
 *   + explicit `htmlFor` binding + `aria-label` + `aria-valuenow`,
 *   `aria-valuemin`, `aria-valuemax`, `aria-valuetext`.
 * - `MarkdownView` TTS button: now exposes `aria-pressed="false"` by
 *   default and a dynamic `aria-label="Listen to pronunciation" | "Stop
 *   pronunciation"` reflecting the `speaking` state.
 *
 * ADAPTED (2026-10-13) from remote `1ba7d1c:tests/ui/phase26-a11y.test.tsx`,
 *   RE-ENABLED (2026-10-13) Slice 4a:
 *   - `SettingsScreen` sound toggle htmlFor/id pairing: RE-ENABLED —
 *     Slice 4a adds `id="settings-sound-toggle"`,
 *     `htmlFor="settings-sound-toggle"`, and `aria-label={t('sound',
 *     native)}` on the checkbox input. The formerly-skipped
 *     assertions are now real source-level checks.
 *   - `SettingsScreen` volume slider id/htmlFor + aria-valuetext /
 *     aria-valuenow / valuemin / valuemax: RE-ENABLED — Slice 4a adds
 *     `id="settings-volume-slider"`, `htmlFor="settings-volume-slider"`,
 *     `aria-label={t('volume', native)}`, and the full
 *     aria-valuenow/valuemin/valuemax/aria-valuetext tuple. The
 *     remote's progressbar role is added too.
 *   - `MarkdownView` TtsButton aria-pressed reflects speaking state:
 *     skipped — local MarkdownView's TtsButton carries a static
 *     `aria-label="Listen to pronunciation"` but does NOT yet wire
 *     `aria-pressed={speaking}` nor the dynamic Listen/Stop aria-label
 *     ternary. Adding the dynamic wiring touches a different code path
 *     in the same file and is outside Slice 4a's SettingsScreen scope.
 *     Reason: `feature-deferred: out of Slice 4a scope`.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownView } from '../../src/ui/MarkdownView.js';

const here = dirname(fileURLToPath(import.meta.url));
const settingsSrc = readFileSync(
  resolve(here, '../../src/ui/SettingsScreen.tsx'),
  'utf-8'
);
const markdownSrc = readFileSync(
  resolve(here, '../../src/ui/MarkdownView.tsx'),
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

// Stub window.speechSynthesis (used by SettingsScreen's TTS preview).
if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
  (window as unknown as { speechSynthesis: { cancel: () => void; speak: () => void } }).speechSynthesis = {
    cancel: () => {},
    speak: () => {},
  };
}

beforeEach(() => {
  localStorage.clear();
});

// ============================================================================
// Phase 26 — SettingsScreen sound toggle htmlFor/id + aria-label
// (RE-ENABLED in Slice 4a)
// ============================================================================
describe('Phase 26 — SettingsScreen sound toggle exposes htmlFor/id pairing (RE-ENABLED in Slice 4a)', () => {
  it('toggle label has htmlFor="settings-sound-toggle"', () => {
    expect(settingsSrc).toMatch(/htmlFor="settings-sound-toggle"/);
  });

  it('toggle input has id="settings-sound-toggle"', () => {
    expect(settingsSrc).toMatch(/id="settings-sound-toggle"/);
  });

  it('toggle input exposes aria-label naming the sound preference', () => {
    expect(settingsSrc).toMatch(/id="settings-sound-toggle"[\s\S]*?aria-label=\{t\('sound'/);
  });
});

// ============================================================================
// Phase 26 — SettingsScreen volume slider id/htmlFor + aria-valuetext
// (RE-ENABLED in Slice 4a)
// ============================================================================
describe('Phase 26 — SettingsScreen volume slider exposes id/htmlFor + aria-valuetext (RE-ENABLED in Slice 4a)', () => {
  it('volume label has htmlFor="settings-volume-slider"', () => {
    expect(settingsSrc).toMatch(/htmlFor="settings-volume-slider"/);
  });

  it('volume input has id="settings-volume-slider"', () => {
    expect(settingsSrc).toMatch(/id="settings-volume-slider"/);
  });

  it('volume input exposes aria-label + aria-valuetext for SR users', () => {
    expect(settingsSrc).toMatch(/id="settings-volume-slider"[\s\S]*?aria-label=\{t\('volume'/);
    expect(settingsSrc).toMatch(/aria-valuetext=\{`\$\{Math\.round\(volume \* 100\)\} percent`\}/);
  });
});

// ============================================================================
// Phase 26 — MarkdownView TtsButton aria-pressed reflects speaking state
// (still DEFERRED — out of Slice 4a scope)
// ============================================================================
describe('Phase 26 — MarkdownView TtsButton exposes aria-pressed for speaking state', () => {
  it('TtsButton source wires aria-pressed={speaking} on the button', () => {
    expect(markdownSrc).toMatch(/aria-pressed=\{speaking\}/);
  });

  it('TtsButton source uses dynamic aria-label (Listen vs Stop)', () => {
    expect(markdownSrc).toMatch(
      /aria-label=\{speaking \? 'Stop pronunciation' : 'Listen to pronunciation'\}/
    );
  });

  it('list-item TtsButton renders aria-pressed="false" by default', () => {
    const html = renderToStaticMarkup(
      <MarkdownView source="- First item" enableTts ttsLanguage="en" />
    );
    const matches = html.match(
      /<button[^>]*aria-label="Listen to pronunciation"[^>]*aria-pressed="false"[^>]*>/g
    );
    expect(matches).not.toBeNull();
    expect(matches!.length).toBe(1);
  });

  it('callout TtsButton renders aria-pressed="false" by default', () => {
    const html = renderToStaticMarkup(
      <MarkdownView source="!> [tip] Tip content" enableTts ttsLanguage="en" />
    );
    expect(html).toMatch(
      /<button[^>]*aria-label="Listen to pronunciation"[^>]*aria-pressed="false"/
    );
  });

  it('every TtsButton has aria-pressed wired (regression guard)', () => {
    const html = renderToStaticMarkup(
      <MarkdownView
        source={'# Title\n\nBody paragraph.\n\n- One\n- Two\n\n!> [warning] Beware'}
        enableTts
        ttsLanguage="en"
      />
    );
    const buttons = html.match(
      /<button[^>]*aria-label="Listen to pronunciation"[^>]*aria-pressed="false"[^>]*>/g
    );
    expect(buttons).not.toBeNull();
    expect(buttons!.length).toBeGreaterThanOrEqual(3);
  });
});
