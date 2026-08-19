/**
 * LessonProgress - Tracks which daily lesson pages have been viewed/learned
 *
 * localStorage key: 'lingotype-lesson-progress'
 * Shape: Record<lessonId, { viewed: string[], mastered: string[] }>
 */

const STORAGE_KEY = 'lingotype-lesson-progress';

interface LessonProgress {
  viewed: string[];
  mastered: string[];
}

function readStore(): Record<string, LessonProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, LessonProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors
  }
}

export function markPageViewed(lessonId: string, filename: string): void {
  const store = readStore();
  if (!store[lessonId]) store[lessonId] = { viewed: [], mastered: [] };
  if (!store[lessonId].viewed.includes(filename)) {
    store[lessonId].viewed.push(filename);
  }
  writeStore(store);
}

export function isPageViewed(lessonId: string, filename: string): boolean {
  const store = readStore();
  return store[lessonId]?.viewed.includes(filename) ?? false;
}

export function markPageMastered(lessonId: string, filename: string): void {
  const store = readStore();
  if (!store[lessonId]) store[lessonId] = { viewed: [], mastered: [] };
  if (!store[lessonId].mastered.includes(filename)) {
    store[lessonId].mastered.push(filename);
  }
  writeStore(store);
}

export function unmarkPageMastered(lessonId: string, filename: string): void {
  const store = readStore();
  if (!store[lessonId]) return;
  store[lessonId].mastered = store[lessonId].mastered.filter((f) => f !== filename);
  writeStore(store);
}

export function isPageMastered(lessonId: string, filename: string): boolean {
  const store = readStore();
  return store[lessonId]?.mastered.includes(filename) ?? false;
}

export function getLessonProgress(lessonId: string, total = 0): { viewed: number; mastered: number; total: number } {
  const store = readStore();
  const lesson = store[lessonId];
  return {
    viewed: lesson?.viewed.length ?? 0,
    mastered: lesson?.mastered.length ?? 0,
    total,
  };
}
