/**
 * German Input Handler Tests
 *
 * 움라우트 직접 입력 + ASCII 폴백 + ß (Eszett) 폴백 검증.
 * Phase 16 — German language scaffold.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GermanHandler } from '../../src/input/GermanHandler.js';
import type { Target } from '../../src/types.js';

describe('GermanHandler', () => {
  let handler: GermanHandler;

  beforeEach(() => {
    handler = new GermanHandler();
  });

  describe('Basic Properties', () => {
    it('should have language "de"', () => {
      expect(handler.language).toBe('de');
    });

    it('should start with empty buffer', () => {
      expect(handler.getBuffer()).toBe('');
    });

    it('should start with 100% accuracy', () => {
      expect(handler.getAccuracy()).toBe(100);
    });
  });

  describe('Loose Mode (Default) - Umlaut ASCII Fallback', () => {
    it('should accept "a" fallback for "ä" in loose mode', () => {
      const target: Target = { text: 'Mädchen', acceptedInputs: ['Maedchen', 'Mädchen'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Maedchen'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Maedchen');
    });

    it('should accept "o" fallback for "ö" in loose mode', () => {
      const target: Target = { text: 'schön', acceptedInputs: ['schoen', 'schön'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'schoen'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('schoen');
    });

    it('should accept "u" fallback for "ü" in loose mode', () => {
      const target: Target = { text: 'über', acceptedInputs: ['ueber', 'über'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'ueber'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('ueber');
    });

    it('should accept capital "Ae" fallback for "Ä"', () => {
      const target: Target = { text: 'Äpfel', acceptedInputs: ['Aepfel', 'Äpfel'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Aepfel'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Aepfel');
    });

    it('should accept capital "Oe" fallback for "Ö"', () => {
      const target: Target = { text: 'Öl', acceptedInputs: ['Oel', 'Öl'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Oel'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Oel');
    });

    it('should accept capital "Ue" fallback for "Ü"', () => {
      const target: Target = { text: 'Über', acceptedInputs: ['Ueber', 'Über'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Ueber'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Ueber');
    });
  });

  describe('Strict Mode - Exact Umlaut Required', () => {
    beforeEach(() => {
      handler.setMode('strict');
    });

    it('should accept exact umlaut "ä" in strict mode', () => {
      const target: Target = { text: 'Mädchen', acceptedInputs: ['Mädchen'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Mädchen'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Mädchen');
    });

    it('should ALSO accept ASCII fallback in strict mode (DIN 5007 universally accepted)', () => {
      const target: Target = { text: 'Mädchen', acceptedInputs: ['Maedchen', 'Mädchen'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Maedchen'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Maedchen');
    });
  });

  describe('Eszett (ß) — German-specific', () => {
    it('should accept exact ß in target', () => {
      const target: Target = { text: 'Straße', acceptedInputs: ['Straße'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Straße'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Straße');
    });

    it('should accept "ss" fallback for ß in loose mode', () => {
      const target: Target = { text: 'Straße', acceptedInputs: ['Strasse', 'Straße'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Strasse'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Strasse');
    });

    it('should accept "ss" fallback in strict mode too', () => {
      handler.setMode('strict');
      const target: Target = { text: 'Straße', acceptedInputs: ['Strasse', 'Straße'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Strasse'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Strasse');
    });

    it('should handle "groß" with ß → "gross" fallback', () => {
      const target: Target = { text: 'groß', acceptedInputs: ['gross', 'groß'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'gross'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('gross');
    });
  });

  describe('Common Words and Phrases', () => {
    it('should handle "Guten Tag" without umlaut', () => {
      const target: Target = { text: 'Guten Tag', acceptedInputs: ['Guten Tag'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Guten Tag'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Guten Tag');
    });

    it('should handle "Hallo" with ASCII fallback not needed', () => {
      const target: Target = { text: 'Hallo', acceptedInputs: ['Hallo'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Hallo'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Hallo');
    });

    it('should handle "Deutsch" multi-character with umlaut fallback', () => {
      const target: Target = { text: 'Deutsch', acceptedInputs: ['Deutsch', 'Deutch'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      // Note: "Deutsch" has no umlaut in modern spelling (Deutch is old variant)
      'Deutsch'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Deutsch');
    });

    it('should handle multi-umlaut word "frühstücken" with all fallbacks', () => {
      const target: Target = {
        text: 'frühstücken',
        acceptedInputs: ['fruehstuecken', 'frühstücken'],
        level: 3,
      };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'fruehstuecken'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('fruehstuecken');
    });
  });

  describe('Compound Word Handling', () => {
    it('should handle "Flughafen" compound (no umlaut)', () => {
      const target: Target = { text: 'Flughafen', acceptedInputs: ['Flughafen'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Flughafen'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Flughafen');
    });

    it('should handle "Schlüssel" compound with ü + ß', () => {
      const target: Target = { text: 'Schlüssel', acceptedInputs: ['Schluessel', 'Schlüssel'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Schluessel'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Schluessel');
    });
  });

  describe('Backspace Handling', () => {
    it('should remove last character on backspace', () => {
      const target: Target = { text: 'Mädchen', acceptedInputs: ['Maedchen', 'Mädchen'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Maedchen'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Maedchen');
      handler.handleKey(mk('Backspace'));
      expect(handler.getBuffer()).toBe('Maedche');
    });
  });

  describe('Accuracy Tracking', () => {
    it('should maintain 100% accuracy on correct input', () => {
      const target: Target = { text: 'Hallo', acceptedInputs: ['Hallo'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Hallo'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getAccuracy()).toBe(100);
    });

    it('should decrease accuracy on wrong input', () => {
      const target: Target = { text: 'Mädchen', acceptedInputs: ['Mädchen'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      handler.handleKey(mk('M'));
      handler.handleKey(mk('x')); // wrong
      handler.handleKey(mk('d'));
      const accuracy = handler.getAccuracy();
      expect(accuracy).toBeLessThan(100);
      expect(accuracy).toBeGreaterThan(0);
    });
  });

  describe('Expected Character', () => {
    it('should return next expected character (umlaut)', () => {
      const target: Target = { text: 'Mädchen', acceptedInputs: ['Mädchen'], level: 1 };
      handler.setTarget(target);
      expect(handler.getExpectedChar()).toBe('M');
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      handler.handleKey(mk('M'));
      expect(handler.getExpectedChar()).toBe('ä');
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
      const target: Target = { text: 'Hallo', acceptedInputs: ['Hallo'], level: 1 };
      handler.setTarget(target);
      const result = handler.handleKey({
        key: 'H',
        isComposing: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      expect(handler.getBuffer()).toBe('');
      expect(result.completed).toBe(false);
    });

    it('should reset correctly', () => {
      const target: Target = { text: 'Hallo', acceptedInputs: ['Hallo'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      handler.handleKey(mk('H'));
      handler.handleKey(mk('a'));
      handler.reset();
      expect(handler.getBuffer()).toBe('');
      expect(handler.getAccuracy()).toBe(100);
    });
  });

  describe('Mode Switching', () => {
    it('should switch from loose to strict', () => {
      const target: Target = { text: 'Mädchen', acceptedInputs: ['Maedchen', 'Mädchen'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      // loose mode: ASCII accepted
      'Maedchen'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Maedchen');
      handler.reset();
      handler.setMode('strict');
      // strict mode: ASCII fallback still accepted (DIN 5007 is universal)
      'Maedchen'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Maedchen');
    });
  });

  describe('Long Sentences (with multiple umlauts and ß)', () => {
    it('should handle "Ich möchte einen Kaffee, bitte." with ASCII fallbacks', () => {
      const sentence = 'Ich möchte einen Kaffee, bitte.';
      const target: Target = {
        text: sentence,
        acceptedInputs: [sentence, 'Ich moechte einen Kaffee, bitte.'],
        level: 3,
      };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'Ich moechte einen Kaffee, bitte.'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('Ich moechte einen Kaffee, bitte.');
    });

    it('should handle "Vielen Dank, Frau Schmidt." without umlauts', () => {
      const sentence = 'Vielen Dank, Frau Schmidt.';
      const target: Target = {
        text: sentence,
        acceptedInputs: [sentence],
        level: 3,
      };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      sentence.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe(sentence);
    });
  });
});
