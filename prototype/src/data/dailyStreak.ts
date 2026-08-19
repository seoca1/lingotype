/**
 * Daily Streak Module
 *
 * Tracks consecutive days of play. Encourages daily engagement.
 *
 * Behavior:
 * - First play: streak = 1
 * - Same day: streak unchanged
 * - Next day: streak + 1
 * - Skipped day: streak resets to 1
 *
 * Streak milestones:
 * - 3, 7, 14, 30, 50, 100, 365 days → celebrate
 *
 * Storage: localStorage with date strings (YYYY-MM-DD format)
 */

const STORAGE_KEY = 'lingotype-daily-streak';

/** In-memory fallback */
let memoryState: DailyStreakState | null = null;

export interface DailyStreakState {
  /** Current consecutive day count */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** Last play date in YYYY-MM-DD format */
  lastPlayedDate: string;
  /** Total days played (lifetime) */
  totalDaysPlayed: number;
  /** Last milestone celebrated (to avoid showing same one twice) */
  lastMilestone: number;
}

/** Streak milestones and their celebration text */
export const STREAK_MILESTONES: Record<number, { icon: string; label: string }> = {
  3: { icon: '🌱', label: '3-day streak!' },
  7: { icon: '🔥', label: '1-week streak!' },
  14: { icon: '⚡', label: '2-week streak!' },
  30: { icon: '🏆', label: '1-month streak!' },
  50: { icon: '👑', label: '50-day streak!' },
  100: { icon: '💯', label: '100-day streak!' },
  365: { icon: '🎉', label: '1-year streak!' },
};

function getTodayDate(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getYesterdayDate(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function hasWorkingLocalStorage(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const testKey = '__streak_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function loadState(): DailyStreakState {
  if (hasWorkingLocalStorage()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as DailyStreakState;
    } catch {
      // Fall through
    }
  }
  if (memoryState) return memoryState;

  return {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: '',
    totalDaysPlayed: 0,
    lastMilestone: 0,
  };
}

function saveState(state: DailyStreakState): void {
  if (hasWorkingLocalStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return;
    } catch {
      // Fall through to memory
    }
  }
  memoryState = state;
}

export interface RecordResult {
  /** Updated state after recording today's play */
  state: DailyStreakState;
  /** Did the streak change? (true if new day) */
  streakChanged: boolean;
  /** Did we hit a new milestone? (and which one) */
  newMilestone?: { days: number; icon: string; label: string };
}

/**
 * Record a play for today. Returns updated state and any changes.
 *
 * - First play: streak=1, totalDays=1, milestone=1
 * - Same day: no change
 * - Next day: streak+=1, totalDays+=1
 * - Skipped day: streak=1 (reset), totalDays+=1
 *
 * @param fakeToday - Optional override for today's date (testing only)
 */
export function recordPlay(fakeToday?: string): RecordResult {
  const today = fakeToday ?? getTodayDate();
  const yesterday = fakeToday
    ? (() => {
        const d = new Date(fakeToday);
        d.setDate(d.getDate() - 1);
        return d.toISOString().slice(0, 10);
      })()
    : getYesterdayDate();

  const state = loadState();
  let streakChanged = false;

  if (state.lastPlayedDate === today) {
    // Already played today — no change
    return { state, streakChanged: false };
  }

  if (state.lastPlayedDate === yesterday) {
    // Continuing streak
    state.currentStreak += 1;
    streakChanged = true;
  } else {
    // Either first play or streak broken
    state.currentStreak = 1;
    streakChanged = true;
  }

  state.lastPlayedDate = today;
  state.totalDaysPlayed += 1;

  if (state.currentStreak > state.longestStreak) {
    state.longestStreak = state.currentStreak;
  }

  // Check milestone
  let newMilestone: RecordResult['newMilestone'];
  if (
    STREAK_MILESTONES[state.currentStreak] &&
    state.lastMilestone < state.currentStreak
  ) {
    newMilestone = {
      days: state.currentStreak,
      ...STREAK_MILESTONES[state.currentStreak],
    };
    state.lastMilestone = state.currentStreak;
  }

  saveState(state);
  return { state, streakChanged, newMilestone };
}

/**
 * Get current streak state without modifying.
 */
export function getStreakState(): DailyStreakState {
  return loadState();
}

/**
 * Reset streak (for testing or user request).
 */
export function resetStreak(): void {
  const fresh: DailyStreakState = {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: '',
    totalDaysPlayed: 0,
    lastMilestone: 0,
  };
  saveState(fresh);
}

/**
 * Get streak info for display (e.g., "🔥 5-day streak").
 */
export function getStreakDisplay(): {
  text: string;
  icon: string;
  status: 'new' | 'continue' | 'broken' | 'none';
  count: number;
} {
  const state = loadState();
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  if (state.lastPlayedDate === today) {
    return {
      text: `${state.currentStreak}-day streak`,
      icon: state.currentStreak >= 7 ? '🔥' : '📅',
      status: 'continue',
      count: state.currentStreak,
    };
  }
  if (state.lastPlayedDate === yesterday) {
    return {
      text: `${state.currentStreak}-day streak (play today!)`,
      icon: '⏰',
      status: 'new',
      count: state.currentStreak,
    };
  }
  if (state.currentStreak > 0) {
    return {
      text: `${state.currentStreak}-day streak (broken)`,
      icon: '💔',
      status: 'broken',
      count: state.currentStreak,
    };
  }
  return {
    text: 'No streak yet',
    icon: '🌱',
    status: 'none',
    count: 0,
  };
}