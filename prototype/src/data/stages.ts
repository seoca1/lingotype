/**
 * Sample Stages - 풀 스테이지 카탈로그
 *
 * 자세한 내용: ../../../design/StageDesignSpec.md
 * 본 파일은 6티어 (chars/words/words+/sentences/sentences+/passages) × 4언어 = 40개 스테이지의 골격.
 * Phase 6에서 코퍼스 확장 시 함께 활성화.
 */

import type { MissionConfig, StageConfig } from '../types.js';

export type StageTier = 0 | 1 | 2 | 3 | 4 | 5;

export interface MissionTemplate {
  defeat_count?: { count: number };
  accuracy_threshold?: { threshold: number };
  wpm_threshold?: { threshold: number };
  category_focus?: { count: number; category: string };
  combo_chain?: { count: number };
}

function m(
  id: string,
  name: string,
  description: string,
  type: MissionConfig['type'],
  params: MissionConfig['params'],
): MissionConfig {
  return { id, name, description, type, params };
}

/**
 * 티어별 기본 미션 자동 생성
 */
export function defaultMissionsForTier(tier: StageTier): MissionConfig[] {
  switch (tier) {
    case 0:
      return [
        m(`tier0_acc`, '정확도 95%', '정확도 95% 이상', 'accuracy_threshold', { threshold: 95 }),
        m(`tier0_count`, '15개 처치', '15개 문자 처치', 'defeat_count', { count: 15 }),
      ];
    case 1:
      return [
        m(`tier1_count`, '5개 처치', '5개 단어 정확히 입력', 'defeat_count', { count: 5 }),
      ];
    case 2:
      return [
        m(`tier2_count`, '8개 처치', '8개 단어 정확히 입력', 'defeat_count', { count: 8 }),
        m(`tier2_combo`, '콤보 5', '5 콤보 달성', 'combo_chain', { count: 5 }),
      ];
    case 3:
      return [
        m(`tier3_count`, '8개 처치', '8개 문장 정확히 입력', 'defeat_count', { count: 8 }),
        m(`tier3_acc`, '정확도 85%', '정확도 85% 이상', 'accuracy_threshold', { threshold: 85 }),
        m(`tier3_wpm`, 'WPM 20', '분당 20단어 이상', 'wpm_threshold', { threshold: 20 }),
      ];
    case 4:
      return [
        m(`tier4_count`, '5개 처치', '5개 긴 문장 처치', 'defeat_count', { count: 5 }),
        m(`tier4_acc`, '정확도 80%', '정확도 80% 이상', 'accuracy_threshold', { threshold: 80 }),
        m(`tier4_combo`, '콤보 10', '10 콤보 달성', 'combo_chain', { count: 10 }),
      ];
    case 5:
      return [
        m(`tier5_count`, '4개 처치', '4개 패시지 처치', 'defeat_count', { count: 4 }),
        m(`tier5_acc`, '정확도 75%', '정확도 75% 이상', 'accuracy_threshold', { threshold: 75 }),
        m(`tier5_wpm`, 'WPM 25', '분당 25단어 이상', 'wpm_threshold', { threshold: 25 }),
      ];
  }
}

interface StageSpec extends Omit<StageConfig, 'missions'> {
  /** true면 코퍼스 미준비로 메뉴에서 숨김 (Phase 6+) */
  requiresCorpus?: string;
  tier: StageTier;
  missions: MissionConfig[];
}

const EN_STAGES: StageSpec[] = [
  // Tier 1 (basic words)
  {
    id: 'en_1_1',
    language: 'en',
    tier: 1,
    name: 'First Words',
    description: '가장 흔한 영어 단어 (인사·기본)',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting', 'basic'] },
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'en_1_2',
    language: 'en',
    tier: 1,
    name: 'Numbers & Colors',
    description: '숫자·색상 12개',
    difficulty: 1,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['number', 'color'] },
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'en_1_3',
    language: 'en',
    tier: 1,
    name: 'Everyday Objects',
    description: '일상 사물 (음식·물건·동물)',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['food', 'object', 'animal'] },
    missions: defaultMissionsForTier(1),
  },

  // Tier 2 (extended vocabulary)
  {
    id: 'en_2_1',
    language: 'en',
    tier: 2,
    name: 'Phrases & Verbs',
    description: '긴 단어·부사·동사',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 2, maxLevel: 2 },
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'en_2_2',
    language: 'en',
    tier: 2,
    name: 'Daily Life',
    description: '일상·가족·장소 어휘',
    difficulty: 2,
    wordCount: 15,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['family', 'person', 'place'] },
    missions: defaultMissionsForTier(2),
  },

  // Tier 3 (short sentences)
  {
    id: 'en_3_1',
    language: 'en',
    tier: 3,
    name: 'Short Sentences',
    description: '짧은 문장 (인사·기본)',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 3, maxLevel: 3 },
    requiresCorpus: 'sentences',
    missions: defaultMissionsForTier(3),
  },
  {
    id: 'en_3_2',
    language: 'en',
    tier: 3,
    name: 'Travel Phrases',
    description: '여행·식당 표현',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['question', 'restaurant'] },
    requiresCorpus: 'sentences',
    missions: defaultMissionsForTier(3),
  },

  // Tier 4 (medium sentences)
  {
    id: 'en_4_1',
    language: 'en',
    tier: 4,
    name: 'News Headlines',
    description: '뉴스 헤드라인·긴 문장',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 4, maxLevel: 4 },
    requiresCorpus: 'news',
    missions: defaultMissionsForTier(4),
  },
  {
    id: 'en_4_2',
    language: 'en',
    tier: 4,
    name: 'Movie Quotes',
    description: '영화 인용구',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['quote'] },
    requiresCorpus: 'quotes',
    missions: defaultMissionsForTier(4),
  },

  // Tier 5 (passages)
  {
    id: 'en_5_1',
    language: 'en',
    tier: 5,
    name: 'Literature Excerpts',
    description: '문학 발췌·단락',
    difficulty: 5,
    wordCount: 5,
    corpusFilter: { minLevel: 5, maxLevel: 5 },
    requiresCorpus: 'passages',
    missions: defaultMissionsForTier(5),
  },

  // ===== Travel Theme Stages (여행 테마) =====
  {
    id: 'en_t_1',
    language: 'en',
    tier: 2,
    name: 'Travel Essentials',
    description: '여행 필수 단어 (공항·호텔·식당)',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['travel'] },
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'en_t_2',
    language: 'en',
    tier: 3,
    name: 'At the Airport',
    description: '공항에서 쓰는 표현과 단어',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 3, categories: ['travel'] },
    missions: defaultMissionsForTier(3),
  },
  {
    id: 'en_t_3',
    language: 'en',
    tier: 3,
    name: 'Travel Phrases',
    description: '여행 회화 표현 (길묻기·주문·체크인)',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['travel'] },
    requiresCorpus: 'sentences',
    missions: defaultMissionsForTier(3),
  },

  // ===== Romance theme (source: [[dating-romance]]) =====
  {
    id: 'en_d_1',
    language: 'en',
    tier: 2,
    name: 'First Date Words',
    description: '첫 데이트 어휘 — 자기소개, 칭찬, 데이트 기본',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 2, maxLevel: 2, categories: ['romance'] },
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'en_d_2',
    language: 'en',
    tier: 3,
    name: 'Confession & Affection',
    description: '고백과 호감 표현 — like, miss, love, kiss',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['romance'] },
    missions: defaultMissionsForTier(3),
  },
];

const JP_STAGES: StageSpec[] = [
  // Tier 0 (chars) — JP only
  {
    id: 'jp_0_1',
    language: 'jp',
    tier: 0,
    name: 'ひらがな (기본 46자)',
    description: '히라가나 기본 문자',
    difficulty: 1,
    wordCount: 20,
    corpusFilter: { categories: ['hiragana_basic'] },
    romajiHint: true,
    missions: defaultMissionsForTier(0),
  },
  {
    id: 'jp_0_2',
    language: 'jp',
    tier: 0,
    name: 'カタカナ (기본 46자)',
    description: '가타카나 기본 문자',
    difficulty: 1,
    wordCount: 20,
    corpusFilter: { categories: ['katakana_basic'] },
    romajiHint: true,
    missions: defaultMissionsForTier(0),
  },
  {
    id: 'jp_0_3',
    language: 'jp',
    tier: 0,
    name: '濁音・拗音',
    description: '탁음·반탁음·요음',
    difficulty: 2,
    wordCount: 18,
    corpusFilter: { categories: ['hiragana_dakuten', 'hiragana_yoon'] },
    romajiHint: true,
    missions: defaultMissionsForTier(0),
  },

  // Tier 1 (kana words)
  {
    id: 'jp_1_1',
    language: 'jp',
    tier: 1,
    name: 'ひらがな単語',
    description: '히라가나 단어 (N5)',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1 },
    romajiHint: true,
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'jp_1_2',
    language: 'jp',
    tier: 1,
    name: '挨拶',
    description: '인사 표현',
    difficulty: 1,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting'] },
    romajiHint: true,
    missions: defaultMissionsForTier(1),
  },

  // Tier 2 (basic kanji)
  {
    id: 'jp_2_1',
    language: 'jp',
    tier: 2,
    name: '漢字入門',
    description: '기초 한자 단어',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 2, maxLevel: 2 },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'jp_2_2',
    language: 'jp',
    tier: 2,
    name: 'カタカナ語',
    description: '가타카나 외래어',
    difficulty: 2,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 2, categories: ['katakana_words'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // Tier 3
  {
    id: 'jp_3_1',
    language: 'jp',
    tier: 3,
    name: '日常会話',
    description: '일상 회화 문장',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 3, maxLevel: 3 },
    requiresCorpus: 'sentences',
    romajiHint: false,
    missions: defaultMissionsForTier(3),
  },
  {
    id: 'jp_3_2',
    language: 'jp',
    tier: 3,
    name: 'アニメ・ドラマ',
    description: '애니·드라마 명대사',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['quote'] },
    requiresCorpus: 'quotes',
    missions: defaultMissionsForTier(3),
  },

  // Tier 4
  {
    id: 'jp_4_1',
    language: 'jp',
    tier: 4,
    name: 'ニュース見出し',
    description: '뉴스 헤드라인',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 4, maxLevel: 4 },
    requiresCorpus: 'news',
    missions: defaultMissionsForTier(4),
  },
  {
    id: 'jp_4_2',
    language: 'jp',
    tier: 4,
    name: 'ビジネスメール',
    description: '비즈니스 이메일',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['business'] },
    requiresCorpus: 'business',
    missions: defaultMissionsForTier(4),
  },

  // Tier 5
  {
    id: 'jp_5_1',
    language: 'jp',
    tier: 5,
    name: '文学作品',
    description: '문학 단락',
    difficulty: 5,
    wordCount: 5,
    corpusFilter: { minLevel: 5, maxLevel: 5 },
    requiresCorpus: 'passages',
    missions: defaultMissionsForTier(5),
  },

  // ===== 旅行テーマ (Travel Theme) =====
  {
    id: 'jp_t_1',
    language: 'jp',
    tier: 2,
    name: '旅行の基礎',
    description: '여행 필수 단어 (공항·역·호텔)',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 5, maxLevel: 5, categories: ['travel'] },
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'jp_t_2',
    language: 'jp',
    tier: 3,
    name: '空港・駅',
    description: '공항·역에서 쓰는 표현',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 5, maxLevel: 5, categories: ['travel'] },
    missions: defaultMissionsForTier(3),
  },
  {
    id: 'jp_t_3',
    language: 'jp',
    tier: 3,
    name: '旅行フレーズ',
    description: '여행 회화 표현 (길묻기·주문)',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 5, maxLevel: 5, categories: ['travel'] },
    requiresCorpus: 'sentences',
    missions: defaultMissionsForTier(3),
  },

  // ===== Romance theme (source: [[dating-romance-jp]]) =====
  {
    id: 'jp_d_1',
    language: 'jp',
    tier: 2,
    name: 'デート言葉',
    description: 'デートの基本語彙 — 紹介、褒め言葉、好意',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 2, maxLevel: 2, categories: ['romance'] },
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'jp_d_2',
    language: 'jp',
    tier: 3,
    name: '告白と進展',
    description: '告白・恋人関係 — 好き、告白、付き合う',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['romance'] },
    missions: defaultMissionsForTier(3),
  },
];

const ES_STAGES: StageSpec[] = [
  // Tier 1
  {
    id: 'es_1_1',
    language: 'es',
    tier: 1,
    name: 'Primeras Palabras',
    description: '기본 어휘 (인사·기본·숫자·색)',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1 },
    accentMode: 'loose',
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'es_1_2',
    language: 'es',
    tier: 1,
    name: 'Saludos',
    description: '인사 표현',
    difficulty: 1,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(1),
  },

  // Tier 2
  {
    id: 'es_2_1',
    language: 'es',
    tier: 2,
    name: 'Acentos (Strict)',
    description: '액센트 단어 (Strict 모드 시작)',
    difficulty: 2,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 2 },
    accentMode: 'strict',
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'es_2_2',
    language: 'es',
    tier: 2,
    name: 'Cotidiano',
    description: '일상 어휘 (Strict)',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['food', 'family', 'place'] },
    accentMode: 'strict',
    missions: defaultMissionsForTier(2),
  },

  // Tier 3
  {
    id: 'es_3_1',
    language: 'es',
    tier: 3,
    name: 'Frases Cortas',
    description: '짧은 문장',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 3, maxLevel: 3 },
    requiresCorpus: 'sentences',
    accentMode: 'strict',
    missions: defaultMissionsForTier(3),
  },
  {
    id: 'es_3_2',
    language: 'es',
    tier: 3,
    name: 'Conversación',
    description: '회화 문장',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['conversation'] },
    requiresCorpus: 'sentences',
    accentMode: 'strict',
    missions: defaultMissionsForTier(3),
  },

  // Tier 4
  {
    id: 'es_4_1',
    language: 'es',
    tier: 4,
    name: 'Noticias',
    description: '뉴스 문장',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 4, maxLevel: 4 },
    requiresCorpus: 'news',
    accentMode: 'strict',
    missions: defaultMissionsForTier(4),
  },
  {
    id: 'es_4_2',
    language: 'es',
    tier: 4,
    name: 'Refranes',
    description: '속담·격언',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['proverb'] },
    requiresCorpus: 'proverbs',
    accentMode: 'strict',
    missions: defaultMissionsForTier(4),
  },

  // Tier 5
  {
    id: 'es_5_1',
    language: 'es',
    tier: 5,
    name: 'Literatura',
    description: '문학 단락',
    difficulty: 5,
    wordCount: 5,
    corpusFilter: { minLevel: 5, maxLevel: 5 },
    requiresCorpus: 'passages',
    accentMode: 'strict',
    missions: defaultMissionsForTier(5),
  },

  // ===== Tema Viajes (Travel Theme) =====
  {
    id: 'es_t_1',
    language: 'es',
    tier: 2,
    name: 'Viajes Esenciales',
    description: '여행 필수 어휘 (공항·호텔·식당)',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['travel'] },
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'es_t_2',
    language: 'es',
    tier: 3,
    name: 'En el Aeropuerto',
    description: '공항에서 쓰는 어휘',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 3, categories: ['travel'] },
    missions: defaultMissionsForTier(3),
  },
  {
    id: 'es_t_3',
    language: 'es',
    tier: 3,
    name: 'Frases de Viaje',
    description: '여행 회화 표현 (길묻기·주문·체크인)',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 2, maxLevel: 2, categories: ['travel'] },
    requiresCorpus: 'sentences',
    accentMode: 'loose',
    missions: defaultMissionsForTier(3),
  },

  // ===== Romance theme (source: [[dating-romance-es]]) =====
  {
    id: 'es_d_1',
    language: 'es',
    tier: 2,
    name: 'Citas y Piropos',
    description: 'Citas y cumplidos — 자기소개, 칭찬, 데이트',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 2, maxLevel: 2, categories: ['romance'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'es_d_2',
    language: 'es',
    tier: 3,
    name: 'Declaración',
    description: 'Declaración de amor — gustar, querer, amar, enamorado',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['romance'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(3),
  },
];

const KR_STAGES: StageSpec[] = [
  // Tier 1
  {
    id: 'kr_1_1',
    language: 'kr',
    tier: 1,
    name: '첫 인사',
    description: 'TOPIK 1 인사 표현',
    difficulty: 1,
    wordCount: 8,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting', 'basic'] },
    romajiHint: true,
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'kr_1_2',
    language: 'kr',
    tier: 1,
    name: '숫자',
    description: '한국어 숫자 1~10',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['number'] },
    romajiHint: true,
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'kr_1_3',
    language: 'kr',
    tier: 1,
    name: '가족·음식',
    description: '가족·음식 어휘',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['family', 'food'] },
    romajiHint: true,
    missions: defaultMissionsForTier(1),
  },

  // Tier 2
  {
    id: 'kr_2_1',
    language: 'kr',
    tier: 2,
    name: '일상 단어',
    description: 'TOPIK 2 일상 어휘',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 2, maxLevel: 2 },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'kr_2_2',
    language: 'kr',
    tier: 2,
    name: '시간·장소',
    description: '시간·장소 어휘',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['time', 'place'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // Tier 3
  {
    id: 'kr_3_1',
    language: 'kr',
    tier: 3,
    name: '짧은 문장',
    description: '짧은 문장',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 3, maxLevel: 3 },
    requiresCorpus: 'sentences',
    missions: defaultMissionsForTier(3),
  },
  {
    id: 'kr_3_2',
    language: 'kr',
    tier: 3,
    name: '자기소개',
    description: '자기소개 표현',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['introduction'] },
    requiresCorpus: 'sentences',
    missions: defaultMissionsForTier(3),
  },

  // Tier 4
  {
    id: 'kr_4_1',
    language: 'kr',
    tier: 4,
    name: '뉴스 헤드라인',
    description: '뉴스 헤드라인',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 4, maxLevel: 4 },
    requiresCorpus: 'news',
    missions: defaultMissionsForTier(4),
  },

  // Tier 5
  {
    id: 'kr_5_1',
    language: 'kr',
    tier: 5,
    name: '한국 문화 단락',
    description: '문화·문학 단락',
    difficulty: 5,
    wordCount: 5,
    corpusFilter: { minLevel: 5, maxLevel: 5 },
    requiresCorpus: 'passages',
    missions: defaultMissionsForTier(5),
  },

  // ===== 여행 테마 (Travel Theme) =====
  {
    id: 'kr_t_1',
    language: 'kr',
    tier: 2,
    name: '여행 기초',
    description: '여행 필수 단어 (공항·호텔·식당)',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['travel'] },
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'kr_t_2',
    language: 'kr',
    tier: 3,
    name: '공항·역에서',
    description: '공항·역에서 쓰는 어휘',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['travel'] },
    missions: defaultMissionsForTier(3),
  },
  {
    id: 'kr_t_3',
    language: 'kr',
    tier: 3,
    name: '여행 회화',
    description: '여행 회화 표현 (길묻기·주문·체크인)',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['travel'] },
    missions: defaultMissionsForTier(3),
  },

  // ===== Romance theme (source: [[dating-romance-kr]]) =====
  {
    id: 'kr_d_1',
    language: 'kr',
    tier: 1,
    name: '썸·첫 데이트',
    description: '썸과 첫 데이트 어휘 — 자기소개, 칭찬, 취미',
    difficulty: 1,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['romance'] },
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'kr_d_2',
    language: 'kr',
    tier: 3,
    name: '고백·연인',
    description: '고백과 연인 — 좋아하다, 사랑하다, 고백, 썸, 연인',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['romance'] },
    missions: defaultMissionsForTier(3),
  },
];

const FR_STAGES: StageSpec[] = [
  // Tier 1 — basic vocabulary (greeting, numbers, colors, family)
  {
    id: 'fr_1_1',
    language: 'fr',
    tier: 1,
    name: 'Premiers Mots',
    description: '기본 어휘 (인사·기본·숫자·색)',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting', 'basic', 'number', 'color'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'fr_1_2',
    language: 'fr',
    tier: 1,
    name: 'Salutations',
    description: '인사·정중 표현',
    difficulty: 1,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting', 'expression'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'fr_1_3',
    language: 'fr',
    tier: 1,
    name: 'Famille et Objets',
    description: '가족·일상 사물',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['family', 'place', 'object', 'animal'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(1),
  },

  // Tier 2 — extended vocabulary (verbs, food, travel)
  {
    id: 'fr_2_1',
    language: 'fr',
    tier: 2,
    name: 'Accents (Strict)',
    description: '액센트 단어 (Strict 모드 시작)',
    difficulty: 2,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 2 },
    accentMode: 'strict',
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'fr_2_2',
    language: 'fr',
    tier: 2,
    name: 'Voyage Essentiel',
    description: '여행 필수 어휘 (공항·호텔·방향)',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['travel', 'food'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(2),
  },

  // Tier 3 — short sentences
  {
    id: 'fr_3_1',
    language: 'fr',
    tier: 3,
    name: 'Phrases Courtes',
    description: '짧은 문장 (인사·기본)',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3 },
    requiresCorpus: 'sentences',
    accentMode: 'strict',
    missions: defaultMissionsForTier(3),
  },
];
const DE_STAGES: StageSpec[] = [
  // Tier 1 — basic vocabulary (greeting, numbers, colors, family, articles)
  {
    id: 'de_1_1',
    language: 'de',
    tier: 1,
    name: 'Erste Wörter',
    description: '기본 어휘 (인사·숫자·색)',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting', 'basic', 'number', 'color'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'de_1_2',
    language: 'de',
    tier: 1,
    name: 'Begrüßungen',
    description: '인사·정중 표현',
    difficulty: 1,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting', 'expression'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'de_1_3',
    language: 'de',
    tier: 1,
    name: 'Familie und Objekte',
    description: '가족·일상 사물·관사',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['family', 'place', 'object', 'animal', 'article'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(1),
  },

  // Tier 2 — extended vocabulary (verbs, food, travel)
  {
    id: 'de_2_1',
    language: 'de',
    tier: 2,
    name: 'Umlaute (Strict)',
    description: '움라우트 단어 (Strict 모드 시작)',
    difficulty: 2,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 2 },
    accentMode: 'strict',
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'de_2_2',
    language: 'de',
    tier: 2,
    name: 'Reise Grundwortschatz',
    description: '여행 필수 어휘 (공항·호텔·방향)',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['travel', 'food'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(2),
  },

  // Tier 3 — short sentences
  {
    id: 'de_3_1',
    language: 'de',
    tier: 3,
    name: 'Kurze Sätze',
    description: '짧은 문장 (인사·기본)',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3 },
    requiresCorpus: 'sentences',
    accentMode: 'strict',
    missions: defaultMissionsForTier(3),
  },
];
const ZH_STAGES: StageSpec[] = [
  // Tier 1 — basic vocabulary (greeting, numbers, colors, family)
  {
    id: 'zh_1_1',
    language: 'zh',
    tier: 1,
    name: 'First Characters',
    description: '기본 한자 (인사·숫자·색)',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting', 'basic', 'number', 'color'] },
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'zh_1_2',
    language: 'zh',
    tier: 1,
    name: 'Greetings & Family',
    description: '인사·정중 표현·가족',
    difficulty: 1,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['greeting', 'expression', 'family'] },
    missions: defaultMissionsForTier(1),
  },
  {
    id: 'zh_1_3',
    language: 'zh',
    tier: 1,
    name: 'Daily Objects',
    description: '일상 사물·시간 표현',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1, categories: ['food', 'time', 'object', 'animal', 'place'] },
    missions: defaultMissionsForTier(1),
  },

  // Tier 2 — extended vocabulary (verbs, food, travel, business)
  {
    id: 'zh_2_1',
    language: 'zh',
    tier: 2,
    name: 'Daily Verbs',
    description: '일상 동사 (먹다·가다·오다·보다·일하다·자다)',
    difficulty: 2,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['verb'] },
    missions: defaultMissionsForTier(2),
  },
  {
    id: 'zh_2_2',
    language: 'zh',
    tier: 2,
    name: 'Travel Essentials',
    description: '여행 필수 어휘 (공항·호텔·교통수단)',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['travel', 'food'] },
    missions: defaultMissionsForTier(2),
  },

  // Tier 3 — short sentences
  {
    id: 'zh_3_1',
    language: 'zh',
    tier: 3,
    name: 'Short Phrases',
    description: '짧은 문장 (인사·기본·일상·여행)',
    difficulty: 3,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3 },
    requiresCorpus: 'sentences',
    missions: defaultMissionsForTier(3),
  },
];

const ALL_STAGE_SPECS: StageSpec[] = [
  ...EN_STAGES,
  ...JP_STAGES,
  ...ES_STAGES,
  ...KR_STAGES,
  ...FR_STAGES,
  ...DE_STAGES,
  ...ZH_STAGES,
];

/**
 * 현재 사용 가능한 (코퍼스 준비된) 스테이지만 노출
 * requiresCorpus가 표시된 스테이지는 코퍼스 확장 후 노출됨
 */
const AVAILABLE_CORPUS = new Set([
  'hiragana_basic',
  'katakana_basic',
  'hiragana_dakuten',
  'hiragana_yoon',
  'sentences',  // Tier 3: Short sentences (EN/JP/ES/KR 각 8+ 문장 추가됨)
  'news',       // Tier 4: News headlines (Phase K — 12 entries per language)
]);

export const SAMPLE_STAGES: StageConfig[] = ALL_STAGE_SPECS
  .filter((s) => !s.requiresCorpus || AVAILABLE_CORPUS.has(s.requiresCorpus))
  .map(({ tier, requiresCorpus: _ignored, ...stage }) => stage);

/**
 * 모든 정의된 스테이지 (코퍼스 미비한 것 포함, 디버그/개발용)
 */
export const ALL_STAGES: StageConfig[] = ALL_STAGE_SPECS.map(
  ({ tier: _t, requiresCorpus: _r, ...stage }) => stage,
);

/**
 * 티어별 그룹화 (동적 언어 지원)
 */
export function stagesByTier(language: string): Record<StageTier, StageConfig[]> {
  const result: Record<StageTier, StageConfig[]> = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [],
  };
  for (const stage of ALL_STAGES) {
    if (stage.language !== language) continue;
    const spec = ALL_STAGE_SPECS.find((s) => s.id === stage.id);
    if (spec) result[spec.tier].push(stage);
  }
  return result;
}