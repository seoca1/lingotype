/**
 * French Language Configuration
 *
 * French uses Latin alphabet with 5 diacritics (acute, grave, circumflex, diaeresis, cedilla)
 * plus the œ ligature. Same accent-input + ASCII fallback model as Spanish (ADR-0003
 * analogue); see SpanishHandler for the canonical pattern.
 */

import { FrenchHandler } from '../../input/FrenchHandler.js';
import { FR_WORDS, FR_SENTENCES } from '../../data/corpus.js';
import type { LanguageConfig } from '../LanguageRegistry.js';

export const FRENCH_CONFIG: LanguageConfig = {
  code: 'fr',
  name: 'French',
  nativeName: 'Français',
  inputDescription:
    'Direct accent input (é, è, ê, à, ç) or ASCII fallback (e → é, a → à, c → ç). œ ligature accepted as "oe".',
  createHandler: () => new FrenchHandler(),
  supportsTier0: false,
  corpus: {
    words: FR_WORDS,
    sentences: FR_SENTENCES,
  },
  icon: '🇫🇷',
  // French bleu-blanc-rouge — 첫 번째 색을 테마로 사용
  themeColor: '#0055A4',
};
