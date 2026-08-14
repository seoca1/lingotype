/**
 * Stage Selection Screen (단일 언어)
 *
 * 선택된 언어의 스테이지 카드들를 표시
 * 캐릭터 선택 버튼 + 뒤로가기 버튼 포함
 *
 * 키보드 네비게이션:
 * - ↑↓←→ : 스테이지 이동
 * - Enter : 스테이지 시작
 * - Escape : 뒤로 가기
 */

import { useState, useEffect, useCallback } from 'react';
import type { StageConfig, StageRecord, Language } from '../types.js';
import { SAMPLE_STAGES, stagesByTier, type StageTier } from '../data/stages.js';
import { CHARACTER_INFO } from '../config/characterImages.js';
import {
  checkStageUnlocked,
  type StageLockInfo,
} from '../data/stageLock.js';
import { getStreakDisplay } from '../data/dailyStreak.js';
import { getNativeLanguage, type NativeLanguage } from '../data/nativeLanguage.js';
import { t } from '../data/uiTranslations.js';
import { getAudioManager } from '../audio/AudioManager.js';

interface MenuProps {
  language: Language;
  onStartStage: (stage: StageConfig) => void;
  onShowCharacterSelect: (language: string) => void;
  onBackToLanguageSelect: () => void;
  /** Phase G: Settings screen launcher */
  onShowSettings?: () => void;
  /** Phase 10: Options screen launcher */
  onShowOptions?: () => void;
  stageRecords?: Record<string, StageRecord>;
}

const TIER_LABELS: Record<StageTier, string> = {
  0: 'Tier 0 · 문자',
  1: 'Tier 1 · 단어',
  2: 'Tier 2 · 단어 확장',
  3: 'Tier 3 · 짧은 문장',
  4: 'Tier 4 · 긴 문장',
  5: 'Tier 5 · 단락',
};

const LANGUAGE_FLAGS: Record<string, string> = {
  en: '🇺🇸',
  jp: '🇯🇵',
  es: '🇪🇸',
  kr: '🇰🇷',
  fr: '🇫🇷',
};

function StageCard({
  stage,
  onStart,
  record,
  lock,
  selected,
  dataStageId,
  nativeLanguage,
}: {
  stage: StageConfig;
  onStart: (s: StageConfig) => void;
  record?: StageRecord;
  lock?: StageLockInfo;
  selected?: boolean;
  dataStageId?: string;
  nativeLanguage: NativeLanguage;
}) {
  const stars = record?.stars || 0;
  const cleared = record?.cleared || false;
  const bestScore = record?.bestScore || 0;
  const locked = lock ? !lock.unlocked : false;
  const lockReason = lock?.reason || '';

  const handleClick = () => {
    if (locked) return;
    getAudioManager().play('menu-select');
    onStart(stage);
  };

  return (
    <button
      className={`stage-card ${cleared ? 'stage-cleared' : ''} ${locked ? 'stage-locked' : ''} ${selected ? 'stage-selected' : ''}`}
      onClick={handleClick}
      disabled={locked}
      title={locked ? lockReason : stage.description}
      data-stage-id={dataStageId}
      aria-label={
        locked
          ? `${stage.name}, Tier ${stage.difficulty}, locked: ${lockReason}`
          : `${stage.name}, Tier ${stage.difficulty}${
              cleared ? `, cleared ${stars} stars` : ''
            }, ${stage.wordCount} ${t('words', nativeLanguage)}`
      }
      aria-disabled={locked || undefined}
    >
      <div className="stage-card-header">
        <h3>
          {stage.name}
          <span className="tier-badge">T{stage.difficulty}</span>
        </h3>
        {locked ? (
          <div className="stage-status">
            <span className="lock-badge">🔒</span>
          </div>
        ) : cleared ? (
          <div className="stage-status">
            <span className="clear-badge">✓</span>
            <span className="stars">{'⭐'.repeat(stars)}</span>
          </div>
        ) : null}
      </div>
      <p>{locked ? lockReason : stage.description}</p>
      <div className="stage-footer">
        <small>{stage.wordCount} {t('words', nativeLanguage)}</small>
        {cleared && bestScore > 0 && (
          <small className="best-score">{t('bestScore', nativeLanguage)}: {bestScore} {t('points', nativeLanguage)}</small>
        )}
        {locked && (
          <small className="lock-hint">{lockReason}</small>
        )}
      </div>
    </button>
  );
}

export function Menu({
  language,
  onStartStage,
  onShowCharacterSelect,
  onBackToLanguageSelect,
  onShowSettings,
  onShowOptions,
  stageRecords,
}: MenuProps) {
  const nativeLanguage = getNativeLanguage();

  // 현재 언어의 스테이지만 필터링
  const languageStages = SAMPLE_STAGES.filter((s) => s.language === language);
  const byTier = stagesByTier(language);
  // Detect whether the current language has a Tier 0 section in SAMPLE_STAGES.
  // Only JP has Tier 0 stages in the current corpus. EN/ES/KR start at Tier 1,
  // so they don't show a Tier 0 section.
  const supportsTier0 =
    byTier[0] !== undefined && byTier[0].length > 0;

  // Phase I: compute stage locks for each stage based on prior clears
  // Bug fix: use ALL language stages (from byTier) — NOT just SAMPLE_STAGES —
  // so lockMap covers every stage rendered, including Tier 4+ corpus-pending
  // stages that exist in ALL_STAGES but not in SAMPLE_STAGES. Previously
  // missing lockMap entries caused StageCard to treat them as unlocked
  // (the `const locked = lock ? !lock.unlocked : false` fallback).
  const records = stageRecords || {};
  const allLanguageStages = Object.values(byTier).flat();
  const lockMap: Record<string, StageLockInfo> = {};
  for (const s of allLanguageStages) {
    lockMap[s.id] = checkStageUnlocked(s.id, records);
  }

  // Phase J: daily streak display
  const streak = getStreakDisplay();

  // Stats for this language
  const languageRecords = allLanguageStages.map((s) => records[s.id]).filter(Boolean);
  const totalStars = languageRecords.reduce((sum, r) => sum + (r?.stars || 0), 0);
  const clearedCount = languageRecords.filter((r) => r?.cleared).length;

  // 키보드 네비게이션
  const GRID_COLS = 3;
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const allStageIds = allLanguageStages.map((s) => s.id);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        getAudioManager().play('menu-click');
        onBackToLanguageSelect();
        return;
      }

      if (selectedIndex < 0) return;

      const currentStage = allLanguageStages[selectedIndex];
      if (!currentStage) return;

      if (e.key === 'Enter' || e.key === ' ') {
        const lock = lockMap[currentStage.id];
        const locked = lock ? !lock.unlocked : false;
        if (!locked) {
          getAudioManager().play('menu-select');
          onStartStage(currentStage);
        }
        return;
      }

      let newIndex = selectedIndex;
      if (e.key === 'ArrowRight') {
        newIndex = Math.min(selectedIndex + 1, allStageIds.length - 1);
      } else if (e.key === 'ArrowLeft') {
        newIndex = Math.max(selectedIndex - 1, 0);
      } else if (e.key === 'ArrowDown') {
        newIndex = Math.min(selectedIndex + GRID_COLS, allStageIds.length - 1);
      } else if (e.key === 'ArrowUp') {
        newIndex = Math.max(selectedIndex - GRID_COLS, 0);
      }

      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
        // Scroll the selected card into view
        const card = document.querySelector(`[data-stage-id="${allStageIds[newIndex]}"]`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },
    [selectedIndex, allLanguageStages, allStageIds, lockMap, onStartStage, onBackToLanguageSelect]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const languageNames: Record<string, { native: string; en: string }> = {
    en: { native: 'English', en: '영어' },
    jp: { native: '日本語', en: '일본어' },
    es: { native: 'Español', en: '스페인어' },
    kr: { native: '한국어', en: '한국어' },
    fr: { native: 'Français', en: '프랑스어' },
  };

  const langInfo = languageNames[language] || { native: language, en: language };
  const flag = LANGUAGE_FLAGS[language] || '🌐';
  const defaultCharacterId = `${language}-${'emily'}`;
  const defaultCharacter = CHARACTER_INFO[defaultCharacterId];

  return (
    <div className="menu">
      <header className="menu-header">
        <div className="menu-header-top">
          <button
            className="back-btn"
            onClick={() => { getAudioManager().play('menu-click'); onBackToLanguageSelect(); }}
            aria-label="Back to language selection (Escape)"
          >
            ← 언어 선택으로
          </button>
          <div className="menu-header-top-right">
            <span
              className={`streak-badge streak-badge--${streak.status}`}
              title={streak.text}
            >
              {streak.icon} {streak.count > 0 ? streak.count : '—'}
            </span>
            {onShowOptions && (
              <button
                className="options-btn"
                onClick={() => { getAudioManager().play('menu-click'); onShowOptions(); }}
                aria-label="Options"
                title="Options"
                data-testid="menu-options-btn"
              >
                🎛️
              </button>
            )}
            {onShowSettings && (
              <button
                className="settings-btn"
                onClick={() => { getAudioManager().play('menu-click'); onShowSettings(); }}
                aria-label="Settings"
                title="Settings"
              >
                ⚙️
              </button>
            )}
          </div>
        </div>
        <h1>
          {flag} {langInfo.native}
          <small> · {langInfo.en}</small>
        </h1>
        <p>{languageStages.length} {t('stages', nativeLanguage)} · ⭐{totalStars} · ✅{clearedCount}</p>
        <div className="menu-header-buttons">
          <button
            className="character-select-btn"
            onClick={() => { getAudioManager().play('menu-click'); onShowCharacterSelect(language); }}
          >
            👤 {t('selectCharacter', nativeLanguage)} {defaultCharacter ? `(${defaultCharacter.name})` : ''}
          </button>
        </div>
      </header>

      {supportsTier0 && byTier[0] && byTier[0].length > 0 && (
        <section className="tier-group">
          <h3 className="tier-title">{TIER_LABELS[0]}</h3>
          <div className="stage-grid">
            {byTier[0].map((s, i) => (
              <StageCard
                key={s.id}
                stage={s}
                onStart={onStartStage}
                record={stageRecords?.[s.id]}
                lock={lockMap[s.id]}
                selected={selectedIndex === i}
                dataStageId={s.id}
                nativeLanguage={nativeLanguage}
              />
            ))}
          </div>
        </section>
      )}

      {([1, 2, 3, 4, 5] as StageTier[]).map((tier) => {
        const tierStages = byTier[tier];
        if (tierStages.length === 0) return null;
        // For EN/ES/KR (no Tier 0), Tier 1 is the first tier and is auto-unlocked.
        // Show a small hint so the user knows why there's no prerequisite.
        const showTier1Hint =
          tier === 1 &&
          !supportsTier0 &&
          tierStages.some((s) => lockMap[s.id]?.unlocked);
        return (
          <section key={tier} className="tier-group">
            <h3 className="tier-title">{TIER_LABELS[tier]}</h3>
            {showTier1Hint && (
              <p className="tier-hint tier-hint-auto">
                ✨ {t('startingStageReady', nativeLanguage)}
              </p>
            )}
            <div className="stage-grid">
              {tierStages.map((s) => {
                const globalIndex = allLanguageStages.findIndex((st) => st.id === s.id);
                return (
                  <StageCard
                    key={s.id}
                    stage={s}
                    onStart={onStartStage}
                    record={stageRecords?.[s.id]}
                    lock={lockMap[s.id]}
                    selected={selectedIndex === globalIndex}
                    dataStageId={s.id}
                    nativeLanguage={nativeLanguage}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      <footer className="menu-footer">
        <p>
          {t('menuFooter', nativeLanguage).replace('{count}', String(languageStages.length)).replace('{stages}', t('stages', nativeLanguage))}
        </p>
      </footer>
    </div>
  );
}
