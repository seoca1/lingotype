/**
 * Language System - Entry Point
 * 
 * 모든 언어를 등록하고 export합니다.
 * 새로운 언어를 추가하려면:
 * 1. languages/{lang}.ts 파일 생성
 * 2. 여기서 import 및 registerLanguage() 호출
 */

import { registerLanguage } from './LanguageRegistry.js';
import { ENGLISH_CONFIG } from './languages/english.js';
import { JAPANESE_CONFIG } from './languages/japanese.js';
import { SPANISH_CONFIG } from './languages/spanish.js';
import { KOREAN_CONFIG } from './languages/korean.js';
import { FRENCH_CONFIG } from './languages/french.js';
import { GERMAN_CONFIG } from './languages/german.js';
import { CHINESE_CONFIG } from './languages/chinese.js';

// 모든 언어 자동 등록
registerLanguage(ENGLISH_CONFIG);
registerLanguage(JAPANESE_CONFIG);
registerLanguage(SPANISH_CONFIG);
registerLanguage(KOREAN_CONFIG);
registerLanguage(FRENCH_CONFIG);
registerLanguage(GERMAN_CONFIG);
registerLanguage(CHINESE_CONFIG);

// Re-export registry functions
export {
  LANGUAGE_REGISTRY,
  registerLanguage,
  getLanguage,
  getAllLanguageCodes,
  getAllLanguages,
  type LanguageConfig,
} from './LanguageRegistry.js';
