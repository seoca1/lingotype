/**
 * Input Handler Factory
 *
 * 언어 코드에 따라 적절한 핸들러를 반환.
 */

import { EnglishHandler } from './EnglishHandler.js';
import { JapaneseHandler } from './JapaneseHandler.js';
import { SpanishHandler } from './SpanishHandler.js';
import { KoreanHandler } from './KoreanHandler.js';
import { ChineseHandler } from './ChineseHandler.js';
import { FrenchHandler } from './FrenchHandler.js';
import { GermanHandler } from './GermanHandler.js';
import type { InputHandler } from './InputHandler.js';
import type { Language } from '../types.js';

export function createInputHandler(language: Language): InputHandler {
  switch (language) {
    case 'en':
      return new EnglishHandler();
    case 'jp':
      return new JapaneseHandler();
    case 'es':
      return new SpanishHandler();
    case 'kr':
      return new KoreanHandler();
    case 'fr':
      return new FrenchHandler();
    case 'de':
      return new GermanHandler();
    case 'zh':
      return new ChineseHandler();
    default:
      throw new Error(`Unknown language: ${language}`);
  }
}

export { EnglishHandler, JapaneseHandler, SpanishHandler, KoreanHandler };
export { ChineseHandler, FrenchHandler, GermanHandler };
export type { InputHandler };