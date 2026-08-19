/**
 * Daily Lessons - 일일 학습 데이터 + rotation 로직
 *
 * 빌드 시 `scripts/build-daily-lessons.py`가 생성한 JSON을 import하고,
 * 유저별 학습 이력 (localStorage) 기반으로 rotation 알고리즘을 제공합니다.
 *
 * 데이터 흐름:
 *   Language/ (raw + wiki) → build-daily-lessons.py → dailyLessons.json
 *   dailyLessons.json (import) + lessonHistory (localStorage) → getNextDailyLesson()
 *
 * localStorage key: 'lingotype-seen-lessons'
 *   - value: string[] (lesson ID 목록, max 100개, FIFO)
 */

import rawData from './dailyLessons.json';
import type { Language } from '../types.js';

// ============================================================================
// Types
// ============================================================================

export type WikiCategory = 'vocabulary' | 'expression' | 'culture' | 'source';

export interface WikiPage {
  /** 파일명 (e.g., "beautiful.md") */
  filename: string;
  /** H1에서 추출한 제목 */
  title: string;
  /** markdown 본문 (전체) */
  body: string;
  /** 카테고리 */
  category: WikiCategory;
  /** Phase A: tier (0-3) */
  tier?: number;
  /** Phase A: friendly field flags */
  hasPronunciation?: boolean;
  hasMemoryTip?: boolean;
  hasCommonMistakes?: boolean;
  hasDialogue?: boolean;
}

/**
 * Internal storage format (v1.1+) — wiki pages stored once, lessons
 * reference them by filename. This dramatically reduces file size when
 * the same page appears in multiple lessons.
 */
export interface DailyLessonCompact {
  id: string;
  date: string;
  language: 'en' | 'jp' | 'es' | 'kr';
  sourceTopic: string;
  difficulty: {
    tier: number;
    cefr: string;
    primaryStage: string;
  };
  source: {
    rawFile: string;
  };
  raw: {
    sourceFile: string;
    excerpt: string;
  };
  /** Filenames only — look up body in DailyLessonsData.wikiIndex */
  vocabulary: string[];
  expressions: string[];
  culture: string | null;
  meta: {
    estimatedReadMinutes: number;
    relatedStages: string[];
    /** Phase A: tier distribution */
    vocabTiers?: { tier1: number; tier2: number; tier3: number };
    hasDialogue?: boolean;
    wikilinkCount?: number;
  };
}

export interface DailyLessonsDataCompact {
  generatedAt: string;
  schemaVersion: string;
  lessonCount: number;
  byLanguage: Record<string, number>;
  /** Phase D: deduplicated wiki pages */
  wikiIndex: Record<string, Omit<WikiPage, 'filename'>>;
  lessons: DailyLessonCompact[];
}

/** Public type — consumers see this fully-joined view */
export interface DailyLesson {
  id: string;
  date: string;
  language: 'en' | 'jp' | 'es' | 'kr';
  sourceTopic: string;
  difficulty: {
    tier: number;
    cefr: string;
    primaryStage: string;
  };
  source: {
    rawFile: string;
  };
  raw: {
    sourceFile: string;
    excerpt: string;
  };
  wiki: {
    vocabulary: WikiPage[];
    expressions: WikiPage[];
    culture: WikiPage | null;
  };
  meta: {
    estimatedReadMinutes: number;
    relatedStages: string[];
    vocabTiers?: { tier1: number; tier2: number; tier3: number };
    hasDialogue?: boolean;
    wikilinkCount?: number;
  };
}

// ============================================================================
// Data Access — Phase D: v1.1 with deduplicated wiki index
// ============================================================================

const data = rawData as DailyLessonsDataCompact;

function getPage(filename: string): WikiPage | null {
  const entry = data.wikiIndex?.[filename];
  if (!entry) return null;
  return { filename, ...entry };
}

function expandLesson(compact: DailyLessonCompact): DailyLesson {
  return {
    id: compact.id,
    date: compact.date,
    language: compact.language,
    sourceTopic: compact.sourceTopic,
    difficulty: compact.difficulty,
    source: compact.source,
    raw: compact.raw,
    wiki: {
      vocabulary: compact.vocabulary
        .map(getPage)
        .filter((p): p is WikiPage => p !== null),
      expressions: compact.expressions
        .map(getPage)
        .filter((p): p is WikiPage => p !== null),
      culture: compact.culture ? getPage(compact.culture) : null,
    },
    meta: compact.meta,
  };
}

/**
 * Get the deduplicated wiki page index (for cross-lesson lookups).
 */
export function getWikiIndex(): Record<string, Omit<WikiPage, 'filename'>> {
  return data.wikiIndex;
}

/**
 * 모든 lesson 반환 (joined).
 */
export function getAllLessons(): DailyLesson[] {
  return data.lessons.map(expandLesson);
}

/**
 * 언어별 lesson 필터.
 */
export function getLessonsByLanguage(language: Language): DailyLesson[] {
  return data.lessons.filter((l) => l.language === language).map(expandLesson);
}

/**
 * ID로 lesson 조회.
 */
export function getLessonById(id: string): DailyLesson | null {
  const compact = data.lessons.find((l) => l.id === id);
  return compact ? expandLesson(compact) : null;
}

/**
 * Stage ID로 연관된 lesson 조회 (관련 stage 매칭).
 */
export function getLessonsByStageId(stageId: string): DailyLesson[] {
  return data.lessons
    .filter((l) => l.meta.relatedStages.includes(stageId))
    .map(expandLesson);
}

// ============================================================================
// localStorage Lesson History (with in-memory fallback)
// ============================================================================

const STORAGE_KEY = 'lingotype-seen-lessons';
const MAX_HISTORY = 100;

// In-memory fallback for environments without working localStorage
// (some jsdom configurations, SSR, restricted test envs)
let memoryStorage: string[] | null = null;

function hasWorkingLocalStorage(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const testKey = '__test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * 본 lesson ID 목록을 localStorage에서 읽기.
 * 환경(localStorage 미지원/SSR)에서는 메모리 fallback 사용.
 */
export function getSeenLessons(): string[] {
  if (hasWorkingLocalStorage()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((x): x is string => typeof x === 'string')
        : [];
    } catch {
      return [];
    }
  }
  return memoryStorage ?? [];
}

/**
 * localStorage에 본 lesson ID 추가 (FIFO, max 100).
 */
export function markLessonSeen(id: string): void {
  const current = getSeenLessons();
  if (current.includes(id)) return;
  const updated = [...current, id].slice(-MAX_HISTORY);

  if (hasWorkingLocalStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return;
    } catch {
      // fall through to memory
    }
  }
  // Memory fallback
  memoryStorage = updated;
}

/**
 * 학습 이력 초기화 (디버그/리셋용).
 */
export function clearLessonHistory(): void {
  memoryStorage = null;
  if (hasWorkingLocalStorage()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

// ============================================================================
// Date Hash (deterministic per-day selection)
// ============================================================================

/**
 * 문자열을 32-bit 정수 hash로 변환 (FNV-1a).
 * 같은 input + 같은 day → 같은 output (deterministic).
 */
function fnv1aHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0; // 32-bit unsigned
  }
  return hash;
}

/**
 * 오늘 날짜 (YYYY-MM-DD 형식, 로컬 시간).
 */
function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ============================================================================
// Rotation Algorithm
// ============================================================================

export interface RotationOptions {
  /** 특정 언어 (없으면 currentLanguage 또는 'en') */
  language?: Language;
  /** 이미 본 lesson 제외 여부 (default: true) */
  excludeSeen?: boolean;
  /** 테스트용: 가짜 '오늘' 날짜 */
  fakeToday?: string;
}

/**
 * 다음 일일 lesson 선택.
 *
 * 우선순위:
 * 1. 안 본 lesson 중 오늘 날짜 hash로 deterministic 선택
 * 2. 모든 lesson을 다 봤으면 가장 오래된 것부터 (재방문)
 * 3. 후보가 없으면 null
 *
 * @param options - language, excludeSeen, fakeToday
 * @returns 선택된 lesson 또는 null
 */
export function getNextDailyLesson(options: RotationOptions = {}): DailyLesson | null {
  const language = options.language ?? 'en';
  const excludeSeen = options.excludeSeen ?? true;
  const today = options.fakeToday ?? getTodayString();

  const candidates = getLessonsByLanguage(language);
  if (candidates.length === 0) return null;

  // 1. 안 본 lesson 필터
  let pool = candidates;
  if (excludeSeen) {
    const seen = new Set(getSeenLessons());
    const unseen = candidates.filter((l) => !seen.has(l.id));
    if (unseen.length > 0) {
      pool = unseen;
    }
    // If all seen, fall through to step 2 (revisit oldest)
  }

  // 2-3. deterministic selection by date hash
  // 같은 날에는 같은 lesson 선택 (안 본 후보가 여러 개일 때)
  const hash = fnv1aHash(`${today}:${language}`);
  const idx = hash % pool.length;
  return pool[idx];
}

/**
 * 언어가 여러 개일 때 균형있게 선택.
 * (한 언어만 보이지 않도록 가중치)
 *
 * 최근 본 언어 통계를 보고 가중치 적용.
 */
export interface BalancedSelectionOptions {
  /** 우선순위 언어 (현재 게임 중인 언어) */
  preferredLanguage: Language;
  /** 모든 사용 가능한 언어 */
  allLanguages: Language[];
  /** 테스트용: 가짜 오늘 날짜 */
  fakeToday?: string;
}

export function getBalancedDailyLesson(
  options: BalancedSelectionOptions
): DailyLesson | null {
  const seen = new Set(getSeenLessons());
  const today = options.fakeToday ?? getTodayString();

  // First, try preferred language with unseen
  const preferredUnseen = getLessonsByLanguage(options.preferredLanguage).filter(
    (l) => !seen.has(l.id)
  );
  if (preferredUnseen.length > 0) {
    const hash = fnv1aHash(`${today}:${options.preferredLanguage}`);
    return preferredUnseen[hash % preferredUnseen.length];
  }

  // Try other languages
  const otherLangs = options.allLanguages.filter((l) => l !== options.preferredLanguage);
  for (const lang of otherLangs) {
    const unseen = getLessonsByLanguage(lang).filter((l) => !seen.has(l.id));
    if (unseen.length > 0) {
      const hash = fnv1aHash(`${today}:${lang}`);
      return unseen[hash % unseen.length];
    }
  }

  // All seen — fall back to preferred language
  return getNextDailyLesson({ language: options.preferredLanguage, excludeSeen: false });
}

// ============================================================================
// Metadata
// ============================================================================

export function getDataSummary(): {
  total: number;
  byLanguage: Record<string, number>;
  generatedAt: string;
  wikiPageCount: number;
  /** Phase D: schema version (1.0 = legacy, 1.1 = dedup wiki index) */
  schemaVersion: string;
} {
  return {
    total: data.lessonCount,
    byLanguage: data.byLanguage,
    generatedAt: data.generatedAt,
    wikiPageCount: Object.keys(data.wikiIndex ?? {}).length,
    schemaVersion: data.schemaVersion,
  };
}
