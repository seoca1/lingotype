/**
 * Game Types - Core Type Definitions
 *
 * 게임 전반에서 사용되는 핵심 타입 정의.
 * 자세한 내용: ../design/GDD.md, ../design/glossary.md
 */

/**
 * Language code (동적으로 확장 가능)
 * 
 * 새로운 언어 추가 시:
 * 1. language/languages/{lang}.ts 파일 생성
 * 2. language/index.ts에서 registerLanguage() 호출
 * 3. 이 타입은 자동으로 확장됨 (런타임 검증)
 */
export type Language = 'en' | 'jp' | 'es' | 'kr' | string;

export const LANGUAGE_LABEL: Record<string, string> = {
  en: 'English',
  jp: '日本語',
  es: 'Español',
  kr: '한국어',
};

export interface Target {
  /** 표시되는 단어/문장 */
  text: string;
  /** 정답 입력 (언어별 다름) */
  acceptedInputs: string[];
  /** 의미 (선택, 표시 안 함) */
  meaning?: string;
  /** 카테고리 */
  category?: string;
  /** 난이도 (1~5) */
  level: number;
}

export interface MatchResult {
  /** 타겟 완성 여부 */
  completed: boolean;
  /** 정확도 (0~100) */
  accuracy: number;
  /** 오타 수 */
  errors: number;
  /** 현재 버퍼 상태 */
  buffer: string;
  /** 다음 힌트 (선택) */
  hint?: string;
}

export interface Enemy {
  id: string;
  target: Target;
  hp: number;
  maxHp: number;
  spawnTime: number;
}

export interface WordEntry {
  id: string;
  display: string;
  /** EN: undefined; JP: romaji; ES: undefined */
  romaji?: string;
  /** KR: 한글 자모 표기 */
  jamo?: string;
  /** Meaning in the language specified by `meaningLang` (legacy single-lang) */
  meaning?: string;
  /** Meaning language code ('en', 'ko', 'ja', 'es') — pairs with `meaning` */
  meaningLang?: 'en' | 'ko' | 'ja' | 'es';
  /** Phase F: Multilingual meanings — preferred over `meaning`. */
  meanings?: Partial<Record<'en' | 'ko' | 'ja' | 'es', string>>;
  level: number;
  category?: string;
  /** ES 한정 */
  accentMode?: 'strict' | 'loose' | 'any';
  /** Wiki source page (e.g. 'food-vocabulary') */
  source?: string;
}

export interface StageConfig {
  id: string;
  language: Language;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  wordCount: number;
  timeLimit?: number;
  corpusFilter: {
    minLevel?: number;
    maxLevel?: number;
    categories?: string[];
  };
  accentMode?: 'strict' | 'loose';
  romajiHint?: boolean;
  missions: MissionConfig[];
  unlockRequirement?: number;
}

export interface MissionConfig {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  params: MissionParams;
}

export type MissionType =
  | 'defeat_count'
  | 'accuracy_threshold'
  | 'wpm_threshold'
  | 'category_focus'
  | 'no_errors'
  | 'combo_chain'
  | 'time_bonus'
  | 'perfect_run';

export interface MissionParams {
  count?: number;
  threshold?: number;
  category?: string;
}

export interface PlayerProgress {
  level: number;
  totalScore: number;
  stats: PlayerStats;
  unlockedStages: string[];
  achievements: string[];
  stageRecords: Record<string, StageRecord>; // 스테이지별 클리어 기록
}

export interface PlayerStats {
  totalEnemiesDefeated: number;
  totalStagesCleared: number;
  totalPlayTimeMs: number;
  bestWpm: Record<Language, number>;
  avgAccuracy: Record<Language, number>;
}

/**
 * 스테이지별 클리어 기록
 */
export interface StageRecord {
  stageId: string;
  cleared: boolean;
  bestScore: number;
  bestWpm: number;
  bestAccuracy: number;
  stars: number; // 0~3 별점
  playCount: number;
  firstClearedAt?: number;
  lastPlayedAt: number;
}

/**
 * 사용자 프로필 (다중 프로필 지원)
 */
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string; // 아바타 이미지 또는 이모지
  createdAt: number;
  lastPlayedAt: number;
  progress: PlayerProgress;
}

// ===== AI / Ollama 관련 타입 =====

export interface OllamaConfig {
  /** Ollama 서버 주소 (기본: http://localhost:11434) */
  host?: string;
  /** 사용할 모델 이름 (예: qwen2.5:9b) */
  model: string;
}

export interface AIPrompt {
  /** 시스템 프롬프트 */
  system?: string;
  /** 사용자 프롬프트 */
  user: string;
  /** 추가 컨텍스트 */
  context?: Record<string, unknown>;
}

export interface AIResponse {
  /** 생성된 텍스트 */
  text: string;
  /** 생성 시간 (ms) */
  generationTime: number;
  /** 토큰 수 */
  tokens?: number;
  /** 에러 여부 */
  error?: string;
}