/**
 * Achievement / Badge System
 *
 * Tracks unlocked badges in localStorage. Badges are awarded based on
 * in-game stats (stages cleared, accuracy, streak, etc.).
 *
 * Design:
 * - All badge definitions in BADGES constant (data-driven)
 * - unlocked badges stored as `{ badge_id: timestamp }` map
 * - recentlyEarned list (last 5) for UI celebration
 * - evaluate() returns newly unlocked badges (idempotent)
 *
 * Categories: 'milestone' (stages cleared), 'perfect' (gameplay feats),
 * 'streak' (daily play).
 */

const STORAGE_KEY = 'typing-language-badges';

export interface Badge {
  id: string;
  name: string;
  nameLocalised: Record<string, string>;
  description: string;
  descriptionLocalised: Record<string, string>;
  icon: string;
  category: 'milestone' | 'perfect' | 'streak';
  threshold: number;
}

export interface BadgeState {
  unlocked: Record<string, number>;
  recentlyEarned: string[];
}

export interface BadgeEvalContext {
  stagesCleared: number;
  perfectClears: number;
  totalAccuracy: number;
  currentStreak: number;
  languagesPlayed: number;
  hasTriedAllLanguages: boolean;
  tiersCleared: number;
}

const LOCALE_DEFAULT = 'en';

function localiseName(badge: Badge, lang: string): string {
  return badge.nameLocalised[lang] || badge.nameLocalised[LOCALE_DEFAULT] || badge.name;
}

export const BADGES: Badge[] = [
  {
    id: 'first_run',
    name: 'First Run',
    nameLocalised: { en: 'First Run', ko: '첫 실행', ja: '初めてのラン', es: 'Primera Carrera' },
    descriptionLocalised: {'en': "Complete your first stage.", 'ko': "첫 스테이지를 완료하세요.", 'ja': "最初のステージを完了する。", 'es': "Completa tu primera etapa."},
    description: 'Complete your first stage.',
    icon: '🌱',
    category: 'milestone',
    threshold: 1,
  },
  {
    id: 'stages_10',
    name: 'Stage Hunter',
    nameLocalised: { en: 'Stage Hunter', ko: '스테이지 헌터', ja: 'ステージハンター', es: 'Cazador de Etapas' },
    descriptionLocalised: {'en': "Clear 10 stages.", 'ko': "스테이지 10개를 클리어하세요.", 'ja': "ステージを10個クリアする。", 'es': "Completa 10 etapas."},
    description: 'Clear 10 stages.',
    icon: '🥉',
    category: 'milestone',
    threshold: 10,
  },
  {
    id: 'stages_50',
    name: 'Stage Master',
    nameLocalised: { en: 'Stage Master', ko: '스테이지 마스터', ja: 'ステージマスター', es: 'Maestro de Etapas' },
    descriptionLocalised: {'en': "Clear 50 stages.", 'ko': "스테이지 50개를 클리어하세요.", 'ja': "ステージを50個クリアする。", 'es': "Completa 50 etapas."},
    description: 'Clear 50 stages.',
    icon: '🥈',
    category: 'milestone',
    threshold: 50,
  },
  {
    id: 'stages_100',
    name: 'Stage Champion',
    nameLocalised: { en: 'Stage Champion', ko: '스테이지 챔피언', ja: 'ステージチャンピオン', es: 'Campeón de Etapas' },
    descriptionLocalised: {'en': "Clear 100 stages across all languages.", 'ko': "모든 언어에서 100개 스테이지를 클리어하세요.", 'ja': "全言語で100ステージをクリアする。", 'es': "Completa 100 etapas en todos los idiomas."},
    description: 'Clear 100 stages across all languages.',
    icon: '🥇',
    category: 'milestone',
    threshold: 100,
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    nameLocalised: { en: 'Perfectionist', ko: '완벽주의자', ja: '完璧主義者', es: 'Perfeccionista' },
    descriptionLocalised: {'en': "Clear a stage with 100% accuracy.", 'ko': "100% 정확도로 스테이지를 클리어하세요.", 'ja': "ステージを100%正確でクリアする。", 'es': "Completa una etapa con 100% de precisión."},
    description: 'Clear a stage with 100% accuracy.',
    icon: '💯',
    category: 'perfect',
    threshold: 1,
  },
  {
    id: 'perfect_5',
    name: 'Sharp Eye',
    nameLocalised: { en: 'Sharp Eye', ko: '날카로운 눈', ja: '鋭い目', es: 'Ojo Agudo' },
    descriptionLocalised: {'en': "Achieve 100% accuracy on 5 stages.", 'ko': "5개 스테이지를 100% 정확도로 완료하세요.", 'ja': "5つのステージを100%正確で達成する。", 'es': "Logra 100% de precisión en 5 etapas."},
    description: 'Achieve 100% accuracy on 5 stages.',
    icon: '🎯',
    category: 'perfect',
    threshold: 5,
  },
  {
    id: 'streak_3',
    name: 'Getting Started',
    nameLocalised: { en: 'Getting Started', ko: '시작이 반', ja: 'まずまず', es: 'Empezando' },
    descriptionLocalised: {'en': "Maintain a 3-day streak.", 'ko': "3일 연속 플레이를 유지하세요.", 'ja': "3日連続プレイを維持する。", 'es': "Mantén una racha de 3 días."},
    description: 'Maintain a 3-day streak.',
    icon: '🔥',
    category: 'streak',
    threshold: 3,
  },
  {
    id: 'streak_7',
    name: 'Weekly Devotee',
    nameLocalised: { en: 'Weekly Devotee', ko: '주간 헌신', ja: '週の献身', es: 'Devoto Semanal' },
    descriptionLocalised: {'en': "Maintain a 7-day streak.", 'ko': "7일 연속 플레이를 유지하세요.", 'ja': "7日連続プレイを維持する。", 'es': "Mantén una racha de 7 días."},
    description: 'Maintain a 7-day streak.',
    icon: '⭐',
    category: 'streak',
    threshold: 7,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    nameLocalised: { en: 'Monthly Master', ko: '월간 마스터', ja: 'マンスリーマスター', es: 'Maestro Mensual' },
    descriptionLocalised: {'en': "Maintain a 30-day streak.", 'ko': "30일 연속 플레이를 유지하세요.", 'ja': "30日連続プレイを維持する。", 'es': "Mantén una racha de 30 días."},
    description: 'Maintain a 30-day streak.',
    icon: '🌟',
    category: 'streak',
    threshold: 30,
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    nameLocalised: { en: 'Polyglot', ko: '다국어 구사자', ja: 'ポリグロット', es: 'Políglota' },
    descriptionLocalised: {'en': "Try all 4 languages.", 'ko': "4개 언어 모두를 시도하세요.", 'ja': "4言語すべてを試す。", 'es': "Prueba los 4 idiomas."},
    description: 'Try all 4 languages.',
    icon: '🌐',
    category: 'milestone',
    threshold: 1,
  },
  {
    id: 'tier_master',
    name: 'Tier Master',
    nameLocalised: { en: 'Tier Master', ko: '티어 마스터', ja: 'ティアマスター', es: 'Maestro de Niveles' },
    descriptionLocalised: {'en': "Clear at least one stage in every tier (0-5).", 'ko': "모든 티어(0~5)에서 최소 한 단계씩 클리어하세요.", 'ja': "全ティア(0〜5)で少なくとも1ステージをクリアする。", 'es': "Completa al menos una etapa en cada nivel (0-5)."},
    description: 'Clear at least one stage in every tier (0-5).',
    icon: '🏔️',
    category: 'milestone',
    threshold: 6,
  },
  {
    id: 'streak_100',
    name: 'Centurion',
    nameLocalised: { en: 'Centurion', ko: '100일의 전사', ja: 'センチュリオン', es: 'Centurión' },
    descriptionLocalised: {'en': "Maintain a 100-day streak.", 'ko': "100일 연속 플레이를 유지하세요.", 'ja': "100日連続プレイを維持する。", 'es': "Mantén una racha de 100 días."},
    description: 'Maintain a 100-day streak.',
    icon: '💯',
    category: 'streak',
    threshold: 100,
  },
];

function emptyState(): BadgeState {
  return { unlocked: {}, recentlyEarned: [] };
}

function hasWorkingLocalStorage(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const key = '__badge_test__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function loadState(): BadgeState {
  if (!hasWorkingLocalStorage()) return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<BadgeState>;
    if (!parsed || typeof parsed !== 'object') return emptyState();
    return {
      unlocked: (parsed.unlocked && typeof parsed.unlocked === 'object') ? parsed.unlocked : {},
      recentlyEarned: Array.isArray(parsed.recentlyEarned) ? parsed.recentlyEarned.slice(0, 5) : [],
    };
  } catch {
    return emptyState();
  }
}

function saveState(state: BadgeState): void {
  if (!hasWorkingLocalStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[Badges] Failed to save:', e);
  }
}

export function getBadgeState(): BadgeState {
  return loadState();
}

export function _resetBadgeState(): void {
  saveState(emptyState());
}

export function getUnlockedBadges(): Badge[] {
  const state = loadState();
  return BADGES.filter((b) => b.id in state.unlocked);
}

export function getRecentlyEarnedBadges(): Badge[] {
  const state = loadState();
  return state.recentlyEarned
    .map((id) => BADGES.find((b) => b.id === id))
    .filter((b): b is Badge => b !== undefined);
}

function evaluateMilestoneBadges(ctx: BadgeEvalContext): Badge[] {
  const out: Badge[] = [];
  for (const badge of BADGES) {
    if (badge.category === 'milestone' && badge.id === 'stages_10' && ctx.stagesCleared >= 10) {
      out.push(badge);
    } else if (badge.category === 'milestone' && badge.id === 'stages_50' && ctx.stagesCleared >= 50) {
      out.push(badge);
    } else if (badge.category === 'milestone' && badge.id === 'stages_100' && ctx.stagesCleared >= 100) {
      out.push(badge);
    } else if (badge.category === 'milestone' && badge.id === 'first_run' && ctx.stagesCleared >= 1) {
      out.push(badge);
    } else if (badge.category === 'milestone' && badge.id === 'polyglot' && ctx.hasTriedAllLanguages) {
      out.push(badge);
    } else if (badge.category === 'milestone' && badge.id === 'tier_master' && ctx.tiersCleared >= 6) {
      out.push(badge);
    }
  }
  return out;
}

function evaluatePerfectBadges(ctx: BadgeEvalContext): Badge[] {
  const out: Badge[] = [];
  for (const badge of BADGES) {
    if (badge.category !== 'perfect') continue;
    if (badge.id === 'perfect_score' && ctx.perfectClears >= 1) {
      out.push(badge);
    } else if (badge.id === 'perfect_5' && ctx.perfectClears >= 5) {
      out.push(badge);
    }
  }
  return out;
}

function evaluateStreakBadges(ctx: BadgeEvalContext): Badge[] {
  const out: Badge[] = [];
  for (const badge of BADGES) {
    if (badge.category !== 'streak') continue;
    if (ctx.currentStreak >= badge.threshold) {
      out.push(badge);
    }
  }
  return out;
}

export function evaluateBadges(ctx: BadgeEvalContext): Badge[] {
  const state = loadState();
  const candidates = [
    ...evaluateMilestoneBadges(ctx),
    ...evaluatePerfectBadges(ctx),
    ...evaluateStreakBadges(ctx),
  ];
  const newlyUnlocked: Badge[] = [];
  for (const badge of candidates) {
    if (!(badge.id in state.unlocked)) {
      state.unlocked[badge.id] = Date.now();
      newlyUnlocked.push(badge);
    }
  }
  if (newlyUnlocked.length > 0) {
    state.recentlyEarned = [
      ...newlyUnlocked.map((b: Badge) => b.id),
      ...state.recentlyEarned,
    ].slice(0, 5);
    saveState(state);
  }
  return newlyUnlocked;
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

export function getBadgeProgress(badge: Badge, ctx: BadgeEvalContext): number {
  if (badge.id === 'first_run') return Math.min(1, ctx.stagesCleared);
  if (badge.category === 'milestone' && badge.id === 'polyglot') return ctx.hasTriedAllLanguages ? 1 : 0;
  if (badge.category === 'milestone' && badge.id === 'tier_master') {
    return Math.min(ctx.tiersCleared, badge.threshold);
  }
  if (badge.category === 'milestone' && badge.id.startsWith('stages_')) {
    return Math.min(ctx.stagesCleared, badge.threshold);
  }
  if (badge.category === 'perfect') {
    return Math.min(ctx.perfectClears, badge.threshold);
  }
  if (badge.category === 'streak') {
    return Math.min(ctx.currentStreak, badge.threshold);
  }
  return 0;
}

export function getBadgeDisplayName(badge: Badge, lang: string): string {
  return localiseName(badge, lang);
}

export function getBadgeDisplayDescription(badge: Badge, lang: string): string {
  return badge.descriptionLocalised[lang] || badge.descriptionLocalised[LOCALE_DEFAULT] || badge.description;
}

export function getMilestoneCount(): number {
  return BADGES.filter((b) => b.category === 'milestone').length;
}

export function getPerfectCount(): number {
  return BADGES.filter((b) => b.category === 'perfect').length;
}

export function getStreakCount(): number {
  return BADGES.filter((b) => b.category === 'streak').length;
}

export function getTotalBadgeCount(): number {
  return BADGES.length;
}
