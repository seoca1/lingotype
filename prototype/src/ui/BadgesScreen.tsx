import { useState, useMemo } from 'react';
import {
  BADGES,
  getUnlockedBadges,
  getTotalBadgeCount,
  getBadgeProgress,
  getBadgeDisplayName,
  getBadgeDisplayDescription,
  type Badge,
  type BadgeEvalContext,
} from '../data/badges.js';
import { getNativeLanguage } from '../data/nativeLanguage.js';
import { t } from '../data/uiTranslations.js';
import { getStreakState } from '../data/dailyStreak.js';
import { SAMPLE_STAGES } from '../data/stages.js';
import type { StageRecord, Language } from '../types.js';

interface BadgesScreenProps {
  stageRecords?: Record<string, StageRecord>;
  languagesPlayed: Language[];
  onBack: () => void;
}

function buildEvalContext(
  stageRecords: Record<string, StageRecord> | undefined,
  languagesPlayed: Language[],
): BadgeEvalContext {
  let stagesCleared = 0;
  let perfectClears = 0;
  const langs = new Set<string>(languagesPlayed);
  const tiersCleared = new Set<number>();
  const records = stageRecords || {};
  for (const stage of SAMPLE_STAGES) {
    const rec = records[stage.id];
    if (rec?.cleared) {
      stagesCleared++;
      langs.add(stage.language);
      tiersCleared.add(stage.difficulty);
      if ((rec.bestAccuracy ?? 0) >= 1.0) {
        perfectClears++;
      }
    }
  }
  const streak = getStreakState();
  return {
    stagesCleared,
    perfectClears,
    totalAccuracy: 0,
    currentStreak: streak.currentStreak,
    languagesPlayed: langs.size,
    hasTriedAllLanguages: langs.size >= 4,
    tiersCleared: tiersCleared.size,
  };
}

export function BadgesScreen({ stageRecords, languagesPlayed, onBack }: BadgesScreenProps) {
  const nativeLang = getNativeLanguage();
  const [unlocked] = useState<Badge[]>(() => getUnlockedBadges());
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const evalContext = useMemo(
    () => buildEvalContext(stageRecords, languagesPlayed),
    [stageRecords, languagesPlayed],
  );

  const unlockedIds = new Set(unlocked.map((b) => b.id));
  const totalCount = getTotalBadgeCount();
  const unlockedCount = unlocked.length;

  const filteredBadges = BADGES.filter((badge) => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return unlockedIds.has(badge.id);
    return !unlockedIds.has(badge.id);
  });

  return (
    <div
      className="badges-screen"
      role="region"
      aria-labelledby="badges-screen-title"
    >
      <header className="badges-header">
        <button
          type="button"
          className="badges-back-btn"
          onClick={onBack}
          aria-label="Back to menu"
        >
          ← {t('back', nativeLang)}
        </button>
        <h1 id="badges-screen-title">🏆 {t('badges', nativeLang)}</h1>
        <div className="badges-counter">
          <span aria-label={`${unlockedCount} of ${totalCount} badges unlocked`}>
            {unlockedCount} / {totalCount}
          </span>
        </div>
      </header>

      <p className="badges-progress-summary" role="status">
        {t('badgeProgress', nativeLang).replace('{count}', String(unlockedCount)).replace('{total}', String(totalCount))}
      </p>

      <div
        className="badges-filter"
        role="group"
        aria-label="Filter badges"
      >
        <button
          type="button"
          className={`badges-filter__btn ${filter === 'all' ? 'badges-filter__btn--active' : ''}`}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          {t('filterAll', nativeLang)} ({totalCount})
        </button>
        <button
          type="button"
          className={`badges-filter__btn ${filter === 'unlocked' ? 'badges-filter__btn--active' : ''}`}
          onClick={() => setFilter('unlocked')}
          aria-pressed={filter === 'unlocked'}
        >
          {t('filterUnlocked', nativeLang)} ({unlockedCount})
        </button>
        <button
          type="button"
          className={`badges-filter__btn ${filter === 'locked' ? 'badges-filter__btn--active' : ''}`}
          onClick={() => setFilter('locked')}
          aria-pressed={filter === 'locked'}
        >
          {t('filterLocked', nativeLang)} ({totalCount - unlockedCount})
        </button>
      </div>

      <div
        className="badges-grid"
        role="list"
        aria-label="Badge collection"
      >
        {filteredBadges.length === 0 ? (
          <div className="badges-empty-state" role="status">
            {filter === 'unlocked' && unlockedCount === 0 && (
              <p>🏆 {t('badgeEmptyUnlocked', nativeLang)}</p>
            )}
            {filter === 'unlocked' && unlockedCount > 0 && (
              <p>🔍 {t('badgeEmptyFiltered', nativeLang)}</p>
            )}
            {filter === 'locked' && totalCount === unlockedCount && (
              <p>🎉 {t('badgeEmptyAllUnlocked', nativeLang)}</p>
            )}
            {filter === 'locked' && totalCount > unlockedCount && (
              <p>🔍 {t('badgeEmptyFiltered', nativeLang)}</p>
            )}
          </div>
        ) : (
          filteredBadges.map((badge) => {
          const isUnlocked = unlockedIds.has(badge.id);
          const progress = getBadgeProgress(badge, evalContext);
          return (
            <div
              key={badge.id}
              className={`badge-card ${isUnlocked ? 'badge-card--unlocked' : 'badge-card--locked'}`}
              style={{ position: 'relative' }}
              role="listitem"
              aria-label={`${getBadgeDisplayName(badge, nativeLang)}: ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="badge-card__icon" aria-hidden="true">
                {isUnlocked ? badge.icon : '🔒'}
              </div>
              <div className="badge-card__name">
                {getBadgeDisplayName(badge, nativeLang)}
              </div>
              <div className="badge-card__desc">
                {getBadgeDisplayDescription(badge, nativeLang)}
              </div>
              <div
                className="badge-card__progress"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={badge.threshold}
                aria-label={`${progress} of ${badge.threshold}`}
              >
                <div
                  className="badge-card__progress-fill"
                  style={{ width: badge.threshold > 0 ? `${Math.min(100, (progress / badge.threshold) * 100)}%` : '0%' }}
                />
                <span className="badge-card__progress-text">
                  {progress} / {badge.threshold}
                </span>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
