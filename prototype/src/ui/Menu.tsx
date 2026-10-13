/**
 * Stage Selection Screen (단일 언어)
 *
 * 선택된 언어의 스테이지 카드들을 표시
 * 캐릭터 선택 버튼 + 뒤로가기 버튼 포함
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { StageConfig, StageRecord, Language } from '../types.js';
import { SAMPLE_STAGES, stagesByTier, type StageTier } from '../data/stages.js';
import { CHARACTER_INFO } from '../config/characterImages.js';
import {
  checkStageUnlocked,
  type StageLockInfo,
} from '../data/stageLock.js';
import { getStreakDisplay } from '../data/dailyStreak.js';
import { getUnlockedBadges, getTotalBadgeCount } from '../data/badges.js';

interface MenuProps {
  language: Language;
  onStartStage: (stage: StageConfig) => void;
  onShowCharacterSelect: (language: string) => void;
  onBackToLanguageSelect: () => void;
  /** Phase G: Settings screen launcher */
  onShowSettings?: () => void;
  onShowOptions?: () => void;
  onShowBadges?: () => void;
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
};

function StageCard({
  stage,
  onStart,
  record,
  lock,
  selected,
  setRef,
}: {
  stage: StageConfig;
  onStart: (s: StageConfig) => void;
  record?: StageRecord;
  lock?: StageLockInfo;
  selected?: boolean;
  setRef?: (el: HTMLButtonElement | null) => void;
}) {
  const stars = record?.stars || 0;
  const cleared = record?.cleared || false;
  const bestScore = record?.bestScore || 0;
  // Defensive fallback: if lock is undefined (e.g., stage not in lockMap),
  // treat as unlocked
  const locked = lock ? !lock.unlocked : false;
  const lockReason = lock?.reason || '';

  const handleClick = () => {
    if (locked) return; // Don't start locked stages
    onStart(stage);
  };

  return (
    <button
      ref={setRef}
      className={`stage-card ${cleared ? 'stage-cleared' : ''} ${locked ? 'stage-locked' : ''} ${selected ? 'stage-selected' : ''}`}
      onClick={handleClick}
      disabled={locked}
      title={locked ? lockReason : stage.description}
      aria-label={
        locked
          ? `${stage.name}, Tier ${stage.difficulty}, locked: ${lockReason}`
          : `${stage.name}, Tier ${stage.difficulty}${cleared ? `, cleared ${stars} stars` : ''}, ${stage.wordCount} words${selected ? ', currently selected' : ''}`
      }
      aria-current={selected ? 'true' : undefined}
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
        <small>{stage.wordCount}개</small>
        {cleared && bestScore > 0 && (
          <small className="best-score">최고: {bestScore}점</small>
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
  onShowBadges,
  stageRecords,
}: MenuProps) {
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
  const [unlockedBadges, setUnlockedBadges] = useState(() => getUnlockedBadges());
  const totalBadges = getTotalBadgeCount();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const allLanguageStagesOrdered: StageConfig[] = (
    supportsTier0 && byTier[0] ? byTier[0] : []
  ).concat(
    [1, 2, 3, 4, 5]
      .filter((tier): tier is StageTier => tier in byTier)
      .flatMap((tier) => byTier[tier])
  );
  const allStageIds = allLanguageStagesOrdered.map((s) => s.id);

  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const setCardRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      cardRefs.current[index] = el;
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToLanguageSelect();
        return;
      }
      if (selectedIndex < 0) return;
      const currentStage = allLanguageStagesOrdered[selectedIndex];
      if (!currentStage) return;
      if (e.key === 'Enter' || e.key === ' ') {
        const lock = lockMap[currentStage.id];
        const locked = lock ? !lock.unlocked : false;
        if (!locked) onStartStage(currentStage);
        return;
      }
      let newIndex = selectedIndex;
      if (e.key === 'ArrowRight') {
        newIndex = Math.min(selectedIndex + 1, allStageIds.length - 1);
      } else if (e.key === 'ArrowLeft') {
        newIndex = Math.max(selectedIndex - 1, 0);
      } else if (e.key === 'ArrowDown') {
        newIndex = Math.min(selectedIndex + 3, allStageIds.length - 1);
      } else if (e.key === 'ArrowUp') {
        newIndex = Math.max(selectedIndex - 3, 0);
      }
      if (newIndex !== selectedIndex) {
        e.preventDefault();
        setSelectedIndex(newIndex);
        cardRefs.current[newIndex]?.focus();
      }
    },
    [selectedIndex, allLanguageStagesOrdered, allStageIds, lockMap, onStartStage, onBackToLanguageSelect]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const refresh = () => setUnlockedBadges(getUnlockedBadges());
    window.addEventListener('badgeUnlocked', refresh);
    window.addEventListener('storage', (e) => {
      if (e.key === 'typing-language-badges') refresh();
    });
    return () => {
      window.removeEventListener('badgeUnlocked', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const languageNames: Record<string, { native: string; en: string }> = {
    en: { native: 'English', en: '영어' },
    jp: { native: '日本語', en: '일본어' },
    es: { native: 'Español', en: '스페인어' },
    kr: { native: '한국어', en: '한국어' },
  };

  const langInfo = languageNames[language] || { native: language, en: language };
  const flag = LANGUAGE_FLAGS[language] || '🌐';
  const defaultCharacterId = `${language}-${'emily'}`;
  const defaultCharacter = CHARACTER_INFO[defaultCharacterId];

  return (
    <div className="menu">
      <header className="menu-header">
        <div className="menu-header-top">
          <button className="back-btn" onClick={onBackToLanguageSelect}>
            ← 언어 선택으로
          </button>
          <div className="menu-header-top-right">
            <span
              className={`streak-badge streak-badge--${streak.status}`}
              title={streak.text}
              role="status"
              aria-label={`Daily streak: ${streak.text}`}
            >
              {streak.icon} {streak.count > 0 ? streak.count : '—'}
            </span>
            {onShowSettings && (
              <button
                className="settings-btn"
                onClick={onShowSettings}
                aria-label="Settings"
                title="Settings"
              >
                ⚙️
              </button>
            )}
            {onShowOptions && (
              <button
                className="options-btn"
                onClick={onShowOptions}
                aria-label="Options"
                title="Options"
                data-testid="menu-options-btn"
              >
                🎛️
              </button>
            )}
            {onShowBadges && (
              <button
                className="badges-btn"
                onClick={onShowBadges}
                aria-label={`Badges: ${unlockedBadges.length} of ${totalBadges} unlocked`}
                title={`Badges: ${unlockedBadges.length} / ${totalBadges}`}
                data-testid="menu-badges-btn"
              >
                🏆<span className="badges-btn__count">{unlockedBadges.length}/{totalBadges}</span>
              </button>
            )}
          </div>
        </div>
        <h1>
          {flag} {langInfo.native}
          <small> · {langInfo.en}</small>
        </h1>
        <p>{languageStages.length}개 스테이지</p>
        <div className="menu-header-buttons">
          <button
            className="character-select-btn"
            onClick={() => onShowCharacterSelect(language)}
            aria-label={`Select Character${
              defaultCharacter ? ` (${defaultCharacter.name})` : ''
            }`}
          >
            👤 캐릭터 선택 {defaultCharacter ? `(${defaultCharacter.name})` : ''}
          </button>
        </div>
      </header>

      {supportsTier0 && byTier[0] && byTier[0].length > 0 && (
        <section
          className="tier-group"
          aria-labelledby="tier-title-0"
        >
          <h3 id="tier-title-0" className="tier-title">{TIER_LABELS[0]}</h3>
          <div className="stage-grid">
            {byTier[0].map((s, i) => (
              <StageCard
                key={s.id}
                stage={s}
                onStart={onStartStage}
                record={stageRecords?.[s.id]}
                lock={lockMap[s.id]}
                selected={selectedIndex === i}
                setRef={setCardRef(i)}
              />
            ))}
          </div>
        </section>
      )}

      {([1, 2, 3, 4, 5] as StageTier[]).map((tier) => {
        const tierStages = byTier[tier];
        if (tierStages.length === 0) return null;
        const showTier1Hint =
          tier === 1 &&
          !supportsTier0 &&
          tierStages.some((s) => lockMap[s.id]?.unlocked);
        return (
          <section
            key={tier}
            className="tier-group"
            aria-labelledby={`tier-title-${tier}`}
          >
            <h3 id={`tier-title-${tier}`} className="tier-title">
              {TIER_LABELS[tier]}
            </h3>
            {showTier1Hint && (
              // Phase 38: role="note" + aria-label so SR users hear the
              // hint framed as an informational note.
              <p
                className="tier-hint tier-hint-auto"
                role="note"
                aria-label="Tier 1 unlock note"
              >
                ✨ 시작 단계 — 바로 플레이할 수 있어요
              </p>
            )}
            <div className="stage-grid">
              {tierStages.map((s) => {
                const globalIndex = allLanguageStagesOrdered.findIndex((st) => st.id === s.id);
                return (
                  <StageCard
                    key={s.id}
                    stage={s}
                    onStart={onStartStage}
                    record={stageRecords?.[s.id]}
                    lock={lockMap[s.id]}
                    selected={selectedIndex === globalIndex}
                    setRef={setCardRef(globalIndex)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      <footer className="menu-footer">
        <p>
          단어부터 장문까지 6 티어 · 총 {languageStages.length}개 스테이지
        </p>
        <small className="menu-kbd-hint">
          <kbd>←</kbd>/<kbd>→</kbd>/<kbd>↑</kbd>/<kbd>↓</kbd> navigate ·{' '}
          <kbd>Enter</kbd> start · <kbd>Esc</kbd> back
        </small>
      </footer>
    </div>
  );
}
