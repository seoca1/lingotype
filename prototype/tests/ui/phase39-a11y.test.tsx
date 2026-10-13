/**
 * Phase 39 — a11y: new uiTranslations keys + translatable Settings indicator
 * and LanguageSelection footer.
 *
 * Ported from the remote phase39-a11y suite (commit 1ba7d1c), adapted to the
 * local implementation: the footer flows through t('footerHint'/'languagesSupported',
 * getNativeLanguage()) and the saved indicator class is `settings-saved-indicator`.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SettingsScreen } from '../../src/ui/SettingsScreen.js';
import { LanguageSelection } from '../../src/ui/LanguageSelection.js';
import { t } from '../../src/data/uiTranslations.js';

const here = dirname(fileURLToPath(import.meta.url));
const settingsSrc = readFileSync(
  resolve(here, '../../src/ui/SettingsScreen.tsx'),
  'utf-8'
);
const languageSelectionSrc = readFileSync(
  resolve(here, '../../src/ui/LanguageSelection.tsx'),
  'utf-8'
);
const uiTranslationsSrc = readFileSync(
  resolve(here, '../../src/data/uiTranslations.ts'),
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

if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
  (window as unknown as { speechSynthesis: { cancel: () => void; speak: () => void } }).speechSynthesis = {
    cancel: () => {},
    speak: () => {},
  };
}

beforeEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

describe('Phase 39 — uiTranslations registers the new keys for all 4 native languages', () => {
  it('settingsSaved key exists in UI_STRINGS with en/ko/ja/es translations', () => {
    expect(uiTranslationsSrc).toMatch(/settingsSaved:\s*\{/);
    expect(uiTranslationsSrc).toMatch(/settingsSaved:\s*\{[\s\S]{0,300}en:\s*['"]/);
    expect(uiTranslationsSrc).toMatch(/settingsSaved:\s*\{[\s\S]{0,300}ko:\s*['"]/);
    expect(uiTranslationsSrc).toMatch(/settingsSaved:\s*\{[\s\S]{0,500}ja:\s*['"]/);
    expect(uiTranslationsSrc).toMatch(/settingsSaved:\s*\{[\s\S]{0,700}es:\s*['"]/);
  });

  it('pressEscToClose key exists with en/ko/ja/es translations', () => {
    expect(uiTranslationsSrc).toMatch(/pressEscToClose:\s*\{/);
    expect(uiTranslationsSrc).toMatch(/pressEscToClose:\s*\{[\s\S]{0,300}en:\s*['"]/);
    expect(uiTranslationsSrc).toMatch(/pressEscToClose:\s*\{[\s\S]{0,300}ko:\s*['"]/);
    expect(uiTranslationsSrc).toMatch(/pressEscToClose:\s*\{[\s\S]{0,500}ja:\s*['"]/);
    expect(uiTranslationsSrc).toMatch(/pressEscToClose:\s*\{[\s\S]{0,700}es:\s*['"]/);
  });

  it('footerHint + languagesSupported keys exist with en/ko/ja/es translations', () => {
    expect(uiTranslationsSrc).toMatch(/footerHint:\s*\{/);
    expect(uiTranslationsSrc).toMatch(/languagesSupported:\s*\{/);
    expect(uiTranslationsSrc).toMatch(
      /footerHint:\s*\{[\s\S]{0,600}languagesSupported:\s*\{[\s\S]{0,700}es:\s*['"]/
    );
  });

  it('t() returns the per-language settingsSaved for each native language (smoke)', () => {
    expect(t('settingsSaved', 'en')).toMatch(/Settings saved/);
    expect(t('settingsSaved', 'ko')).toMatch(/저장/);
    expect(t('settingsSaved', 'ja')).toMatch(/保存/);
    expect(t('settingsSaved', 'es')).toMatch(/guardados/);
  });
});

describe('Phase 39 — SettingsScreen saved indicator is now translatable', () => {
  it('SettingsScreen source wires the saved indicator through t() instead of hardcoded English', () => {
    expect(settingsSrc).toMatch(/t\('settingsSaved',\s*native\)/);
    expect(settingsSrc).not.toMatch(/>\s*✓\s*Settings saved\s*</);
  });

  it('SettingsScreen source keeps role="status" + aria-live="polite" on the saved indicator (regression guard)', () => {
    const indicatorBlock = settingsSrc.match(
      /<div[\s\S]{0,500}data-testid="settings-saved-indicator"/
    );
    expect(indicatorBlock).not.toBeNull();
    expect(indicatorBlock![0]).toMatch(/role="status"/);
    expect(indicatorBlock![0]).toMatch(/aria-live="polite"/);
    expect(indicatorBlock![0]).toMatch(/className="settings-saved-indicator"/);
  });

  it('SettingsScreen footer hint now flows through t() (no more hardcoded "Press Esc to close")', () => {
    expect(settingsSrc).toMatch(/t\('pressEscToClose',\s*native\)/);
    expect(settingsSrc).not.toMatch(/Press Esc to close/);
  });

  it('SettingsScreen renders without throwing (Phase 39 t() wiring is safe)', () => {
    expect(() =>
      renderToStaticMarkup(<SettingsScreen onClose={() => {}} />)
    ).not.toThrow();
  });
});

describe('Phase 39 — LanguageSelection footer counts flow through t() + aria-describedby wired', () => {
  it('LanguageSelection source imports getNativeLanguage + t from uiTranslations', () => {
    expect(languageSelectionSrc).toMatch(/import\s*\{[^}]*getNativeLanguage[^}]*\}\s*from\s*['"]\.\.\/data\/nativeLanguage\.js['"]/);
    expect(languageSelectionSrc).toMatch(/import\s*\{[^}]*\bt\b[^}]*\}\s*from\s*['"]\.\.\/data\/uiTranslations\.js['"]/);
  });

  it('LanguageSelection source no longer hardcodes the Korean footer counts', () => {
    const jsxRegion = languageSelectionSrc.match(/<\/header>[\s\S]{0,3000}<\/div>/);
    expect(jsxRegion).not.toBeNull();
    expect(jsxRegion![0]).not.toMatch(/>\s*\{languages\.length\}개 언어 지원/);
    expect(languageSelectionSrc).toMatch(/t\('footerHint',\s*getNativeLanguage\(\)\)/);
    expect(languageSelectionSrc).toMatch(/t\('languagesSupported',\s*getNativeLanguage\(\)\)/);
  });

  it('LanguageSelection source wires aria-describedby="language-selection-footer-info" on the grid', () => {
    expect(languageSelectionSrc).toMatch(
      /className="language-grid"[\s\S]{0,400}aria-describedby="language-selection-footer-info"/
    );
  });

  it('LanguageSelection exposes the footer-info id on the supporting <p>', () => {
    expect(languageSelectionSrc).toMatch(/id="language-selection-footer-info"/);
  });

  it('LanguageSelection renders the translated footer for KO native (smoke)', () => {
    localStorage.setItem('typing-language-native-language', 'ko');
    const html = renderToStaticMarkup(<LanguageSelection onSelectLanguage={() => {}} />);
    expect(html).toMatch(/language-selection-footer-info/);
    expect(html).toMatch(/aria-describedby="language-selection-footer-info"/);
  });
});
