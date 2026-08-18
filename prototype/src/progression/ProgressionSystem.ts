/**
 * Progression System - 메타 진행
 *
 * 자세한 내용: ../../../design/systems/progression.md
 */

import type { Language, PlayerProgress } from '../types.js';

const INITIAL_PROGRESS: PlayerProgress = {
  level: 1,
  totalScore: 0,
  stats: {
    totalEnemiesDefeated: 0,
    totalStagesCleared: 0,
    totalPlayTimeMs: 0,
    bestWpm: { en: 0, jp: 0, es: 0, kr: 0 },
    avgAccuracy: { en: 0, jp: 0, es: 0, kr: 0 },
  },
  unlockedStages: [
    'en_1_1',
    'jp_0_1',
    'jp_0_2',
    'jp_1_1',
    'es_1_1',
    'kr_1_1',
  ],
  achievements: [],
  stageRecords: {},
  languagesPlayed: [],
};

export function createInitialProgress(): PlayerProgress {
  return JSON.parse(JSON.stringify(INITIAL_PROGRESS));
}

export function levelFromScore(totalScore: number): number {
  return Math.floor(totalScore / 1000) + 1;
}

export function addScore(progress: PlayerProgress, score: number): void {
  progress.totalScore += score;
  progress.level = levelFromScore(progress.totalScore);
}

export function recordStageClear(
  progress: PlayerProgress,
  language: Language,
  score: number,
  wpm: number,
  accuracy: number,
  enemiesDefeated: number,
  playTimeMs: number,
): void {
  addScore(progress, score);
  progress.stats.totalEnemiesDefeated += enemiesDefeated;
  progress.stats.totalStagesCleared += 1;
  progress.stats.totalPlayTimeMs += playTimeMs;

  if (wpm > progress.stats.bestWpm[language]) {
    progress.stats.bestWpm[language] = wpm;
  }

  const currentAvg = progress.stats.avgAccuracy[language];
  const newAvg = currentAvg === 0 ? accuracy : (currentAvg + accuracy) / 2;
  progress.stats.avgAccuracy[language] = newAvg;
}

export function unlockStage(progress: PlayerProgress, stageId: string): boolean {
  if (progress.unlockedStages.includes(stageId)) return false;
  progress.unlockedStages.push(stageId);
  return true;
}

export function isStageUnlocked(progress: PlayerProgress, stageId: string, requirement?: number): boolean {
  if (progress.unlockedStages.includes(stageId)) return true;
  if (requirement !== undefined && progress.totalScore >= requirement) {
    unlockStage(progress, stageId);
    return true;
  }
  return false;
}