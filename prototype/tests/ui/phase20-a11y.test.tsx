/**
 * Phase 20 — a11y: DailyLessonCard action-button aria-labels + focus-visible coverage.
 *
 * Ported from the remote phase20-a11y suite (commit 1ba7d1c) and adapted to the
 * local API: the remote fixture carried `difficulty`/`source` fields the local
 * DailyLesson type does not declare, so the sample is cast via `unknown`.
 *
 * style.css `:focus-visible` rules are checked via file source (jsdom does not
 * apply :focus-visible under renderToStaticMarkup).
 */

// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DailyLessonCard } from '../../src/ui/DailyLessonCard.js';
import type { DailyLesson } from '../../src/data/dailyLessons.js';

const sampleLesson = {
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
} as unknown as DailyLesson;

describe('Phase 20 — DailyLessonCard accessible action buttons', () => {
  const noop = () => {};
  const noopStage = () => {};

  it('primary read-more button exposes aria-label so screen readers announce it', () => {
    const html = renderToStaticMarkup(
      <DailyLessonCard
        lesson={sampleLesson}
        onOpen={noop}
        onSkip={noop}
        onPractice={noopStage}
      />
    );
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
    const ariaLabels = html.match(
      /<button[^>]*class="[^"]*daily-lesson-card__btn[^"]*"[^>]*aria-label="[^"]+"/g
    );
    expect(ariaLabels?.length ?? 0).toBe(3);
  });
});

describe('Phase 20 — style.css focus-visible coverage', () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const css = readFileSync(resolve(here, '../../src/style.css'), 'utf-8');

  it('ships focus-visible rules for Menu header buttons (Back / Options / Settings / Character-select)', () => {
    expect(css).toMatch(/\.back-btn:focus-visible/);
    expect(css).toMatch(/\.options-btn:focus-visible/);
    expect(css).toMatch(/\.settings-btn:focus-visible/);
    expect(css).toMatch(/\.character-select-btn:focus-visible/);
  });

  it('ships focus-visible rule for the language-card landing selector', () => {
    expect(css).toMatch(/\.language-card:focus-visible/);
  });

  it('preserves the Phase 19 StageScreen focus-visible rules', () => {
    expect(css).toMatch(/\.stage-info \.toggle-btn:focus-visible/);
    expect(css).toMatch(/\.stage-info input\[type="range"\]:focus-visible/);
    expect(css).toMatch(/\.stage-back-btn:focus-visible/);
  });

  it('preserves the OptionsScreen / SettingsScreen focus-visible rules from Phase 14', () => {
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
    expect(css).toMatch(/\/\* Phase 20:.*focus-visible/);
  });
});
