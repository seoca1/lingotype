// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BadgesScreen } from '../../src/ui/BadgesScreen.js';
import {
  _resetBadgeState,
  evaluateBadges,
  type BadgeEvalContext,
} from '../../src/data/badges.js';

if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.setItem !== 'function') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  } as Storage;
}

function emptyContext(): BadgeEvalContext {
  return {
    stagesCleared: 0,
    perfectClears: 0,
    totalAccuracy: 0,
    currentStreak: 0,
    languagesPlayed: 0,
    hasTriedAllLanguages: false,
  };
}

describe('BadgesScreen', () => {
  beforeEach(() => {
    _resetBadgeState();
  });

  it('renders without crashing (empty state)', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('badges-screen');
  });

  it('shows 0 / 10 counter when no badges unlocked', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('0 / 10');
  });

  it('shows 1 / 10 after first_run unlocks', () => {
    evaluateBadges({ ...emptyContext(), stagesCleared: 1 });
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('1 / 10');
  });

  it('renders all 10 badge cards', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    const badgeCards = html.match(/badge-card/g) || [];
    expect(badgeCards.length).toBeGreaterThanOrEqual(20);
  });

  it('marks unlocked badges with badge-card--unlocked class', () => {
    evaluateBadges({ ...emptyContext(), stagesCleared: 1 });
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('badge-card--unlocked');
    expect(html).toContain('badge-card--locked');
  });

  it('shows progress bar for each badge', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    const progressBars = html.match(/aria-valuenow/g) || [];
    expect(progressBars.length).toBeGreaterThanOrEqual(10);
  });

  it('uses 🔒 icon for locked badges', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('🔒');
  });

  it('uses real badge icon for unlocked badges', () => {
    evaluateBadges({ ...emptyContext(), stagesCleared: 1 });
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('🌱');
  });

  it('has a back button', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('badges-back-btn');
    expect(html).toContain('aria-label="Back to menu"');
  });

  it('exposes accessible region with proper labels', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-labelledby="badges-screen-title"');
  });

  it('handles languagesPlayed array', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={['en', 'jp']} onBack={() => {}} />,
    );
    expect(html).toContain('badges-screen');
  });
});
