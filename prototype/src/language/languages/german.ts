/**
 * German Language Configuration
 *
 * German uses Latin alphabet with 4 umlauts (ä ö ü Ä Ö Ü) plus the unique
 * ß (Eszett / scharfes S). Same accent-input + ASCII fallback model as
 * Spanish/French, with DIN 5007 fallback rules (ae/oe/ue/ss).
 */

import { GermanHandler } from '../../input/GermanHandler.js';
import { DE_WORDS, DE_SENTENCES } from '../../data/corpus.js';
import type { LanguageConfig } from '../LanguageRegistry.js';

export const GERMAN_CONFIG: LanguageConfig = {
  code: 'de',
  name: 'German',
  nativeName: 'Deutsch',
  inputDescription:
    'Direct umlaut input (ä, ö, ü, ß) or ASCII fallback per DIN 5007 (ae → ä, oe → ö, ue → ü, ss → ß).',
  createHandler: () => new GermanHandler(),
  supportsTier0: false,
  corpus: {
    words: DE_WORDS,
    sentences: DE_SENTENCES,
  },
  icon: '🇩🇪',
  // 독일 국기 (Schwarz-Rot-Gold) — 첫 번째 색을 테마로 사용
  themeColor: '#000000',
};
