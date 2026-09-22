/**
 * EffectsSystem Tests — FloatingWord + SentencePreview positioning
 *
 * Verifies the new perimeter-based positioning:
 * - Floating words spawn at canvas corners/edges, not center
 * - Words don't pile up on each other
 * - Sentence preview is positioned at top-left
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createEffectsState,
  spawnFloatingWords,
  showSentencePreview,
  updateEffects,
  type EffectsState,
} from '../../src/effects/EffectsSystem.js';

describe('EffectsSystem — spawnFloatingWords (perimeter positioning)', () => {
  let state: EffectsState;

  beforeEach(() => {
    state = createEffectsState();
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
  });

  it('spawns words at perimeter slots, not center', () => {
    spawnFloatingWords(
      state,
      512,
      360,
      [
        { text: 'hello', lang: 'es' },
        { text: 'ciao', lang: 'jp' },
        { text: '안녕', lang: 'kr' },
      ],
      { width: 1024, height: 880 },
    );

    expect(state.floatingWords).toHaveLength(3);
    for (const w of state.floatingWords) {
      // Words should be in perimeter zone (not center)
      // Center zone: x 350-674, y 200-580
      const inCenterX = w.x >= 350 && w.x <= 674;
      const inCenterY = w.y >= 200 && w.y <= 580;
      const inCenter = inCenterX && inCenterY;
      expect(inCenter).toBe(false);
    }
  });

  it('distributes across multiple perimeter slots', () => {
    spawnFloatingWords(
      state,
      512,
      360,
      [
        { text: 'a', lang: 'en' },
        { text: 'b', lang: 'jp' },
        { text: 'c', lang: 'es' },
        { text: 'd', lang: 'kr' },
        { text: 'e', lang: 'en' },
        { text: 'f', lang: 'jp' },
      ],
      { width: 1024, height: 880 },
    );

    expect(state.floatingWords).toHaveLength(6);

    const positions: string[] = [];
    for (const w of state.floatingWords) {
      const key = `${Math.round(w.x / 50) * 50},${Math.round(w.y / 50) * 50}`;
      if (!positions.includes(key)) {
        positions.push(key);
      }
    }
    expect(positions.length).toBeGreaterThanOrEqual(3);
  });

  it('caps concurrent floating words at 6', () => {
    for (let i = 0; i < 12; i++) {
      spawnFloatingWords(
        state,
        512,
        360,
        [{ text: `word${i}`, lang: 'en' }],
        { width: 1024, height: 880 },
      );
    }
    expect(state.floatingWords.length).toBeLessThanOrEqual(6);
  });

  it('scales perimeter positions to canvas size', () => {
    spawnFloatingWords(
      state,
      0,
      0,
      [{ text: 'test', lang: 'en' }],
      { width: 512, height: 440 },
    );
    const w = state.floatingWords[0];
    // Half-scale: x should be roughly 90-285 (180 * 0.5 ~ 380 * 0.5)
    expect(w.x).toBeLessThan(300);
    expect(w.x).toBeGreaterThan(80);
  });

  it('words have longer life (~1.7-2.1s) for better readability', () => {
    spawnFloatingWords(
      state,
      512,
      360,
      [{ text: 'test', lang: 'en' }],
      { width: 1024, height: 880 },
    );
    const w = state.floatingWords[0];
    expect(w.maxLife).toBeLessThanOrEqual(2100);
    expect(w.maxLife).toBeGreaterThanOrEqual(1700);
  });

  it('words have larger font (20-26px) for better visibility', () => {
    spawnFloatingWords(
      state,
      512,
      360,
      [{ text: 'test', lang: 'en' }],
      { width: 1024, height: 880 },
    );
    const w = state.floatingWords[0];
    expect(w.fontSize).toBeGreaterThanOrEqual(20);
    expect(w.fontSize).toBeLessThanOrEqual(26);
  });
});

describe('EffectsSystem — showSentencePreview (top-left positioning)', () => {
  let state: EffectsState;

  beforeEach(() => {
    state = createEffectsState();
  });

  it('stores preview with provided x, y as top-left corner', () => {
    showSentencePreview(state, 'Hello world', 300, 18, 3500);
    expect(state.sentencePreview).toBeDefined();
    expect(state.sentencePreview!.text).toBe('Hello world');
    expect(state.sentencePreview!.x).toBe(300);
    expect(state.sentencePreview!.y).toBe(18);
  });

  it('lifetime decreases with updateEffects', () => {
    showSentencePreview(state, 'Test', 0, 0, 2000);
    const initial = state.sentencePreview!.life;
    updateEffects(state, 500);
    expect(state.sentencePreview!.life).toBe(initial - 500);
  });

  it('clears preview when life reaches 0', () => {
    showSentencePreview(state, 'Test', 0, 0, 1000);
    updateEffects(state, 1500);
    expect(state.sentencePreview).toBeNull();
  });
});

describe('EffectsSystem — integration', () => {
  it('multiple spawns cycle through perimeter slots without overlap', () => {
    const state = createEffectsState();
    for (let i = 0; i < 12; i++) {
      spawnFloatingWords(
        state,
        512,
        360,
        [{ text: `w${i}`, lang: 'en' }],
        { width: 1024, height: 880 },
      );
    }
    for (const w of state.floatingWords) {
      const inCenterX = w.x >= 350 && w.x <= 674;
      const inCenterY = w.y >= 200 && w.y <= 580;
      const inCenter = inCenterX && inCenterY;
      expect(inCenter).toBe(false);
    }
  });
});
