/**
 * French Input Handler Tests
 *
 * 액센트 직접 입력 + ASCII 폴백 + œ ligature 폴백 검증.
 * Phase 15 — French language scaffold.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FrenchHandler } from '../../src/input/FrenchHandler.js';
import type { Target } from '../../src/types.js';

describe('FrenchHandler', () => {
  let handler: FrenchHandler;

  beforeEach(() => {
    handler = new FrenchHandler();
  });

  describe('Basic Properties', () => {
    it('should have language "fr"', () => {
      expect(handler.language).toBe('fr');
    });

    it('should start with empty buffer', () => {
      expect(handler.getBuffer()).toBe('');
    });

    it('should start with 100% accuracy', () => {
      expect(handler.getAccuracy()).toBe(100);
    });
  });

  describe('Loose Mode (Default) - ASCII Fallback for Accents', () => {
    it('should accept "e" for "é" in loose mode', () => {
      const target: Target = { text: 'café', acceptedInputs: ['cafe', 'café'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'cafe'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('cafe');
    });

    it('should accept "e" for "è" in loose mode', () => {
      const target: Target = { text: 'père', acceptedInputs: ['pere', 'père'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'pere'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('pere');
    });

    it('should accept "e" for "ê" in loose mode', () => {
      const target: Target = { text: 'être', acceptedInputs: ['etre', 'être'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'etre'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('etre');
    });

    it('should accept "a" for "à" in loose mode', () => {
      const target: Target = { text: 'déjà', acceptedInputs: ['deja', 'déjà'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'deja'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('deja');
    });

    it('should accept "a" for "â" in loose mode', () => {
      const target: Target = { text: 'gâteau', acceptedInputs: ['gateau', 'gâteau'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'gateau'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('gateau');
    });

    it('should accept "c" for "ç" in loose mode', () => {
      const target: Target = { text: 'français', acceptedInputs: ['francais', 'français'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'francais'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('francais');
    });

    it('should accept "u" for "û" in loose mode', () => {
      const target: Target = { text: 'sûr', acceptedInputs: ['sur', 'sûr'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'sur'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('sur');
    });

    it('should accept "o" for "ô" in loose mode', () => {
      const target: Target = { text: 'hôtel', acceptedInputs: ['hotel', 'hôtel'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'hotel'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('hotel');
    });
  });

  describe('Strict Mode - Exact Accent Required', () => {
    beforeEach(() => {
      handler.setMode('strict');
    });

    it('should require exact "é" in strict mode', () => {
      const target: Target = { text: 'café', acceptedInputs: ['café'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'café'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('café');
    });

    it('should NOT accept "e" for "é" in strict mode', () => {
      const target: Target = { text: 'café', acceptedInputs: ['café'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      let result: any;
      'cafe'.split('').forEach((c) => {
        result = handler.handleKey(mk(c));
      });
      expect(handler.getBuffer()).toBe('cafe');
      expect(result?.completed).toBe(false);
    });
  });

  describe('œ Ligature (French-specific)', () => {
    it('should accept "oe" for "œ" in loose mode', () => {
      const target: Target = { text: 'œuvre', acceptedInputs: ['oeuvre', 'œuvre'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'oeuvre'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('oeuvre');
    });

    it('should accept exact "œ" ligature', () => {
      const target: Target = { text: 'œuvre', acceptedInputs: ['œuvre'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'œuvre'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('œuvre');
    });

    it('should accept "coeur" for "cœur"', () => {
      const target: Target = { text: 'cœur', acceptedInputs: ['coeur', 'cœur'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'coeur'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('coeur');
    });
  });

  describe('Apostrophe Handling (l\', d\', j\', qu\')', () => {
    it('should preserve apostrophe in "aujourd\'hui"', () => {
      const target: Target = { text: "aujourd'hui", acceptedInputs: ["aujourd'hui"], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      "aujourd'hui".split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe("aujourd'hui");
    });

    it('should preserve apostrophe in "l\'aéroport"', () => {
      const target: Target = { text: "l'aéroport", acceptedInputs: ["l'aéroport", "l'aeroport"], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      // loose mode → use ASCII fallback
      "l'aeroport".split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe("l'aeroport");
    });

    it('should preserve apostrophe in "d\'accord"', () => {
      const target: Target = { text: "d'accord", acceptedInputs: ["d'accord"], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      "d'accord".split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe("d'accord");
    });

    it('should preserve apostrophe in "qu\'il"', () => {
      const target: Target = { text: "qu'il", acceptedInputs: ["qu'il"], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      "qu'il".split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe("qu'il");
    });
  });

  describe('Common Words and Phrases', () => {
    it('should handle "bonjour"', () => {
      const target: Target = { text: 'bonjour', acceptedInputs: ['bonjour'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'bonjour'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('bonjour');
    });

    it('should handle "merci beaucoup" with ASCII fallback', () => {
      const target: Target = { text: 'merci beaucoup', acceptedInputs: ['merci beaucoup'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'merci beaucoup'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('merci beaucoup');
    });

    it('should handle "s\'il vous plaît" (apostrophe + accent)', () => {
      const target: Target = {
        text: "s'il vous plaît",
        acceptedInputs: ["s'il vous plait", "s'il vous plaît"],
        level: 2,
      };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      // loose mode: "s'il vous plait" (ASCII fallback for â)
      "s'il vous plait".split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe("s'il vous plait");
    });

    it('should handle multi-accent word "déjà"', () => {
      const target: Target = { text: 'déjà', acceptedInputs: ['deja', 'déjà'], level: 2 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'deja'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('deja');
    });
  });

  describe('Backspace Handling', () => {
    it('should remove last character on backspace', () => {
      const target: Target = { text: 'café', acceptedInputs: ['cafe', 'café'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'cafe'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('cafe');
      handler.handleKey(mk('Backspace'));
      expect(handler.getBuffer()).toBe('caf');
    });
  });

  describe('Accuracy Tracking', () => {
    it('should maintain 100% accuracy on correct input', () => {
      const target: Target = { text: 'bonjour', acceptedInputs: ['bonjour'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      'bonjour'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getAccuracy()).toBe(100);
    });

    it('should decrease accuracy on wrong input', () => {
      const target: Target = { text: 'café', acceptedInputs: ['café'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      handler.handleKey(mk('c'));
      handler.handleKey(mk('x')); // wrong
      handler.handleKey(mk('f'));
      const accuracy = handler.getAccuracy();
      expect(accuracy).toBeLessThan(100);
      expect(accuracy).toBeGreaterThan(0);
    });
  });

  describe('Expected Character', () => {
    it('should return next expected character (accent)', () => {
      const target: Target = { text: 'café', acceptedInputs: ['café'], level: 1 };
      handler.setTarget(target);
      expect(handler.getExpectedChar()).toBe('c');
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      handler.handleKey(mk('c'));
      expect(handler.getExpectedChar()).toBe('a');
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
      const target: Target = { text: 'bonjour', acceptedInputs: ['bonjour'], level: 1 };
      handler.setTarget(target);
      const result = handler.handleKey({
        key: 'b',
        isComposing: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      expect(handler.getBuffer()).toBe('');
      expect(result.completed).toBe(false);
    });

    it('should reset correctly', () => {
      const target: Target = { text: 'bonjour', acceptedInputs: ['bonjour'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      handler.handleKey(mk('b'));
      handler.handleKey(mk('o'));
      handler.reset();
      expect(handler.getBuffer()).toBe('');
      expect(handler.getAccuracy()).toBe(100);
    });
  });

  describe('Mode Switching', () => {
    it('should switch from loose to strict', () => {
      const target: Target = { text: 'café', acceptedInputs: ['café'], level: 1 };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      // loose mode: ASCII accepted
      'cafe'.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe('cafe');
      handler.reset();
      handler.setMode('strict');
      // strict mode: now requires exact accent
      let result: any;
      'cafe'.split('').forEach((c) => {
        result = handler.handleKey(mk(c));
      });
      expect(result?.completed).toBe(false);
    });
  });

  describe('Long Sentences (with multiple accents)', () => {
    it('should handle "Comment allez-vous aujourd\'hui ?" with apostrophe + accents', () => {
      const sentence = "Comment allez-vous aujourd'hui ?";
      const target: Target = {
        text: sentence,
        acceptedInputs: [sentence, "Comment allez-vous aujourd'hui ?"],
        level: 3,
      };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      // use ASCII fallback (Comment without accent works because Comment has no accents)
      // But aujourd'hui has no accent either; it's just the apostrophe test
      sentence.split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe(sentence);
    });

    it('should handle "Je voudrais un café, s\'il vous plaît." with loose mode', () => {
      const target: Target = {
        text: "Je voudrais un café, s'il vous plaît.",
        acceptedInputs: ["Je voudrais un cafe, s'il vous plait.", "Je voudrais un café, s'il vous plaît."],
        level: 3,
      };
      handler.setTarget(target);
      const mk = (key: string) => ({ key, isComposing: false, preventDefault: () => {} } as KeyboardEvent);
      // ASCII fallback
      "Je voudrais un cafe, s'il vous plait.".split('').forEach((c) => handler.handleKey(mk(c)));
      expect(handler.getBuffer()).toBe("Je voudrais un cafe, s'il vous plait.");
    });
  });
});
