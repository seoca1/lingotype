import { useState, useMemo, useEffect } from 'react';
import type { MissionConfig, StageRecord } from '../types.js';
import { getAudioManager } from '../audio/AudioManager.js';
import { DailyLessonCard } from './DailyLessonCard.js';
import { DailyLessonModal } from './DailyLessonModal.js';
import {
  getNextDailyLesson,
  type DailyLesson,
} from '../data/dailyLessons.js';
import {
  getSessionWeakWords,
  getOverallMastery,
  getAttemptedWordCount,
  getWordStats,
} from '../data/wordMastery.js';
import { getNativeLanguage } from '../data/nativeLanguage.js';
import { t } from '../data/uiTranslations.js';
import { SAMPLE_STAGES } from '../data/stages.js';
import { countNewlyUnlocked } from '../data/stageLock.js';
import {
  recordPlay,
  type DailyStreakState,
} from '../data/dailyStreak.js';
import {
  evaluateBadges,
  getBadgeDisplayName,
  type Badge,
  type BadgeEvalContext,
} from '../data/badges.js';

interface ResultScreenProps {
  score: number;
  enemiesDefeated: number;
  missions: MissionConfig[];
  results: { missionId: string; cleared: boolean }[];
  onBack: () => void;
  /** Current stage language — used to select language-appropriate daily lesson */
  currentLanguage?: 'en' | 'jp' | 'es' | 'kr';
  /** Callback to start a practice stage from the daily lesson card */
  onPracticeStage?: (stageId: string) => void;
  /** Stage records — used for unlock detection */
  stageRecords?: Record<string, StageRecord>;
  /** ID of the stage just cleared — used to compute newly unlocked */
  clearedStageId?: string;
}

export function ResultScreen({
  score,
  enemiesDefeated,
  missions,
  results,
  onBack,
  currentLanguage,
  onPracticeStage,
  stageRecords,
  clearedStageId,
}: ResultScreenProps) {
  const [dailyLessonOpen, setDailyLessonOpen] = useState(false);
  const [dailyLessonDismissed, setDailyLessonDismissed] = useState(false);

  // Pick today's lesson for the current language (deterministic by date)
  const dailyLesson: DailyLesson | null = useMemo(() => {
    if (!currentLanguage) return null;
    return getNextDailyLesson({ language: currentLanguage });
  }, [currentLanguage]);

  // Phase I: Newly unlocked stages (compute by simulating removal of cleared stage's record)
  const newlyUnlocked = useMemo(() => {
    if (!stageRecords || !clearedStageId) return [];
    const prevRecords = { ...stageRecords };
    delete prevRecords[clearedStageId];
    const allStageIds = SAMPLE_STAGES.map((s) => s.id);
    return countNewlyUnlocked(allStageIds, prevRecords, stageRecords);
  }, [stageRecords, clearedStageId]);

  // Phase J: Record today's play and capture streak milestone
  const [streakInfo, setStreakInfo] = useState<{
    state: DailyStreakState;
    newMilestone?: { days: number; icon: string; label: string };
  } | null>(null);

  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (stageRecords && clearedStageId) {
      const record = stageRecords[clearedStageId];
      if (record?.cleared) {
        const result = recordPlay();
        setStreakInfo({
          state: result.state,
          newMilestone: result.newMilestone,
        });
        const clearedCount = Object.values(stageRecords).filter((r) => r.cleared).length;
        const perfectCount = Object.values(stageRecords).filter(
          (r) => r.cleared && (r.bestAccuracy ?? 0) >= 1.0,
        ).length;
        const langsPlayed = new Set<string>();
        for (const stage of SAMPLE_STAGES) {
          if (stageRecords[stage.id]?.cleared) langsPlayed.add(stage.language);
        }
        const evalCtx: BadgeEvalContext = {
          stagesCleared: clearedCount,
          perfectClears: perfectCount,
          totalAccuracy: record.bestAccuracy ?? 0,
          currentStreak: result.state.currentStreak,
          languagesPlayed: langsPlayed.size,
          hasTriedAllLanguages: langsPlayed.size >= 4,
        };
        const newly = evaluateBadges(evalCtx);
        if (newly.length > 0) {
          setNewlyEarnedBadges(newly);
          getAudioManager().play('stage-clear');
        }
      }
    }
  }, [stageRecords, clearedStageId]);

  // Phase B-4: Weak Words from this session
  const sessionWeakWords = useMemo(() => {
    return getSessionWeakWords().map((id) => {
      const stats = getWordStats(id);
      return { id, stats };
    });
  }, []);

  // Phase B-4: Mastery overview
  const overallMastery = useMemo(() => getOverallMastery(), []);
  const attemptedWordCount = useMemo(() => getAttemptedWordCount(), []);

  const handleOpenLesson = () => {
    setDailyLessonOpen(true);
  };

  const handleSkipLesson = () => {
    setDailyLessonDismissed(true);
  };

  const handlePractice = (stageId: string) => {
    if (onPracticeStage) {
      onPracticeStage(stageId);
    }
  };

  return (
    <div className="result-screen">
      <h1>Stage Result</h1>
      <div className="result-summary">
        <p>Score: <strong>{score}</strong></p>
        <p>Defeated: <strong>{enemiesDefeated}</strong></p>
      </div>

      {/* Phase I: Newly Unlocked Stages Banner */}
      {newlyUnlocked.length > 0 && (
        <div className="result-unlock-banner">
          <div className="result-unlock-banner__icon">🔓</div>
          <div className="result-unlock-banner__text">
            <strong>+{newlyUnlocked.length} new stage{newlyUnlocked.length > 1 ? 's' : ''} unlocked!</strong>
            <div className="result-unlock-banner__list">
              {newlyUnlocked.slice(0, 3).map((id) => (
                <span key={id} className="unlock-chip">{id}</span>
              ))}
              {newlyUnlocked.length > 3 && (
                <span className="unlock-chip">+{newlyUnlocked.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Phase J: Daily Streak Celebration */}
      {streakInfo && (
        <div className={`result-streak-banner ${streakInfo.newMilestone ? 'result-streak-banner--milestone' : ''}`}>
          <div className="result-streak-banner__icon">
            {streakInfo.newMilestone?.icon ||
              (streakInfo.state.currentStreak >= 7 ? '🔥' : '📅')}
          </div>
          <div className="result-streak-banner__text">
            <strong>
              {streakInfo.newMilestone?.label ||
                `${streakInfo.state.currentStreak}-day streak`}
            </strong>
            <div className="result-streak-banner__sub">
              {streakInfo.newMilestone
                ? `🎉 New milestone! Come back tomorrow for ${streakInfo.newMilestone.days + 1}!`
                : `Longest streak: ${streakInfo.state.longestStreak} days · Total: ${streakInfo.state.totalDaysPlayed}`}
            </div>
          </div>
        </div>
      )}

      {newlyEarnedBadges.length > 0 && (
        <div
          className="result-badge-banner"
          role="status"
          aria-live="polite"
          aria-label={`${newlyEarnedBadges.length} new badge${newlyEarnedBadges.length > 1 ? 's' : ''} unlocked`}
        >
          <div className="result-badge-banner__icon" aria-hidden="true">🏆</div>
          <div className="result-badge-banner__text">
            <strong>+{newlyEarnedBadges.length} new badge{newlyEarnedBadges.length > 1 ? 's' : ''} unlocked!</strong>
            <div className="result-badge-banner__list">
              {newlyEarnedBadges.slice(0, 3).map((badge) => (
                <span key={badge.id} className="badge-unlock-chip">
                  {badge.icon} {getBadgeDisplayName(badge, getNativeLanguage())}
                </span>
              ))}
              {newlyEarnedBadges.length > 3 && (
                <span className="badge-unlock-chip">+{newlyEarnedBadges.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Phase B-4: Mastery Overview */}
      <div className="result-mastery">
        <h2>{t('learningProgress', getNativeLanguage())}</h2>
        <div className="mastery-bar">
          <div className="mastery-bar__fill" style={{ width: `${overallMastery}%` }}>
            <span className="mastery-bar__label">{overallMastery}%</span>
          </div>
        </div>
        <p className="mastery-meta">
          {t('masteryPercent', getNativeLanguage())} · {attemptedWordCount}{' '}
          {t('wordsLearned', getNativeLanguage())}
        </p>
      </div>

      {/* Phase B-4: Weak Words */}
      {sessionWeakWords.length > 0 && (
        <div className="result-weak-words">
          <h2>{t('weakWords', getNativeLanguage())}</h2>
          <p className="weak-words-hint">
            {(() => {
              const nl = getNativeLanguage();
              if (nl === 'ko')
                return '실수가 많았던 단어들입니다. 일일 학습에서 복습해보세요.';
              if (nl === 'ja')
                return 'ミスの多い単語です。毎日の学習で復習しましょう。';
              if (nl === 'es')
                return 'Palabras con más errores. Repásalas en la lección diaria.';
              return 'Words with many mistakes. Review them in the daily lesson.';
            })()}
          </p>
          <div className="weak-words-list">
            {sessionWeakWords.slice(0, 5).map(({ id, stats }) => (
              <div key={id} className="weak-word-chip">
                <span className="weak-word-id">{id}</span>
                <span className="weak-word-mistakes">
                  {stats?.mistakeCount ?? 0}{' '}
                  {(() => {
                    const nl = getNativeLanguage();
                    if (nl === 'ko') return '회 실수';
                    if (nl === 'ja') return '回ミス';
                    if (nl === 'es') return ' errores';
                    return ' mistakes';
                  })()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="result-missions">
        <h2>Missions</h2>
        {missions.map((m) => {
          const result = results.find((r) => r.missionId === m.id);
          const cleared = result?.cleared ?? false;
          return (
            <div key={m.id} className={`mission-result ${cleared ? 'cleared' : 'failed'}`}>
              <strong>{cleared ? '✓' : '✗'} {m.name}</strong>
              <p>{m.description}</p>
            </div>
          );
        })}
      </div>

      {/* Daily Lesson integration — shown after a stage clear */}
      {dailyLesson && !dailyLessonDismissed && !dailyLessonOpen && (
        <DailyLessonCard
          lesson={dailyLesson}
          onOpen={handleOpenLesson}
          onSkip={handleSkipLesson}
          onPractice={handlePractice}
        />
      )}

      {dailyLessonOpen && dailyLesson && (
        <DailyLessonModal
          lesson={dailyLesson}
          onClose={() => setDailyLessonOpen(false)}
          onPractice={handlePractice}
        />
      )}

      <button onClick={onBack}>Back to Menu</button>

      <style>{`
        .result-mastery {
          background: #0d1420;
          border: 1px solid #1a2530;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }
        .result-mastery h2 {
          font-size: 16px;
          color: #00d9ff;
          margin: 0 0 12px 0;
        }

        /* Phase I: Unlock Banner */
        .result-unlock-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, rgba(102, 221, 102, 0.15), rgba(0, 217, 255, 0.15));
          border: 2px solid #66dd66;
          border-radius: 12px;
          padding: 14px 18px;
          margin: 16px 0;
          animation: unlockGlow 2s ease-in-out infinite;
        }
        @keyframes unlockGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(102, 221, 102, 0.3); }
          50% { box-shadow: 0 0 24px rgba(102, 221, 102, 0.6); }
        }
        .result-unlock-banner__icon {
          font-size: 32px;
          flex-shrink: 0;
        }
        .result-unlock-banner__text {
          flex: 1;
          color: #fff;
        }
        .result-unlock-banner__text strong {
          font-size: 16px;
          color: #66dd66;
          display: block;
          margin-bottom: 6px;
        }
        .result-unlock-banner__list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .unlock-chip {
          background: rgba(0, 217, 255, 0.2);
          border: 1px solid #00d9ff;
          color: #fff;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-family: monospace;
        }

        /* Phase J: Streak Banner */
        .result-streak-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 107, 157, 0.1);
          border: 1px solid #ff6b9d;
          border-radius: 12px;
          padding: 12px 16px;
          margin: 12px 0;
        }
        .result-streak-banner--milestone {
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(255, 170, 85, 0.2));
          border: 2px solid #ff6b9d;
          animation: streakCelebrate 2s ease-in-out infinite;
        }
        .result-badge-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(255, 107, 157, 0.15));
          border: 2px solid #ffb800;
          border-radius: 12px;
          padding: 14px 18px;
          margin: 16px 0;
          animation: badgeCelebrate 2.5s ease-in-out infinite;
        }
        @keyframes badgeCelebrate {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 184, 0, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(255, 184, 0, 0.6); }
        }
        .result-badge-banner__icon {
          font-size: 32px;
        }
        .result-badge-banner__text {
          flex: 1;
        }
        .result-badge-banner__text strong {
          display: block;
          color: #ffb800;
          font-size: 16px;
          margin-bottom: 4px;
        }
        .result-badge-banner__list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .badge-unlock-chip {
          background: rgba(255, 184, 0, 0.15);
          border: 1px solid #ffb800;
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 12px;
          color: #ffe066;
        }
        @keyframes streakCelebrate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .result-streak-banner__icon {
          font-size: 28px;
        }
        .result-streak-banner__text strong {
          font-size: 16px;
          color: #ff6b9d;
          display: block;
        }
        .result-streak-banner__sub {
          font-size: 12px;
          color: #b4d2fa;
          margin-top: 2px;
        }
        .mastery-bar {
          background: #1a2530;
          border-radius: 8px;
          height: 24px;
          overflow: hidden;
          position: relative;
        }
        .mastery-bar__fill {
          background: linear-gradient(90deg, #00d9ff, #66dd66);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 8px;
          transition: width 0.3s;
          min-width: 40px;
        }
        .mastery-bar__label {
          color: #0d1420;
          font-weight: 700;
          font-size: 12px;
        }
        .mastery-meta {
          color: #6a7888;
          font-size: 12px;
          margin: 8px 0 0 0;
        }

        .result-weak-words {
          background: rgba(255, 102, 102, 0.05);
          border: 1px solid rgba(255, 102, 102, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }
        .result-weak-words h2 {
          font-size: 16px;
          color: #ff6666;
          margin: 0 0 8px 0;
        }
        .weak-words-hint {
          color: #b4d2fa;
          font-size: 12px;
          margin: 0 0 12px 0;
        }
        .weak-words-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .weak-word-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 102, 102, 0.15);
          border: 1px solid rgba(255, 102, 102, 0.4);
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 12px;
        }
        .weak-word-id {
          color: #fff;
          font-weight: 600;
        }
        .weak-word-mistakes {
          color: #ffaa55;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
}
