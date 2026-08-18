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
    tiersCleared: 0,
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

  it('shows 0 / 12 counter when no badges unlocked', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('0 / 12');
  });

  it('shows correct counter after first_run unlocks', () => {
    evaluateBadges({ ...emptyContext(), stagesCleared: 1 });
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('1 / 12');
  });

  it('marks unlocked badges with badge-card--unlocked class', () => {
    evaluateBadges({ ...emptyContext(), stagesCleared: 1 });
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('badge-card--unlocked');
    expect(html).toContain('badge-card--locked');
  });

  it('renders first 6 badge cards in the grid (page 1 of 2)', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    const badgeCardMatches = html.match(/badge-card badge-card--/g) || [];
    expect(badgeCardMatches.length).toBe(6);
  });

  it('shows progress bar for each badge on the page', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    const progressBars = html.match(/aria-valuenow/g) || [];
    expect(progressBars.length).toBeGreaterThanOrEqual(6);
  });

  it('shows pagination controls when more than 1 page', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('badges-pagination');
    expect(html).toContain('1 / 2');
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

  it('has accessible back button with aria-label', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('badges-back-btn');
    expect(html).toContain('aria-label="Back to menu"');
  });

  it('has region role with proper aria-labelledby', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-labelledby="badges-screen-title"');
  });

  it('renders filter buttons (All / Unlocked / Locked)', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toContain('badges-filter__btn');
    expect(html).toMatch(/filterAll|All \(12\)/);
  });

  it('filter button shows live counts', () => {
    evaluateBadges({ ...emptyContext(), stagesCleared: 1 });
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={[]} onBack={() => {}} />,
    );
    expect(html).toMatch(/Unlocked \(1\)/);
    expect(html).toMatch(/Locked \(11\)/);
  });

  it('handles languagesPlayed array (polyglot evaluation)', () => {
    const html = renderToStaticMarkup(
      <BadgesScreen stageRecords={{}} languagesPlayed={['en', 'jp', 'es', 'kr']} onBack={() => {}} />,
    );
    expect(html).toContain('badges-screen');
  });
});
