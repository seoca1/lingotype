/**
 * Spanish Input Handler Tests
 *
 * 액센트 직접 입력 + ASCII 폴백 검증. ADR-0003.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SpanishHandler } from '../../src/input/SpanishHandler.js';
import type { MatchResult, Target } from '../../src/types.js';

describe('SpanishHandler', () => {
  let handler: SpanishHandler;

  beforeEach(() => {
    handler = new SpanishHandler();
  });

  describe('Basic Properties', () => {
    it('should have language "es"', () => {
      expect(handler.language).toBe('es');
    });

    it('should start with empty buffer', () => {
      expect(handler.getBuffer()).toBe('');
    });

    it('should start with 100% accuracy', () => {
      expect(handler.getAccuracy()).toBe(100);
    });
  });

  describe('Loose Mode (Default) - ASCII Fallback', () => {
    it('should accept "n" for "ñ" in loose mode', () => {
      const target: Target = {
        text: 'español',
        acceptedInputs: ['espanol', 'español'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      // Type with ASCII 'n' instead of 'ñ'
      'espanol'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('espanol');
    });

    it('should accept "a" for "á" in loose mode', () => {
      const target: Target = {
        text: 'más',
        acceptedInputs: ['mas', 'más'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'mas'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('mas');
    });

    it('should accept "e" for "é" in loose mode', () => {
      const target: Target = {
        text: 'café',
        acceptedInputs: ['cafe', 'café'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'cafe'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('cafe');
    });

    it('should accept "i" for "í" in loose mode', () => {
      const target: Target = {
        text: 'así',
        acceptedInputs: ['asi', 'así'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'asi'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('asi');
    });

    it('should accept "o" for "ó" in loose mode', () => {
      const target: Target = {
        text: 'adiós',
        acceptedInputs: ['adios', 'adiós'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'adios'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('adios');
    });

    it('should accept "u" for "ú" in loose mode', () => {
      const target: Target = {
        text: 'tú',
        acceptedInputs: ['tu', 'tú'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'tu'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('tu');
    });
  });

  describe('Strict Mode - Exact Accent Required', () => {
    beforeEach(() => {
      handler.setMode('strict');
    });

    it('should require exact "ñ" in strict mode', () => {
      const target: Target = {
        text: 'español',
        acceptedInputs: ['español'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      // Type with 'ñ'
      'español'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('español');
    });

    it('should NOT accept "n" for "ñ" in strict mode', () => {
      const target: Target = {
        text: 'español',
        acceptedInputs: ['español'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      let result!: MatchResult;
      'espanol'.split('').forEach((char) => {
        result = handler.handleKey(mockEvent(char));
      });

      expect(handler.getBuffer()).toBe('espanol');
      expect(result?.completed).toBe(false); // Does NOT match
    });

    it('should require exact "á" in strict mode', () => {
      const target: Target = {
        text: 'más',
        acceptedInputs: ['más'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'más'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('más');
    });
  });

  describe('Special Characters', () => {
    it('should handle inverted question mark "¿"', () => {
      const target: Target = {
        text: '¿Cómo estás?',
        acceptedInputs: ['¿Como estas?', '¿Cómo estás?'],
        level: 2,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      // Loose mode: can use ASCII
      '¿Como estas?'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('¿Como estas?');
    });

    it('should handle inverted exclamation mark "¡"', () => {
      const target: Target = {
        text: '¡Hola!',
        acceptedInputs: ['¡Hola!'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      '¡Hola!'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('¡Hola!');
    });
  });

  describe('Common Words and Phrases', () => {
    it('should handle "buenos días"', () => {
      const target: Target = {
        text: 'buenos días',
        acceptedInputs: ['buenos dias', 'buenos días'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'buenos dias'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('buenos dias');
    });

    it('should handle "por favor"', () => {
      const target: Target = {
        text: 'por favor',
        acceptedInputs: ['por favor'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'por favor'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('por favor');
    });

    it('should handle "gracias"', () => {
      const target: Target = {
        text: 'gracias',
        acceptedInputs: ['gracias'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'gracias'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getBuffer()).toBe('gracias');
    });
  });

  describe('Backspace Handling', () => {
    it('should remove last character on backspace', () => {
      const target: Target = {
        text: 'español',
        acceptedInputs: ['espanol', 'español'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'espa'.split('').forEach((char) => handler.handleKey(mockEvent(char)));
      expect(handler.getBuffer()).toBe('espa');

      handler.handleKey(mockEvent('Backspace'));
      expect(handler.getBuffer()).toBe('esp');
    });
  });

  describe('Accuracy Tracking', () => {
    it('should maintain 100% accuracy on correct input', () => {
      const target: Target = {
        text: 'hola',
        acceptedInputs: ['hola'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'hola'.split('').forEach((char) => handler.handleKey(mockEvent(char)));

      expect(handler.getAccuracy()).toBe(100);
    });

    it('should decrease accuracy on wrong input', () => {
      const target: Target = {
        text: 'hola',
        acceptedInputs: ['hola'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      handler.handleKey(mockEvent('h')); // correct
      handler.handleKey(mockEvent('x')); // wrong
      handler.handleKey(mockEvent('o')); // correct

      const accuracy = handler.getAccuracy();
      expect(accuracy).toBeLessThan(100);
      expect(accuracy).toBeGreaterThan(0);
    });
  });

  describe('Expected Character', () => {
    it('should return next expected character', () => {
      const target: Target = {
        text: 'hola',
        acceptedInputs: ['hola'],
        level: 1,
      };
      handler.setTarget(target);

      expect(handler.getExpectedChar()).toBe('h');

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      handler.handleKey(mockEvent('h'));
      expect(handler.getExpectedChar()).toBe('o');
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
        text: 'hola',
        acceptedInputs: ['hola'],
        level: 1,
      };
      handler.setTarget(target);

      const result = handler.handleKey({
        key: 'h',
        isComposing: true,
        preventDefault: () => {},
      } as KeyboardEvent);

      expect(handler.getBuffer()).toBe('');
      expect(result.completed).toBe(false);
    });

    it('should handle reset correctly', () => {
      const target: Target = {
        text: 'hola',
        acceptedInputs: ['hola'],
        level: 1,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      handler.handleKey(mockEvent('h'));
      handler.handleKey(mockEvent('o'));

      handler.reset();

      expect(handler.getBuffer()).toBe('');
      expect(handler.getAccuracy()).toBe(100);
    });
  });

  describe('Mode Switching', () => {
    it('should switch between loose and strict modes', () => {
      const target: Target = {
        text: 'español',
        acceptedInputs: ['español'],
        level: 1,
      };
      handler.setTarget(target);

      // Start in loose mode
      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      'espanol'.split('').forEach((char) => handler.handleKey(mockEvent(char)));
      expect(handler.getBuffer()).toBe('espanol');

      handler.reset();
      handler.setMode('strict');

      // Now requires exact accent
      let result!: MatchResult;
      'espanol'.split('').forEach((char) => {
        result = handler.handleKey(mockEvent(char));
      });
      expect(result?.completed).toBe(false);
    });
  });

  describe('Long Sentences', () => {
    it('should handle long sentences with multiple accents', () => {
      const sentence = 'El niño comió manzanas en el jardín.';
      const target: Target = {
        text: sentence,
        acceptedInputs: ['El nino comio manzanas en el jardin.', sentence],
        level: 3,
      };
      handler.setTarget(target);

      const mockEvent = (key: string) => ({
        key,
        isComposing: false,
        preventDefault: () => {},
      } as KeyboardEvent);

      // Use ASCII fallback
      'El nino comio manzanas en el jardin.'.split('').forEach((char) =>
        handler.handleKey(mockEvent(char))
      );

      expect(handler.getBuffer()).toBe('El nino comio manzanas en el jardin.');
    });
  });
});
