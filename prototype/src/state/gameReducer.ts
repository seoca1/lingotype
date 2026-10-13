/**
 * Game State (useReducer)
 *
 * ADR-0005 (Draft): React state (useReducer) + Context.
 * 자세한 내용: ../../../decisions/0005-state-management.md
 */

import type {
  Enemy,
  MatchResult,
  MissionConfig,
  PlayerProgress,
  StageConfig,
} from '../types.js';

export type GamePhase = 'menu' | 'charselect' | 'stage' | 'result' | 'chartest';

export interface GameState {
  phase: GamePhase;
  currentStage: StageConfig | null;
  currentEnemy: Enemy | null;
  buffer: string;
  score: number;
  combo: number;
  comboMax: number;
  wpm: number;
  accuracy: number;
  startTime: number;
  clearedAt?: number;
  enemiesDefeated: number;
  totalErrors: number;
  player: PlayerProgress;
  missions: MissionConfig[];
  missionResults: { missionId: string; cleared: boolean }[];
  romajiHint?: string;
  lastHitCorrect: boolean;
  lastHitCharIndex: number;
  lastHitTime: number;
}

export type GameAction =
  | { type: 'START_STAGE'; stage: StageConfig; enemy: Enemy }
  | { type: 'SET_ENEMY'; enemy: Enemy }
  | { type: 'KEY_INPUT'; result: MatchResult; romajiHint?: string }
  | { type: 'ENEMY_DEFEATED'; nextEnemy: Enemy | null; scoreDelta: number; cleared: boolean }
  | { type: 'END_STAGE'; missions: MissionConfig[]; results: { missionId: string; cleared: boolean }[] }
  | { type: 'BACK_TO_MENU' }
  | { type: 'START_CHARTEST' }
  | { type: 'SHOW_CHARACTER_SELECT'; language: string }
  | { type: 'SELECT_CHARACTER'; characterId: string }
  | { type: 'UPDATE_STATS'; accuracy: number; wpm: number }
  | { type: 'UPDATE_STAGE_RECORD'; stageId: string; score: number; wpm: number; accuracy: number };

export const initialState: GameState = {
  phase: 'menu',
  currentStage: null,
  currentEnemy: null,
  buffer: '',
  score: 0,
  combo: 0,
  comboMax: 0,
  wpm: 0,
  accuracy: 100,
  startTime: 0,
  enemiesDefeated: 0,
  totalErrors: 0,
  player: {
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
      'en_easy_1',
      'en_easy_2',
      'jp_easy_1',
      'jp_easy_2',
      'es_easy_1',
      'es_easy_2',
    ],
    achievements: [],
    stageRecords: {},
  },
  missions: [],
  missionResults: [],
  lastHitCorrect: false,
  lastHitCharIndex: -1,
  lastHitTime: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_STAGE':
      console.log('[GameReducer] START_STAGE: Starting new stage');
      console.log('[GameReducer] Stage:', action.stage.id, action.stage.language);
      console.log('[GameReducer] Enemy:', action.enemy.target.text);
      return {
        ...state,
        phase: 'stage',
        currentStage: action.stage,
        currentEnemy: action.enemy,
        buffer: '',
        score: 0,
        combo: 0,
        comboMax: 0,
        wpm: 0,
        accuracy: 100,
        startTime: Date.now(),
        enemiesDefeated: 0,
        totalErrors: 0,
        missions: action.stage.missions,
        missionResults: [],
      };

    case 'SET_ENEMY':
      return { ...state, currentEnemy: action.enemy, buffer: '' };

    case 'KEY_INPUT': {
      const newCombo = action.result.completed ? state.combo + 1 : 0;
      const target = state.currentEnemy?.target.text ?? '';
      const idx = Math.max(0, action.result.buffer.length - 1);
      const correctChar = target[idx];
      const typedChar = action.result.buffer[idx];
      const isCorrect = correctChar !== undefined && typedChar === correctChar;
      return {
        ...state,
        buffer: action.result.buffer,
        accuracy: action.result.accuracy,
        combo: newCombo,
        comboMax: Math.max(state.comboMax, newCombo),
        totalErrors: state.totalErrors + action.result.errors,
        romajiHint: action.romajiHint,
        lastHitCorrect: isCorrect,
        lastHitCharIndex: idx,
        lastHitTime: Date.now(),
      };
    }

    case 'ENEMY_DEFEATED':
      return {
        ...state,
        currentEnemy: action.nextEnemy,
        buffer: '',
        score: state.score + action.scoreDelta,
        enemiesDefeated: state.enemiesDefeated + 1,
        clearedAt: action.cleared ? Date.now() : state.clearedAt,
        combo: 0,
        romajiHint: undefined,
      };

    case 'END_STAGE':
      return {
        ...state,
        phase: 'result',
        missions: action.missions,
        missionResults: action.results,
        player: {
          ...state.player,
          totalScore: state.player.totalScore + state.score,
          stats: {
            ...state.player.stats,
            totalEnemiesDefeated:
              state.player.stats.totalEnemiesDefeated + state.enemiesDefeated,
            totalStagesCleared: state.clearedAt
              ? state.player.stats.totalStagesCleared + 1
              : state.player.stats.totalStagesCleared,
            totalPlayTimeMs:
              state.player.stats.totalPlayTimeMs +
              (state.clearedAt ? state.clearedAt - state.startTime : 0),
          },
        },
      };

    case 'BACK_TO_MENU': {
      console.log('[GameReducer] BACK_TO_MENU: Resetting game state');
      console.log('[GameReducer] Current phase:', state.phase);
      console.log('[GameReducer] Preserving player data:', state.player);
      const resetState = { ...initialState, player: state.player };
      console.log('[GameReducer] New phase:', resetState.phase);
      return resetState;
    }

    case 'UPDATE_STATS':
      return { ...state, accuracy: action.accuracy, wpm: action.wpm };

    case 'UPDATE_STAGE_RECORD': {
      // stageRecords가 없는 경우 초기화 (하위 호환성)
      const stageRecords = state.player.stageRecords || {};
      const existing = stageRecords[action.stageId];
      const isNewBest = !existing || action.score > existing.bestScore;
      
      // Calculate stars based on accuracy and WPM
      let stars = 0;
      if (action.accuracy >= 95 && action.wpm >= 60) stars = 3;
      else if (action.accuracy >= 90 && action.wpm >= 40) stars = 2;
      else if (action.accuracy >= 80 && action.wpm >= 20) stars = 1;
      
      const newRecord = {
        stageId: action.stageId,
        cleared: true,
        stars,
        bestScore: isNewBest ? action.score : existing.bestScore,
        bestWpm: Math.max(action.wpm, existing?.bestWpm || 0),
        bestAccuracy: Math.max(action.accuracy, existing?.bestAccuracy || 0),
        playCount: (existing?.playCount || 0) + 1,
        firstClearedAt: existing?.firstClearedAt || Date.now(),
        lastPlayedAt: Date.now(),
      };
      
      return {
        ...state,
        player: {
          ...state.player,
          stageRecords: {
            ...stageRecords,
            [action.stageId]: newRecord,
          },
        },
      };
    }

    case 'START_CHARTEST': {
      return {
        ...state,
        phase: 'chartest',
      };
    }

    case 'SHOW_CHARACTER_SELECT': {
      // Create a temporary stage to hold language info for CharacterSelect
      const tempStage: StageConfig = {
        id: 'charselect-temp',
        name: 'Character Select',
        description: '',
        language: action.language,
        difficulty: 1,
        wordCount: 0,
        corpusFilter: {},
        missions: [],
      };
      return {
        ...state,
        phase: 'charselect',
        currentStage: tempStage,
      };
    }

    case 'SELECT_CHARACTER': {
      // Character selection logic handled by CharacterSelector
      return {
        ...state,
        phase: 'menu',
      };
    }

    default:
      return state;
  }
}