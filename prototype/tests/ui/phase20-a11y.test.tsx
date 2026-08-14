/**
 * Phase 20 — Final polish + accessibility tests.
 *
 * Covers the three Phase 20 improvements layered on top of Phase 14/17/19:
 * - style.css ships :focus-visible rules for Menu header buttons
 *   (Back / Options / Settings / Character-select) and the language
 *   selection cards. Phase 14/19 covered modal screens; Phase 20
 *   covers the persistent menu/landing-screen buttons that Phase 14
 *   already labelled but didn't style.
 * - DailyLessonCard's three action buttons (Read more / Practice /
 *   Later) now expose aria-labels so screen readers announce the
 *   translated button text rather than reading only the emoji prefix.
 *
 * style.css rules are tested via file source because :focus-visible
 * only fires under real keyboard interaction (jsdom doesn't honor it).
 * Component markup is tested via renderToStaticMarkup so we don't
 * need a DOM.
 */

// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DailyLessonCard } from '../../src/ui/DailyLessonCard.js';
import type { DailyLesson } from '../../src/data/dailyLessons.js';

const sampleLesson: DailyLesson = {
  id: 'test_lesson',
  date: '2026-08-14',
  language: 'en',
  sourceTopic: 'test topic',
  difficulty: { tier: 2, cefr: 'A2', primaryStage: 'en_2_1' },
  source: { rawFile: 'test/raw.md' },
  raw: {
    sourceFile: 'test/raw.md',
    excerpt: 'A short excerpt used by the test fixture to render the card body.',
  },
  wiki: {
    vocabulary: [],
    expressions: [],
    culture: null,
  },
  meta: {
    estimatedReadMinutes: 3,
    relatedStages: ['en_2_1'],
  },
};

describe('Phase 20 — DailyLessonCard accessible action buttons', () => {
  const noop = () => {};
  const noopStage = (_id: string) => {};

  it('primary read-more button exposes aria-label so screen readers announce it', () => {
    const html = renderToStaticMarkup(
      <DailyLessonCard
        lesson={sampleLesson}
        onOpen={noop}
        onSkip={noop}
        onPractice={noopStage}
      />
    );
    // Primary button always renders; the aria-label mirrors the translated
    // text so SR users hear "Read more" / "자세히 보기" / "詳しく読む" / etc.
    // Exact text varies by nativeLanguage, so we check for the aria-label
    // attribute on the primary class only.
    expect(html).toMatch(
      /<button[^>]*class="[^"]*daily-lesson-card__btn--primary[^"]*"[^>]*aria-label="[^"]+"/
    );
  });

  it('secondary practice button gets an aria-label when related stages exist', () => {
    const html = renderToStaticMarkup(
      <DailyLessonCard
        lesson={sampleLesson}
        onOpen={noop}
        onSkip={noop}
        onPractice={noopStage}
      />
    );
    expect(html).toMatch(
      /<button[^>]*class="[^"]*daily-lesson-card__btn--secondary[^"]*"[^>]*aria-label="[^"]+"/
    );
  });

  it('tertiary later button exposes aria-label', () => {
    const html = renderToStaticMarkup(
      <DailyLessonCard
        lesson={sampleLesson}
        onOpen={noop}
        onSkip={noop}
        onPractice={noopStage}
      />
    );
    expect(html).toMatch(
      /<button[^>]*class="[^"]*daily-lesson-card__btn--tertiary[^"]*"[^>]*aria-label="[^"]+"/
    );
  });

  it('all three buttons each carry their own aria-label (no duplicate, no missing)', () => {
    const html = renderToStaticMarkup(
      <DailyLessonCard
        lesson={sampleLesson}
        onOpen={noop}
        onSkip={noop}
        onPractice={noopStage}
      />
    );
    // Count aria-label occurrences on the three card buttons — must be 3.
    const ariaLabels = html.match(
      /<button[^>]*class="[^"]*daily-lesson-card__btn[^"]*"[^>]*aria-label="[^"]+"/g
    );
    expect(ariaLabels?.length ?? 0).toBe(3);
  });
});

describe('Phase 20 — style.css focus-visible coverage', () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const css = readFileSync(
    resolve(here, '../../src/style.css'),
    'utf-8'
  );

  it('ships focus-visible rules for Menu header buttons (Back / Options / Settings / Character-select)', () => {
    expect(css).toMatch(/\.back-btn:focus-visible/);
    expect(css).toMatch(/\.options-btn:focus-visible/);
    expect(css).toMatch(/\.settings-btn:focus-visible/);
    expect(css).toMatch(/\.character-select-btn:focus-visible/);
  });

  it('ships focus-visible rule for the language-card landing selector', () => {
    // The landing screen keyboard nav was invisible before Phase 20.
    expect(css).toMatch(/\.language-card:focus-visible/);
  });

  it('preserves the Phase 19 StageScreen focus-visible rules', () => {
    // Regression guard: Phase 20 must not remove the Phase 19 selectors.
    expect(css).toMatch(/\.stage-info \.toggle-btn:focus-visible/);
    expect(css).toMatch(/\.stage-info input\[type="range"\]:focus-visible/);
    expect(css).toMatch(/\.stage-back-btn:focus-visible/);
  });

  it('preserves the OptionsScreen / SettingsScreen focus-visible rules from Phase 14', () => {
    // Phase 14 rules live in component-internal <style> blocks; source-level check.
    const here2 = dirname(fileURLToPath(import.meta.url));
    const opts = readFileSync(
      resolve(here2, '../../src/ui/OptionsScreen.tsx'),
      'utf-8'
    );
    const sets = readFileSync(
      resolve(here2, '../../src/ui/SettingsScreen.tsx'),
      'utf-8'
    );
    expect(opts).toMatch(/\.options-screen__close:focus-visible/);
    expect(opts).toMatch(/\.options-toggle input:focus-visible/);
    expect(opts).toMatch(/\.options-difficulty__btn:focus-visible/);
    expect(opts).toMatch(/\.options-reset:focus-visible/);
    expect(sets).toMatch(/\.settings-screen__close:focus-visible/);
    expect(sets).toMatch(/\.settings-lang-btn:focus-visible/);
  });

  it('Phase 20 block has a phase anchor comment', () => {
    // Phase-tagged comments in style.css are how the project tracks which
    // phase introduced which rule. Keep the convention alive.
    expect(css).toMatch(/\/\* Phase 20:.*focus-visible/);
  });
});