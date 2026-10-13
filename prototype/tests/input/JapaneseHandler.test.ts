/**
 * Japanese Input Handler Tests
 *
 * 로마자→한자 직접 매핑 검증. ADR-0002.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JapaneseHandler } from '../../src/input/JapaneseHandler.js';
import type { MatchResult, Target } from '../../src/types.js';

describe('JapaneseHandler', () => {
  let handler: JapaneseHandler;

  beforeEach(() => {
    handler = new JapaneseHandler();
  });

  describe('Basic Properties', () => {
    it('should have language "jp"', () => {
      expect(handler.language).toBe('jp');
    });

    it('should start with empty buffer', () => {
      expect(handler.getBuffer()).toBe('');
    });

    it('should start with 100% accuracy', () => {
      expect(handler.getAccuracy()).toBe(100);
    });
  });

  describe('Hiragana Input (Romaji Mapping)', () => {
    it('should match "こんにちは" with romaji "konnichiwa"', () => {
      const target: Target = {
        text: 'こんにちは',
        acceptedInputs: ['konnichiwa'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      const romaji = 'konnichiwa';
      romaji.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('konnichiwa');
    });

    it('should complete when romaji matches', () => {
      const target: Target = {
        text: 'ありがとう',
        acceptedInputs: ['arigatou'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      let result!: MatchResult;
      'arigatou'.split('').forEach((char) => {
        result = handler.handleKey(mockEvent(char));
      });

      expect(result.completed).toBe(true);
      expect(handler.getBuffer()).toBe('arigatou');
    });
  });

  describe('Katakana Input', () => {
    it('should match "コンピュータ" with romaji "konpyuuta"', () => {
      const target: Target = {
        text: 'コンピュータ',
        acceptedInputs: ['konpyuuta'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'konpyuuta'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('konpyuuta');
    });
  });

  describe('Kanji Input', () => {
    it('should match "日本" with romaji "nihon"', () => {
      const target: Target = {
        text: '日本',
        acceptedInputs: ['nihon'],
        level: 2,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'nihon'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('nihon');
    });

    it('should match "学校" with romaji "gakkou"', () => {
      const target: Target = {
        text: '学校',
        acceptedInputs: ['gakkou'],
        level: 2,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'gakkou'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('gakkou');
    });
  });

  describe('Special Characters', () => {
    it('should handle long vowels (ー)', () => {
      const target: Target = {
        text: 'ラーメン',
        acceptedInputs: ['raamen'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'raamen'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('raamen');
    });

    it('should handle small tsu (っ/ッ) with double consonants', () => {
      const target: Target = {
        text: 'がっこう',
        acceptedInputs: ['gakkou'],
        level: 2,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'gakkou'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('gakkou');
    });

    it('should handle small ya/yu/yo (ゃゅょ)', () => {
      const target: Target = {
        text: 'きょう',
        acceptedInputs: ['kyou'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'kyou'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('kyou');
    });
  });

  describe('Mixed Script Input', () => {
    it('should handle hiragana + kanji mix', () => {
      const target: Target = {
        text: '食べる',
        acceptedInputs: ['taberu'],
        level: 2,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'taberu'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('taberu');
    });
  });

  describe('Backspace Handling', () => {
    it('should remove last romaji character', () => {
      const target: Target = {
        text: 'こんにちは',
        acceptedInputs: ['konnichiwa'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'konni'.split('').forEach((char) => handler.handleKey(mockEvent(char)));
      expect(handler.getBuffer()).toBe('konni');

      handler.handleKey(mockEvent('Backspace'));
      expect(handler.getBuffer()).toBe('konn');

      handler.handleKey(mockEvent('Backspace'));
      expect(handler.getBuffer()).toBe('kon');
    });
  });

  describe('Accuracy Tracking', () => {
    it('should maintain 100% accuracy on correct input', () => {
      const target: Target = {
        text: 'ありがとう',
        acceptedInputs: ['arigatou'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'arigatou'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getAccuracy()).toBe(100);
    });

    it('should decrease accuracy on wrong input', () => {
      const target: Target = {
        text: 'ありがとう',
        acceptedInputs: ['arigatou'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      handler.handleKey(mockEvent('a')); // correct
      handler.handleKey(mockEvent('x')); // wrong
      handler.handleKey(mockEvent('r')); // correct

      const accuracy = handler.getAccuracy();
      expect(accuracy).toBeLessThan(100);
      expect(accuracy).toBeGreaterThan(0);
    });
  });

  describe('Hint System', () => {
    it('should provide next 2 romaji characters as hint', () => {
      const target: Target = {
        text: 'こんにちは',
        acceptedInputs: ['konnichiwa'],
        level: 1,
      };
      handler.setTarget(target);

      const hint = handler.getHint();
      expect(hint).toBe('ko'); // First 2 romaji characters
    });

    it('should update hint as typing progresses', () => {
      const target: Target = {
        text: 'こんにちは',
        acceptedInputs: ['konnichiwa'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      handler.handleKey(mockEvent('k'));
      expect(handler.getHint()).toBe('on');

      handler.handleKey(mockEvent('o'));
      expect(handler.getHint()).toBe('nn');
    });

    it('should return undefined when target is complete', () => {
      const target: Target = {
        text: 'はい',
        acceptedInputs: ['hai'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'hai'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      const hint = handler.getHint();
      expect(hint).toBeUndefined();
    });
  });

  describe('Expected Character', () => {
    it('should return next expected romaji character', () => {
      const target: Target = {
        text: 'こんにちは',
        acceptedInputs: ['konnichiwa'],
        level: 1,
      };
      handler.setTarget(target);

      expect(handler.getExpectedChar()).toBe('k');

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      handler.handleKey(mockEvent('k'));
      expect(handler.getExpectedChar()).toBe('o');

      handler.handleKey(mockEvent('o'));
      expect(handler.getExpectedChar()).toBe('n');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty target', () => {
      const result = handler.handleKey({
        key: 'a',
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      expect(result.completed).toBe(false);
      expect(result.buffer).toBe('');
    });

    it('should ignore composition events', () => {
      const target: Target = {
        text: 'こんにちは',
        acceptedInputs: ['konnichiwa'],
        level: 1,
      };
      handler.setTarget(target);

      const result = handler.handleKey({
        key: 'k',
        isComposing: true,
        preventDefault: () => {},
      } as KeyboardEvent);

      expect(handler.getBuffer()).toBe('');
      expect(result.completed).toBe(false);
    });

    it('should handle reset correctly', () => {
      const target: Target = {
        text: 'こんにちは',
        acceptedInputs: ['konnichiwa'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      handler.handleKey(mockEvent('k'));
      handler.handleKey(mockEvent('o'));

      handler.reset();

      expect(handler.getBuffer()).toBe('');
      expect(handler.getAccuracy()).toBe(100);
    });
  });

  describe('Common Phrases', () => {
    it('should handle "おはようございます" (ohayougozaimasu)', () => {
      const target: Target = {
        text: 'おはようございます',
        acceptedInputs: ['ohayougozaimasu'],
        level: 2,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'ohayougozaimasu'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('ohayougozaimasu');
    });

    it('should handle "さようなら" (sayounara)', () => {
      const target: Target = {
        text: 'さようなら',
        acceptedInputs: ['sayounara'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'sayounara'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('sayounara');
    });
  });
});
