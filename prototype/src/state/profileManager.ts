/**
 * Profile Manager - 다중 프로필 관리
 * 
 * 여러 사용자가 각자의 진행도를 저장/로드
 */

import type { UserProfile, PlayerProgress } from '../types.js';

const PROFILES_KEY = 'lingotype-profiles';
const CURRENT_PROFILE_KEY = 'lingotype-current-profile';
const STORAGE_VERSION = 1;

interface ProfileStorage {
  version: number;
  profiles: UserProfile[];
  lastUpdated: number;
}

/**
 * 기본 진행도 생성
 */
function createDefaultProgress(): PlayerProgress {
  return {
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
      'kr_easy_1',
      'kr_easy_2',
    ],
    achievements: [],
    stageRecords: {},
    languagesPlayed: [],
  };
}

/**
 * 모든 프로필 로드
 */
export function loadAllProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) {
      console.log('[Profile] No profiles found');
      return [];
    }

    const data: ProfileStorage = JSON.parse(raw);

    if (data.version !== STORAGE_VERSION) {
      console.warn('[Profile] Version mismatch, ignoring saved profiles');
      return [];
    }

    console.log('[Profile] Loaded profiles:', data.profiles.length);
    return data.profiles;
  } catch (error) {
    console.error('[Profile] Failed to load profiles:', error);
    return [];
  }
}

/**
 * 모든 프로필 저장
 */
export function saveAllProfiles(profiles: UserProfile[]): void {
  try {
    const data: ProfileStorage = {
      version: STORAGE_VERSION,
      profiles,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(PROFILES_KEY, JSON.stringify(data));
    console.log('[Profile] Saved profiles:', profiles.length);
  } catch (error) {
    console.error('[Profile] Failed to save profiles:', error);
  }
}

/**
 * 현재 프로필 ID 로드
 */
export function getCurrentProfileId(): string | null {
  try {
    return localStorage.getItem(CURRENT_PROFILE_KEY);
  } catch {
    return null;
  }
}

/**
 * 현재 프로필 ID 저장
 */
export function setCurrentProfileId(profileId: string): void {
  try {
    localStorage.setItem(CURRENT_PROFILE_KEY, profileId);
    console.log('[Profile] Set current profile:', profileId);
  } catch (error) {
    console.error('[Profile] Failed to set current profile:', error);
  }
}

/**
 * 현재 활성 프로필 로드
 */
export function loadCurrentProfile(): UserProfile | null {
  const profileId = getCurrentProfileId();
  if (!profileId) return null;

  const profiles = loadAllProfiles();
  return profiles.find((p) => p.id === profileId) || null;
}

/**
 * 새 프로필 생성
 */
export function createProfile(name: string, avatar?: string): UserProfile {
  const profile: UserProfile = {
    id: `profile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    avatar: avatar || '👤',
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    progress: createDefaultProgress(),
  };

  const profiles = loadAllProfiles();
  profiles.push(profile);
  saveAllProfiles(profiles);

  console.log('[Profile] Created new profile:', profile.id, profile.name);
  return profile;
}

/**
 * 프로필 업데이트
 */
export function updateProfile(profile: UserProfile): void {
  const profiles = loadAllProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);

  if (index === -1) {
    console.error('[Profile] Profile not found:', profile.id);
    return;
  }

  profile.lastPlayedAt = Date.now();
  profiles[index] = profile;
  saveAllProfiles(profiles);

  console.log('[Profile] Updated profile:', profile.id);
}

/**
 * 프로필 삭제
 */
export function deleteProfile(profileId: string): void {
  const profiles = loadAllProfiles();
  const filtered = profiles.filter((p) => p.id !== profileId);

  if (filtered.length === profiles.length) {
    console.error('[Profile] Profile not found:', profileId);
    return;
  }

  saveAllProfiles(filtered);

  // 현재 프로필이 삭제된 경우
  if (getCurrentProfileId() === profileId) {
    localStorage.removeItem(CURRENT_PROFILE_KEY);
  }

  console.log('[Profile] Deleted profile:', profileId);
}

/**
 * 프로필 전환
 */
export function switchProfile(profileId: string): UserProfile | null {
  const profiles = loadAllProfiles();
  const profile = profiles.find((p) => p.id === profileId);

  if (!profile) {
    console.error('[Profile] Profile not found:', profileId);
    return null;
  }

  setCurrentProfileId(profileId);
  console.log('[Profile] Switched to profile:', profileId, profile.name);
  return profile;
}

/**
 * 스테이지 클리어 기록 업데이트
 */
export function updateStageRecord(
  profile: UserProfile,
  stageId: string,
  score: number,
  wpm: number,
  accuracy: number,
): void {
  const existing = profile.progress.stageRecords[stageId];

  const newRecord = {
    stageId,
    cleared: true,
    bestScore: existing ? Math.max(existing.bestScore, score) : score,
    bestWpm: existing ? Math.max(existing.bestWpm, wpm) : wpm,
    bestAccuracy: existing ? Math.max(existing.bestAccuracy, accuracy) : accuracy,
    stars: calculateStars(accuracy, wpm),
    playCount: existing ? existing.playCount + 1 : 1,
    firstClearedAt: existing?.firstClearedAt || Date.now(),
    lastPlayedAt: Date.now(),
  };

  profile.progress.stageRecords[stageId] = newRecord;
  updateProfile(profile);

  console.log('[Profile] Updated stage record:', stageId, newRecord);
}

/**
 * 별점 계산 (정확도와 WPM 기준)
 */
function calculateStars(accuracy: number, wpm: number): number {
  if (accuracy >= 95 && wpm >= 60) return 3;
  if (accuracy >= 90 && wpm >= 40) return 2;
  if (accuracy >= 80 && wpm >= 20) return 1;
  return 0;
}

/**
 * 스테이지 클리어 여부 확인
 */
export function isStageCleared(profile: UserProfile, stageId: string): boolean {
  return profile.progress.stageRecords[stageId]?.cleared || false;
}

/**
 * 스테이지 별점 가져오기
 */
export function getStageStars(profile: UserProfile, stageId: string): number {
  return profile.progress.stageRecords[stageId]?.stars || 0;
}
