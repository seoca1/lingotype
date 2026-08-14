/**
 * Chinese Input Handler Tests
 *
 * Chinese handler is pinyin → Hanzi with two modes:
 * - tone: tone-marks (nǐ hǎo)
 * - ascii: tone-numbers (ni3 hao3)
 *
 * Both modes accept the same canonicalized key sequence internally, so
 * the public surface is permissive: tone-mark on target + ASCII on buffer
 * still counts as a match (and vice versa).
 *
 * Spaces in target are optional on buffer (Chinese has no required spaces).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ChineseHandler } from '../../src/input/ChineseHandler.js';
import type { Target } from '../../src/types.js';

const mkKey = (key: string): KeyboardEvent =>
  ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);

const playBuffer = (handler: ChineseHandler, chars: string) => {
  for (const ch of chars) {
    handler.handleKey(mkKey(ch));
  }
};

describe('ChineseHandler — Basic Properties', () => {
  let handler: ChineseHandler;
  beforeEach(() => {
    handler = new ChineseHandler();
  });

  it('should expose language code "zh"', () => {
    expect(handler.language).toBe('zh');
  });

  it('should start with empty buffer', () => {
    expect(handler.getBuffer()).toBe('');
  });

  it('should start with 100% accuracy', () => {
    expect(handler.getAccuracy()).toBe(100);
  });

  it('should default to "tone" input mode', () => {
    expect(handler.getMode()).toBe('tone');
  });

  it('should accept mode switch to "ascii"', () => {
    handler.setMode('ascii');
    expect(handler.getMode()).toBe('ascii');
  });
});

describe('ChineseHandler — Tone-mark mode', () => {
  let handler: ChineseHandler;
  beforeEach(() => {
    handler = new ChineseHandler();
    handler.setMode('tone');
  });

  it('should complete "nǐ hǎo" against target 你好 (pinyin: "nǐ hǎo")', () => {
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'ni3hao3'.replace(/3/g, '').padEnd(0, '')); // placeholder to satisfy TS no-op
    // Actual tone-mark typing:
    handler.reset();
    playBuffer(handler, 'nǐ hǎo');
    const result = handler.checkCompletion();
    expect(result).toBe(true);
  });

  it('should complete exact tone-mark input "nǐ hǎo"', () => {
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'nǐ hǎo');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should fail on wrong first character', () => {
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'nà');
    expect(handler.checkCompletion()).toBe(false);
  });

  it('should support long compound (你好吗)', () => {
    const target: Target = { text: '你好吗', acceptedInputs: ['nǐ hǎo ma'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'nǐ hǎo ma');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should accept tone-mark input ā á ǎ à', () => {
    // 一 -> yī / 也 -> yě
    const target: Target = { text: '一也', acceptedInputs: ['yī yě'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'yī yě');
    expect(handler.checkCompletion()).toBe(true);
  });
});

describe('ChineseHandler — ASCII tone-number mode', () => {
  let handler: ChineseHandler;
  beforeEach(() => {
    handler = new ChineseHandler();
    handler.setMode('ascii');
  });

  it('should complete "ni3 hao3" against target with tone-mark pinyin', () => {
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'ni3 hao3');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should complete ASCII-numbered pinyin against ASCII-numbered target', () => {
    const target: Target = { text: '一', acceptedInputs: ['yi1'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'yi1');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should match digits regardless of tone number (permissive)', () => {
    // Permissive canonicalization: maN all map to "ma" so user can type any tone
    for (let tone = 1; tone <= 5; tone++) {
      const h = new ChineseHandler();
      h.setMode('ascii');
      const target: Target = { text: '妈', acceptedInputs: ['ma1', 'má'], level: 1 };
      h.setTarget(target);
      playBuffer(h, `ma${tone}`);
      expect(h.checkCompletion()).toBe(true);
    }
  });

  it('should match "ma" without tone digit (tone-digit is optional)', () => {
    const handler = new ChineseHandler();
    handler.setMode('ascii');
    const target: Target = { text: '妈', acceptedInputs: ['ma1'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'ma');
    expect(handler.checkCompletion()).toBe(true);
  });
});

describe('ChineseHandler — Cross-mode compatibility (tone-marks target + ASCII buffer)', () => {
  it('should match target tone-mark input with buffer using tone-number input', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '谢谢', acceptedInputs: ['xièxie'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'xie4xie');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should match target ASCII input with buffer using tone-mark input', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '你好', acceptedInputs: ['ni3hao3'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'nǐhǎo');
    expect(handler.checkCompletion()).toBe(true);
  });
});

describe('ChineseHandler — Special pinyin sequences', () => {
  it('should handle zh (zhōngguó = China)', () => {
    const handler = new ChineseHandler();
    handler.setMode('ascii');
    const target: Target = { text: '中国', acceptedInputs: ['zhōngguó'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'zhong1guo2');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should handle ch (chī = to eat)', () => {
    const handler = new ChineseHandler();
    handler.setMode('ascii');
    const target: Target = { text: '吃', acceptedInputs: ['chī'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'chi1');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should handle sh (shuǐ = water)', () => {
    const handler = new ChineseHandler();
    handler.setMode('ascii');
    const target: Target = { text: '水', acceptedInputs: ['shuǐ'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'shui3');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should handle ü via v (ASCII lǜ = green)', () => {
    const handler = new ChineseHandler();
    handler.setMode('ascii');
    const target: Target = { text: '绿', acceptedInputs: ['lǜ'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'lv3');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should handle ü via u+umlaut (tone-mark lǜ = green)', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '绿', acceptedInputs: ['lǜ'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'lǜ');
    expect(handler.checkCompletion()).toBe(true);
  });
});

describe('ChineseHandler — Spaces are optional', () => {
  it('should accept buffer without target spaces', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '你好吗', acceptedInputs: ['nǐ hǎo ma'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'nǐhǎoma');
    expect(handler.checkCompletion()).toBe(true);
  });

  it('should accept buffer with spaces when target has none (defensive)', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '你好', acceptedInputs: ['nǐhǎo'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'nǐ hǎo');
    expect(handler.checkCompletion()).toBe(true);
  });
});

describe('ChineseHandler — Accuracy tracking', () => {
  it('should track errors for wrong keystrokes', () => {
    const handler = new ChineseHandler();
    handler.setMode('ascii');
    const target: Target = { text: '你好', acceptedInputs: ['ni3hao3'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'xa3hao3'); // 'x' instead of 'n' as first char
    expect(handler.getAccuracy()).toBeLessThan(100);
  });

  it('should keep accuracy at 0 when all keystrokes mismatch expected', () => {
    const handler = new ChineseHandler();
    handler.setMode('ascii');
    const target: Target = { text: '你好', acceptedInputs: ['ni3hao3'], level: 1 };
    handler.setTarget(target);
    // All-off-track keystrokes — every char mismatches the romaji expected.
    playBuffer(handler, 'xxxxxxxx');
    expect(handler.getAccuracy()).toBe(0);
  });

  it('should keep perfect accuracy when buffer matches target prefix exactly', () => {
    const handler = new ChineseHandler();
    handler.setMode('ascii');
    const target: Target = { text: '你好', acceptedInputs: ['ni3hao3'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'ni3hao3');
    expect(handler.getAccuracy()).toBe(100);
  });
});

describe('ChineseHandler — Hint & expected char', () => {
  it('should expose next 2 chars from pinyin target via getHint', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    const hint = handler.getHint();
    expect(hint).toBe('nǐ');
  });

  it('should return undefined hint when buffer is complete', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'nǐ hǎo');
    expect(handler.getHint()).toBeUndefined();
  });

  it('should expose first pinyin char via getExpectedChar', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    expect(handler.getExpectedChar()).toBe('n');
  });
});

describe('ChineseHandler — isOnTrack helper', () => {
  it('should return true on empty buffer', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    expect(handler.isOnTrack()).toBe(true);
  });

  it('should return true when buffer matches target prefix (tone-mark)', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'nǐ');
    expect(handler.isOnTrack()).toBe(true);
  });

  it('should return false when buffer diverges from target', () => {
    const handler = new ChineseHandler();
    const target: Target = { text: '你好', acceptedInputs: ['nǐ hǎo'], level: 1 };
    handler.setTarget(target);
    playBuffer(handler, 'nà');
    expect(handler.isOnTrack()).toBe(false);
  });
});
