/**
 * LocalStorage Persistence
 * 
 * 플레이어 진행도를 브라우저에 저장
 */

import type { PlayerProgress } from '../types.js';

const STORAGE_KEY = 'lingotype-progress';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  player: PlayerProgress;
  lastSaved: number;
}

/**
 * 플레이어 진행도 저장
 */
export function saveProgress(player: PlayerProgress): void {
  try {
    const data: StorageData = {
      version: STORAGE_VERSION,
      player,
      lastSaved: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('[Storage] Progress saved:', player);
  } catch (error) {
    console.error('[Storage] Failed to save:', error);
  }
}

/**
 * 플레이어 진행도 로드
 */
export function loadProgress(): PlayerProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      console.log('[Storage] No saved progress found');
      return null;
    }

    const data: StorageData = JSON.parse(raw);
    
    // 버전 체크
    if (data.version !== STORAGE_VERSION) {
      console.warn('[Storage] Version mismatch, ignoring saved data');
      return null;
    }

    // stageRecords가 없는 경우 초기화 (하위 호환성)
    if (!data.player.stageRecords) {
      console.warn('[Storage] Missing stageRecords, initializing...');
      data.player.stageRecords = {};
    }

    console.log('[Storage] Progress loaded:', data.player);
    return data.player;
  } catch (error) {
    console.error('[Storage] Failed to load:', error);
    return null;
  }
}

/**
 * 저장된 데이터 삭제
 */
export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[Storage] Progress cleared');
  } catch (error) {
    console.error('[Storage] Failed to clear:', error);
  }
}

/**
 * 마지막 저장 시간
 */
export function getLastSavedTime(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    
    const data: StorageData = JSON.parse(raw);
    return data.lastSaved;
  } catch {
    return null;
  }
}
