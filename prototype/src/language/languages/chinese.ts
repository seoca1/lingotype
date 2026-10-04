/**
 * Chinese Language Configuration
 *
 * Chinese uses Hanzi (汉字) display with pinyin input.
 * Phase 18 — Chinese language scaffold.
 *
 * See wiki/languages/chinese.md for design decisions and historical context.
 */

import { ChineseHandler } from '../../input/ChineseHandler.js';
import { ZH_WORDS, ZH_SENTENCES } from '../../data/corpus.js';
import type { LanguageConfig } from '../LanguageRegistry.js';

export const CHINESE_CONFIG: LanguageConfig = {
  code: 'zh',
  name: 'Chinese',
  nativeName: '中文',
  inputDescription:
    'Pinyin input — tone marks (nǐ hǎo) or ASCII numbers (ni3 hao3). Spaces optional; tone marks optional.',
  createHandler: () => new ChineseHandler(),
  supportsTier0: false,
  corpus: {
    words: ZH_WORDS,
    sentences: ZH_SENTENCES,
  },
  icon: '🇨🇳',
  // 중국 국기 (红旗) — 빨강 테마
  themeColor: '#DE2910',
};
