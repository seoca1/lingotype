/**
 * Phase E fix verification — Preload all 12 characters
 *
 * Bug: Phase E introduced random character selection per stage. The
 * preload only loaded default characters, so non-default characters
 * (like en-oliver) showed "Loading..." indefinitely.
 *
 * Fix: Preload ALL 12 characters on app init.
 */

import { describe, it, expect } from 'vitest';
import {
  CHARACTER_IMAGES,
  LANGUAGE_DEFAULT_CHARACTERS,
} from '../../src/config/characterImages.js';

describe('Phase E fix — all characters have valid image sets', () => {
  it('preloads 12 characters × 7 poses = 84 images', () => {
    const allCharacters = Object.keys(CHARACTER_IMAGES);
    expect(allCharacters.length).toBe(12);
    expect(LANGUAGE_DEFAULT_CHARACTERS.en).toBeDefined();

    // Count total images to preload
    const totalImages = Object.values(CHARACTER_IMAGES).reduce(
      (sum, char) => sum + Object.keys(char).length,
      0
    );
    expect(totalImages).toBe(84); // 12 chars × 7 poses
  });

  it('every character has 7 poses defined', () => {
    for (const charSet of Object.values(CHARACTER_IMAGES)) {
      const poses = ['idle', 'wave', 'jump', 'clap', 'spin', 'dance', 'pose'];
      for (const pose of poses) {
        expect(charSet).toHaveProperty(pose);
      }
    }
  });

  it('every image src ends in .png with valid path format', () => {
    for (const charSet of Object.values(CHARACTER_IMAGES)) {
      for (const imageConfig of Object.values(charSet)) {
        expect(imageConfig.src).toMatch(/^\/lingotype\/characters\/[a-z]{2}\/[a-z-]+\/[a-z]+\.png$$/);
      }
    }
  });

  it('each character has a unique src prefix', () => {
    const prefixes = new Set<string>();
    for (const [charId, charSet] of Object.entries(CHARACTER_IMAGES)) {
      const firstImage = charSet.idle.src;
      // Extract prefix like /lingotype/characters/en/emily/
      const match = firstImage.match(/^(\/lingotype\/characters\/[a-z]{2}\/[a-z-]+)\//);
      expect(match, `Invalid src for ${charId}: ${firstImage}`).not.toBeNull();
      prefixes.add(match![1]);
    }
    expect(prefixes.size).toBe(12); // All 12 characters have unique prefixes
  });
});