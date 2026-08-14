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
  {
    id: 'en_5_2',
    language: 'en',
    tier: 5,
    name: 'Life Reflections',
    description: '명상·가치관·삶의 통찰 단락',
    difficulty: 5,
    wordCount: 5,
    corpusFilter: { minLevel: 5, maxLevel: 5, categories: ['passage'] },
    missions: defaultMissionsForTier(5),
  },

  // ===== Tier 4 themed stages (Phase 9 — corpus expansion) =====
  {
    id: 'en_m_1',
    language: 'en',
    tier: 4,
    name: 'Motivation & Mindset',
    description: '동기부여·마인드셋 표현',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['motivation'] },
    missions: defaultMissionsForTier(4),
  },
  {
    id: 'en_co_1',
    language: 'en',
    tier: 4,
    name: 'Cooking Instructions',
    description: '요리·조리법 표현',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['cooking'] },
    missions: defaultMissionsForTier(4),
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

  // ===== 음식/요리 테마 (Food Theme) — source: [[food-vocabulary]] =====
  {
    id: 'en_f_1',
    language: 'en',
    tier: 2,
    name: 'Food & Cooking',
    description: '기본 음식 어휘 — meat, vegetable, fruits, beverages',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['food'] },
    missions: defaultMissionsForTier(2),
  },

  // ===== 비즈니스 테마 (Business Theme) — source: [[business-vocabulary]] =====
  {
    id: 'en_b_1',
    language: 'en',
    tier: 2,
    name: 'Business English',
    description: '비즈니스 기본 어휘 — email, meeting, work expressions',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['business'] },
    missions: defaultMissionsForTier(2),
  },

  // ===== 감정/성격 테마 (Emotion Theme) — source: [[emotions-personality-vocabulary]] =====
  {
    id: 'en_e_1',
    language: 'en',
    tier: 2,
    name: 'Emotions & Personality',
    description: '감정과 성격 표현 — happy, sad, kind, rude, personality traits',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['emotion'] },
    missions: defaultMissionsForTier(2),
  },

  // ===== 자연/날씨 테마 (Nature Theme) — source: [[nature-vocabulary]] =====
  {
    id: 'en_n_1',
    language: 'en',
    tier: 2,
    name: 'Nature & Weather',
    description: '자연과 날씨 어휘 — sun, rain, mountain, forest, seasons',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['nature'] },
    missions: defaultMissionsForTier(2),
  },

  // ===== 동물 테마 (Animals Theme) — source: [[animals-vocabulary]] =====
  {
    id: 'en_a_1',
    language: 'en',
    tier: 2,
    name: 'Animals',
    description: '동물 어휘 — pets, wild animals, insects, sea creatures',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['animals'] },
    missions: defaultMissionsForTier(2),
  },

  // ===== 의류/패션 테마 (Clothing Theme) — source: [[clothing-vocabulary]] =====
  {
    id: 'en_c_1',
    language: 'en',
    tier: 2,
    name: 'Clothing & Fashion',
    description: '의류와 패션 어휘 — shirt, dress, shoes, materials',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['clothing'] },
    missions: defaultMissionsForTier(2),
  },

  // ===== 감정/성격 테마 Tier 3 (Emotion Theme Lv2) — advanced emotions =====
  {
    id: 'en_e_2',
    language: 'en',
    tier: 3,
    name: 'Emotions Advanced',
    description: '고급 감정 표현 — to envy, to be grateful, flutter, jealous',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['emotion'] },
    missions: defaultMissionsForTier(3),
  },

  // ===== 음식/요리 테마 Tier 3 (Food Theme Lv2) =====
  {
    id: 'en_f_2',
    language: 'en',
    tier: 3,
    name: 'Food Advanced',
    description: '고급 음식 어휘 — ingredients, cooking methods, dining',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['food'] },
    missions: defaultMissionsForTier(3),
  },

  // ===== 비즈니스 테마 Tier 3 (Business Theme Lv2) =====
  {
    id: 'en_b_2',
    language: 'en',
    tier: 3,
    name: 'Business Advanced',
    description: '고급 비즈니스 어휘 — negotiation, strategy, corporate',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['business'] },
    missions: defaultMissionsForTier(3),
  },

  // ===== 자연/날씨 테마 Tier 3 (Nature Theme Lv2) =====
  {
    id: 'en_n_2',
    language: 'en',
    tier: 3,
    name: 'Nature Advanced',
    description: '고급 자연 어휘 — ecosystem, geography, climate',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['nature'] },
    missions: defaultMissionsForTier(3),
  },

  // ===== 동물 테마 Tier 3 (Animals Theme Lv2) =====
  {
    id: 'en_a_2',
    language: 'en',
    tier: 3,
    name: 'Animals Advanced',
    description: '고급 동물 어휘 — wildlife, marine life, animal behavior',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['animals'] },
    missions: defaultMissionsForTier(3),
  },

  // ===== 의류/패션 테마 Tier 3 (Clothing Theme Lv2) =====
  {
    id: 'en_c_2',
    language: 'en',
    tier: 3,
    name: 'Clothing Advanced',
    description: '고급 의류 어휘 — designer brands, fashion trends, tailoring',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['clothing'] },
    missions: defaultMissionsForTier(3),
  },

  // ===== 감정/성격 Tier 4 (Emotion Theme Lv3) — expert =====
  {
    id: 'en_e_3',
    language: 'en',
    tier: 4,
    name: 'Emotions Expert',
    description: '전문가 수준 감정 표현 — 복합 감정, 심리 상태',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['emotion'] },
    missions: defaultMissionsForTier(4),
  },

  // ===== 음식/요리 Tier 4 (Food Theme Lv3) =====
  {
    id: 'en_f_3',
    language: 'en',
    tier: 4,
    name: 'Food Expert',
    description: '전문 음식 어휘 — 미슐랭, 와인 pairing, 고급 레시피',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['food'] },
    missions: defaultMissionsForTier(4),
  },

  // ===== 비즈니스 Tier 4 (Business Theme Lv3) =====
  {
    id: 'en_b_3',
    language: 'en',
    tier: 4,
    name: 'Business Expert',
    description: '전문 비즈니스 어휘 — 인수합병, IPO, 현지화',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['business'] },
    missions: defaultMissionsForTier(4),
  },

  // ===== 자연 Tier 4 (Nature Theme Lv3) =====
  {
    id: 'en_n_3',
    language: 'en',
    tier: 4,
    name: 'Nature Expert',
    description: '전문 자연 어휘 — 생물다양성, 기후변화, 지질학',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['nature'] },
    missions: defaultMissionsForTier(4),
  },

  // ===== 동물 Tier 4 (Animals Theme Lv3) =====
  {
    id: 'en_a_3',
    language: 'en',
    tier: 4,
    name: 'Animals Expert',
    description: '전문 동물 어휘 — 종 보전, 생태학, 동물학',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['animals'] },
    missions: defaultMissionsForTier(4),
  },

  // ===== 의류 Tier 4 (Clothing Theme Lv3) =====
  {
    id: 'en_c_3',
    language: 'en',
    tier: 4,
    name: 'Clothing Expert',
    description: '전문 의류 어휘 — Haute couture, 소재 공학, 패션 역사',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['clothing'] },
    missions: defaultMissionsForTier(4),
  },

  // ===== 감정 Tier 5 (Emotion Theme Lv4) — master =====
  {
    id: 'en_e_4',
    language: 'en',
    tier: 5,
    name: 'Emotions Master',
    description: '마스터 수준 감정 표현 — 철학, 문학, 복합 감정',
    difficulty: 5,
    wordCount: 6,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['emotion'] },
    missions: defaultMissionsForTier(5),
  },

  // ===== 음식 Tier 5 (Food Theme Lv4) =====
  {
    id: 'en_f_4',
    language: 'en',
    tier: 5,
    name: 'Food Master',
    description: '마스터 수준 음식 표현 — 미식가, food critic',
    difficulty: 5,
    wordCount: 6,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['food'] },
    missions: defaultMissionsForTier(5),
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
  {
    id: 'jp_5_2',
    language: 'jp',
    tier: 5,
    name: '人生の考察',
    description: '명상·가치관·삶의 통찰 단락',
    difficulty: 5,
    wordCount: 5,
    corpusFilter: { minLevel: 5, maxLevel: 5, categories: ['passage'] },
    romajiHint: true,
    missions: defaultMissionsForTier(5),
  },

  // ===== Tier 4 themed stages (Phase 9 — corpus expansion) =====
  {
    id: 'jp_m_1',
    language: 'jp',
    tier: 4,
    name: '動機と心構え',
    description: '동기부여·마인드셋 표현',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['motivation'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },
  {
    id: 'jp_co_1',
    language: 'jp',
    tier: 4,
    name: '料理の指示',
    description: '요리·조리법 표현',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['cooking'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
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

  // ===== 食べ物テーマ (Food Theme) — source: [[food-vocabulary]] =====
  {
    id: 'jp_f_1',
    language: 'jp',
    tier: 2,
    name: '食べ物基本',
    description: '基本的な食べ物語彙 — 肉、野菜、果物、飲み物',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['food'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== ビジネステーマ (Business Theme) — source: [[business-vocabulary]] =====
  {
    id: 'jp_b_1',
    language: 'jp',
    tier: 2,
    name: 'ビジネス基本',
    description: 'ビジネス基本語彙 — メール、会议、仕事表現',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['business'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 感情/性格テーマ (Emotion Theme) — source: [[emotions-personality-vocabulary]] =====
  {
    id: 'jp_e_1',
    language: 'jp',
    tier: 2,
    name: '感情・性格',
    description: '感情と性格表現 — 嬉しい、悲しい、性格描写',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['emotion'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 自然/天気テーマ (Nature Theme) — source: [[nature-vocabulary]] =====
  {
    id: 'jp_n_1',
    language: 'jp',
    tier: 2,
    name: '自然・天気',
    description: '自然と天気語彙 — 太陽、雨、山、森、季節',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['nature'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 動物テーマ (Animals Theme) — source: [[animals-vocabulary]] =====
  {
    id: 'jp_a_1',
    language: 'jp',
    tier: 2,
    name: '動物',
    description: '動物語彙 — ペット、野生动物、昆虫、海の生き物',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['animals'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 衣服/ファッションフォーラム (Clothing Theme) — source: [[clothing-vocabulary]] =====
  {
    id: 'jp_c_1',
    language: 'jp',
    tier: 2,
    name: '衣服・ファッション',
    description: '衣服とファッション語彙 — シャツ、ドレス、靴、素材',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['clothing'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 感情/性格 Tier 3 (Emotion Theme Lv2) =====
  {
    id: 'jp_e_2',
    language: 'jp',
    tier: 3,
    name: '感情・性格 Advanced',
    description: '上級感情表現 — 羨ましい、緊張する、心配する',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['emotion'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 食物 Tier 3 (Food Theme Lv2) =====
  {
    id: 'jp_f_2',
    language: 'jp',
    tier: 3,
    name: '食物 Advanced',
    description: '上級食物語彙 — 食材、調理法、食文化',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['food'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== ビジネス Tier 3 (Business Theme Lv2) =====
  {
    id: 'jp_b_2',
    language: 'jp',
    tier: 3,
    name: 'ビジネス Advanced',
    description: '上級ビジネス語彙 — 交渉、戦略、企業',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['business'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 自然 Tier 3 (Nature Theme Lv2) =====
  {
    id: 'jp_n_2',
    language: 'jp',
    tier: 3,
    name: '自然 Advanced',
    description: '上級自然語彙 — 生態系、地理、気候',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['nature'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 動物 Tier 3 (Animals Theme Lv2) =====
  {
    id: 'jp_a_2',
    language: 'jp',
    tier: 3,
    name: '動物 Advanced',
    description: '上級動物語彙 — 野生生物、海洋生物、動物の行動',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['animals'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 衣服 Tier 3 (Clothing Theme Lv2) =====
  {
    id: 'jp_c_2',
    language: 'jp',
    tier: 3,
    name: '衣服 Advanced',
    description: '上級衣服語彙 — デザイナーブランド、ファッション趋势、仕立て',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['clothing'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 感情/性格 Tier 4 (Emotion Theme Lv3) =====
  {
    id: 'jp_e_3',
    language: 'jp',
    tier: 4,
    name: '感情・性格 Expert',
    description: '전문 수준 감정 표현 — 복합 감정, 심리 상태',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['emotion'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 食物 Tier 4 (Food Theme Lv3) =====
  {
    id: 'jp_f_3',
    language: 'jp',
    tier: 4,
    name: '食物 Expert',
    description: '전문 음식 어휘 — ミシュuran、ワイン pairing、高給レシピ',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['food'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== ビジネス Tier 4 (Business Theme Lv3) =====
  {
    id: 'jp_b_3',
    language: 'jp',
    tier: 4,
    name: 'ビジネス Expert',
    description: '전문 비즈니스 어휘 — M&A、IPO、ローカライゼーション',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['business'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 自然 Tier 4 (Nature Theme Lv3) =====
  {
    id: 'jp_n_3',
    language: 'jp',
    tier: 4,
    name: '自然 Expert',
    description: '전문 자연 어휘 — 生物多様性、気候変動、地質学',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['nature'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 動物 Tier 4 (Animals Theme Lv3) =====
  {
    id: 'jp_a_3',
    language: 'jp',
    tier: 4,
    name: '動物 Expert',
    description: '전문 동물 어휘 — 種の保全、生態学、動物学',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['animals'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 衣服 Tier 4 (Clothing Theme Lv3) =====
  {
    id: 'jp_c_3',
    language: 'jp',
    tier: 4,
    name: '衣服 Expert',
    description: '전문 의류 어휘 — Otteutu、素材工学、ファッション歴史',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['clothing'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 感情 Tier 5 (Emotion Theme Lv4) =====
  {
    id: 'jp_e_4',
    language: 'jp',
    tier: 5,
    name: '感情 Master',
    description: 'マスター 수준 감정 표현 — 철학, 문학, 복합 감정',
    difficulty: 5,
    wordCount: 6,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['emotion'] },
    romajiHint: true,
    missions: defaultMissionsForTier(5),
  },

  // ===== 食物 Tier 5 (Food Theme Lv4) =====
  {
    id: 'jp_f_4',
    language: 'jp',
    tier: 5,
    name: '食物 Master',
    description: 'マスター 수준 음식 표현 — 미식가, food critic',
    difficulty: 5,
    wordCount: 6,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['food'] },
    romajiHint: true,
    missions: defaultMissionsForTier(5),
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
  {
    id: 'es_5_2',
    language: 'es',
    tier: 5,
    name: 'Reflexiones de Vida',
    description: '명상·가치관·삶의 통찰 단락',
    difficulty: 5,
    wordCount: 5,
    corpusFilter: { minLevel: 5, maxLevel: 5, categories: ['passage'] },
    accentMode: 'strict',
    missions: defaultMissionsForTier(5),
  },

  // ===== Tier 4 themed stages (Phase 9 — corpus expansion) =====
  {
    id: 'es_m_1',
    language: 'es',
    tier: 4,
    name: 'Motivación y Mentalidad',
    description: '동기부여·마인드셋 표현',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['motivation'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(4),
  },
  {
    id: 'es_co_1',
    language: 'es',
    tier: 4,
    name: 'Instrucciones de Cocina',
    description: '요리·조리법 표현',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['cooking'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(4),
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

  // ===== Comida theme (Food Theme) — source: [[food-vocabulary]] =====
  {
    id: 'es_f_1',
    language: 'es',
    tier: 2,
    name: 'Comida y Bebida',
    description: '基本的食べ物 vocabulary — carne, verduras, frutas',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['food'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(2),
  },

  // ===== Negocios theme (Business Theme) — source: [[business-vocabulary]] =====
  {
    id: 'es_b_1',
    language: 'es',
    tier: 2,
    name: 'Negocios Básico',
    description: '、基本 business vocabulary — correo, reunión, trabajo',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['business'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(2),
  },

  // ===== Emociones y Personalidad (Emotion Theme) — source: [[emotions-personality-vocabulary]] =====
  {
    id: 'es_e_1',
    language: 'es',
    tier: 2,
    name: 'Emociones y Personalidad',
    description: 'Emoción y personalidad — feliz, triste, amable, grosero',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['emotion'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(2),
  },

  // ===== Naturaleza y Clima (Nature Theme) — source: [[nature-vocabulary]] =====
  {
    id: 'es_n_1',
    language: 'es',
    tier: 2,
    name: 'Naturaleza y Clima',
    description: 'Naturaleza y tiempo — sol, lluvia, montaña, bosque, estaciones',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['nature'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(2),
  },

  // ===== Animales (Animals Theme) — source: [[animals-vocabulary]] =====
  {
    id: 'es_a_1',
    language: 'es',
    tier: 2,
    name: 'Animales',
    description: 'Animalés — mascotas, animales salvajes, insectos, criaturas marinas',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['animals'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(2),
  },

  // ===== Ropa y Moda (Clothing Theme) — source: [[clothing-vocabulary]] =====
  {
    id: 'es_c_1',
    language: 'es',
    tier: 2,
    name: 'Ropa y Moda',
    description: 'Ropa y moda — camisa, vestido, zapatos, materiales',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['clothing'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(2),
  },

  // ===== Emociones Tier 3 (Emotion Theme Lv2) =====
  {
    id: 'es_e_2',
    language: 'es',
    tier: 3,
    name: 'Emociones Advanced',
    description: 'Emoción avanzada — envidiar, agradecer, aletear, celoso',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['emotion'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(3),
  },

  // ===== Comida Tier 3 (Food Theme Lv2) =====
  {
    id: 'es_f_2',
    language: 'es',
    tier: 3,
    name: 'Comida Advanced',
    description: 'Comida avanzada — ingredientes, métodos de cocción, dining',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['food'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(3),
  },

  // ===== Negocios Tier 3 (Business Theme Lv2) =====
  {
    id: 'es_b_2',
    language: 'es',
    tier: 3,
    name: 'Negocios Advanced',
    description: 'Negocio avanzado — negociación, estrategia, corporativa',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['business'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(3),
  },

  // ===== Naturaleza Tier 3 (Nature Theme Lv2) =====
  {
    id: 'es_n_2',
    language: 'es',
    tier: 3,
    name: 'Naturaleza Advanced',
    description: 'Naturaleza avanzada — ecosistema, geografía, clima',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['nature'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(3),
  },

  // ===== Animales Tier 3 (Animals Theme Lv2) =====
  {
    id: 'es_a_2',
    language: 'es',
    tier: 3,
    name: 'Animales Advanced',
    description: 'Animales avanzados — fauna salvaje, vida marina, comportamiento',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['animals'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(3),
  },

  // ===== Ropa Tier 3 (Clothing Theme Lv2) =====
  {
    id: 'es_c_2',
    language: 'es',
    tier: 3,
    name: 'Ropa Advanced',
    description: 'Ropa avanzada — marcas de diseñador, tendencias, sastrería',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['clothing'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(3),
  },

  // ===== Emociones Tier 4 (Emotion Theme Lv3) =====
  {
    id: 'es_e_3',
    language: 'es',
    tier: 4,
    name: 'Emociones Expert',
    description: 'experto 감정 표현 — 복합 감정, 심리 상태',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['emotion'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(4),
  },

  // ===== Comida Tier 4 (Food Theme Lv3) =====
  {
    id: 'es_f_3',
    language: 'es',
    tier: 4,
    name: 'Comida Expert',
    description: 'experto 음식 어휘 — 미슐랭, 와인 pairing, 고급 레시피',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['food'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(4),
  },

  // ===== Negocios Tier 4 (Business Theme Lv3) =====
  {
    id: 'es_b_3',
    language: 'es',
    tier: 4,
    name: 'Negocios Expert',
    description: 'experto 비즈니스 어휘 — 인수합병, IPO, 현지화',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['business'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(4),
  },

  // ===== Naturaleza Tier 4 (Nature Theme Lv3) =====
  {
    id: 'es_n_3',
    language: 'es',
    tier: 4,
    name: 'Naturaleza Expert',
    description: 'experto 자연 어휘 — 생물다양성, 기후변화, 지질학',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['nature'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(4),
  },

  // ===== Animales Tier 4 (Animals Theme Lv3) =====
  {
    id: 'es_a_3',
    language: 'es',
    tier: 4,
    name: 'Animales Expert',
    description: 'experto 동물 어휘 — 종 보전, 생태학, 동물학',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['animals'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(4),
  },

  // ===== Ropa Tier 4 (Clothing Theme Lv3) =====
  {
    id: 'es_c_3',
    language: 'es',
    tier: 4,
    name: 'Ropa Expert',
    description: 'experto 의류 어휘 — Otteutu, 소재 공학, 패션 역사',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['clothing'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(4),
  },

  // ===== Emociones Tier 5 (Emotion Theme Lv4) =====
  {
    id: 'es_e_4',
    language: 'es',
    tier: 5,
    name: 'Emociones Master',
    description: 'master 수준 감정 표현 — 철학, 문학, 복합 감정',
    difficulty: 5,
    wordCount: 6,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['emotion'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(5),
  },

  // ===== Comida Tier 5 (Food Theme Lv4) =====
  {
    id: 'es_f_4',
    language: 'es',
    tier: 5,
    name: 'Comida Master',
    description: 'master 수준 음식 표현 — 미식가, food critic',
    difficulty: 5,
    wordCount: 6,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['food'] },
    accentMode: 'loose',
    missions: defaultMissionsForTier(5),
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
  {
    id: 'kr_5_2',
    language: 'kr',
    tier: 5,
    name: '삶의 통찰',
    description: '명상·가치관·삶의 통찰 단락',
    difficulty: 5,
    wordCount: 5,
    corpusFilter: { minLevel: 5, maxLevel: 5, categories: ['passage'] },
    romajiHint: true,
    missions: defaultMissionsForTier(5),
  },

  // ===== Tier 4 themed stages (Phase 9 — corpus expansion) =====
  {
    id: 'kr_m_1',
    language: 'kr',
    tier: 4,
    name: '동기부여·마인드셋',
    description: '동기부여·마인드셋 표현',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['motivation'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },
  {
    id: 'kr_co_1',
    language: 'kr',
    tier: 4,
    name: '요리·조리법',
    description: '요리·조리법 표현',
    difficulty: 4,
    wordCount: 6,
    corpusFilter: { minLevel: 4, maxLevel: 4, categories: ['cooking'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
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

  // ===== 음식/요리 테마 (Food Theme) — source: [[food-vocabulary]] =====
  {
    id: 'kr_f_1',
    language: 'kr',
    tier: 2,
    name: '한국 음식',
    description: '기본 음식 어휘 — 고기, 야채, 과일, 한국 음식',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['food'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 비즈니스 테마 (Business Theme) — source: [[business-vocabulary]] =====
  {
    id: 'kr_b_1',
    language: 'kr',
    tier: 2,
    name: '비즈니스 기본',
    description: '비즈니스 기본 어휘 — 이메일, 회의, 직장 표현',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['business'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 감정/성격 테마 (Emotion Theme) — source: [[emotions-personality-vocabulary]] =====
  {
    id: 'kr_e_1',
    language: 'kr',
    tier: 2,
    name: '감정·성격',
    description: '감정과 성격 표현 — 기쁨, 슬픔, 성격 묘사',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['emotion'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 자연/날씨 테마 (Nature Theme) — source: [[nature-vocabulary]] =====
  {
    id: 'kr_n_1',
    language: 'kr',
    tier: 2,
    name: '자연·날씨',
    description: '자연과 날씨 어휘 — 태양, 비, 산, 숲, 계절',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['nature'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 동물 테마 (Animals Theme) — source: [[animals-vocabulary]] =====
  {
    id: 'kr_a_1',
    language: 'kr',
    tier: 2,
    name: '동물',
    description: '동물 어휘 — 반려동물, 야생동물, 곤충, 해양 생물',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['animals'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 의류/패션 테마 (Clothing Theme) — source: [[clothing-vocabulary]] =====
  {
    id: 'kr_c_1',
    language: 'kr',
    tier: 2,
    name: '의류·패션',
    description: '의류와 패션 어휘 — 셔츠, 드레스, 구두, 소재',
    difficulty: 2,
    wordCount: 12,
    corpusFilter: { minLevel: 1, maxLevel: 2, categories: ['clothing'] },
    romajiHint: true,
    missions: defaultMissionsForTier(2),
  },

  // ===== 감정/성격 Tier 3 (Emotion Theme Lv2) =====
  {
    id: 'kr_e_2',
    language: 'kr',
    tier: 3,
    name: '감정·성격 Advanced',
    description: '고급 감정 표현 — 부럽다, 감사하다, 설레다, 질투하다',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['emotion'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 음식/요리 Tier 3 (Food Theme Lv2) =====
  {
    id: 'kr_f_2',
    language: 'kr',
    tier: 3,
    name: '음식 Advanced',
    description: '고급 음식 어휘 — 재료, 조리법, 식문화',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['food'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 비즈니스 Tier 3 (Business Theme Lv2) =====
  {
    id: 'kr_b_2',
    language: 'kr',
    tier: 3,
    name: '비즈니스 Advanced',
    description: '고급 비즈니스 어휘 — 협상, 전략, 기업',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['business'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 자연/날씨 Tier 3 (Nature Theme Lv2) =====
  {
    id: 'kr_n_2',
    language: 'kr',
    tier: 3,
    name: '자연 Advanced',
    description: '고급 자연 어휘 — 생태계, 지리, 기후',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['nature'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 동물 Tier 3 (Animals Theme Lv2) =====
  {
    id: 'kr_a_2',
    language: 'kr',
    tier: 3,
    name: '동물 Advanced',
    description: '고급 동물 어휘 — 야생동물, 해양생물, 동물 행동',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['animals'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 의류/패션 Tier 3 (Clothing Theme Lv2) =====
  {
    id: 'kr_c_2',
    language: 'kr',
    tier: 3,
    name: '의류 Advanced',
    description: '고급 의류 어휘 — 디자이너 브랜드, 패션 트렌드, 재단',
    difficulty: 3,
    wordCount: 10,
    corpusFilter: { minLevel: 2, maxLevel: 3, categories: ['clothing'] },
    romajiHint: true,
    missions: defaultMissionsForTier(3),
  },

  // ===== 감정/성격 Tier 4 (Emotion Theme Lv3) =====
  {
    id: 'kr_e_3',
    language: 'kr',
    tier: 4,
    name: '감정 Expert',
    description: '전문가 수준 감정 표현 — 복합 감정, 심리 상태',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['emotion'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 음식/요리 Tier 4 (Food Theme Lv3) =====
  {
    id: 'kr_f_3',
    language: 'kr',
    tier: 4,
    name: '음식 Expert',
    description: '전문 음식 어휘 — 미슐랭, 와인 pairing, 고급 레시피',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['food'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 비즈니스 Tier 4 (Business Theme Lv3) =====
  {
    id: 'kr_b_3',
    language: 'kr',
    tier: 4,
    name: '비즈니스 Expert',
    description: '전문 비즈니스 어휘 — 인수합병, IPO, 현지화',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['business'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 자연 Tier 4 (Nature Theme Lv3) =====
  {
    id: 'kr_n_3',
    language: 'kr',
    tier: 4,
    name: '자연 Expert',
    description: '전문 자연 어휘 — 생물다양성, 기후변화, 지질학',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['nature'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 동물 Tier 4 (Animals Theme Lv3) =====
  {
    id: 'kr_a_3',
    language: 'kr',
    tier: 4,
    name: '동물 Expert',
    description: '전문 동물 어휘 — 종 보전, 생태학, 동물학',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['animals'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 의류 Tier 4 (Clothing Theme Lv3) =====
  {
    id: 'kr_c_3',
    language: 'kr',
    tier: 4,
    name: '의류 Expert',
    description: '전문 의류 어휘 — Otteutu, 소재 공학, 패션 역사',
    difficulty: 4,
    wordCount: 8,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['clothing'] },
    romajiHint: true,
    missions: defaultMissionsForTier(4),
  },

  // ===== 감정 Tier 5 (Emotion Theme Lv4) =====
  {
    id: 'kr_e_4',
    language: 'kr',
    tier: 5,
    name: '감정 Master',
    description: '마스터 수준 감정 표현 — 철학, 문학, 복합 감정',
    difficulty: 5,
    wordCount: 6,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['emotion'] },
    romajiHint: true,
    missions: defaultMissionsForTier(5),
  },

  // ===== 음식 Tier 5 (Food Theme Lv4) =====
  {
    id: 'kr_f_4',
    language: 'kr',
    tier: 5,
    name: '음식 Master',
    description: '마스터 수준 음식 표현 — 미식가, food critic',
    difficulty: 5,
    wordCount: 6,
    corpusFilter: { minLevel: 3, maxLevel: 3, categories: ['food'] },
    romajiHint: true,
    missions: defaultMissionsForTier(5),
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
  'proverbs',   // Tier 4: Refranes / ことわざ / 속담 / proverbs
  'quotes',     // Tier 4: Movie quotes / Anime & drama quotes
  'business',   // Tier 4: Business email phrases (JP)
  'passages',   // Tier 5: Literature excerpts
]);

export const SAMPLE_STAGES: StageConfig[] = ALL_STAGE_SPECS
  .filter((s) => !s.requiresCorpus || AVAILABLE_CORPUS.has(s.requiresCorpus))
  .map(({ tier: _tier, requiresCorpus: _ignored, ...stage }) => stage);

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