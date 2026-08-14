import { useState, useMemo, useEffect, useRef } from 'react';
import type { MissionConfig, StageRecord, Language } from '../types.js';
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
import { getMeaning } from '../data/meaningResolver.js';
import { t } from '../data/uiTranslations.js';
import { SAMPLE_STAGES } from '../data/stages.js';
import { countNewlyUnlocked } from '../data/stageLock.js';
import {
  recordPlay,
  type DailyStreakState,
} from '../data/dailyStreak.js';
import { lookupWordById } from '../data/wordById.js';
import { lookupWikiPage } from '../data/wikiLookup.js';
import { MarkdownView } from './MarkdownView.js';
import { getAudioManager } from '../audio/AudioManager.js';

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
  const [selectedWeakWord, setSelectedWeakWord] = useState<{
    id: string;
    display: string;
    input: string;
    meaning: string;
    source?: string;
    language: Language;
  } | null>(null);

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

  useEffect(() => {
    if (stageRecords && clearedStageId) {
      const record = stageRecords[clearedStageId];
      if (record?.cleared) {
        // Only record if the stage was actually cleared (not just attempted)
        const result = recordPlay();
        setStreakInfo({
          state: result.state,
          newMilestone: result.newMilestone,
        });
      }
    }
  }, [stageRecords, clearedStageId]);

  // Phase 13: game-over cue fires when the player reached the results screen
  // without having cleared the stage. clearedStageId is only populated when
  // the stage was fully cleared (see App.handleWordComplete). A stage ending
  // mid-run (e.g. user gave up, ran out of time, or just stopped after
  // partial progress) lands here with clearedStageId === undefined, which is
  // the natural game-over moment.
  useEffect(() => {
    if (!clearedStageId) {
      getAudioManager().play('game-over');
    }
  }, [clearedStageId]);

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
        <div
          className="result-unlock-banner"
          role="status"
          aria-live="polite"
          aria-label={`${newlyUnlocked.length} new stage${newlyUnlocked.length > 1 ? 's' : ''} unlocked`}
        >
          <div className="result-unlock-banner__icon" aria-hidden="true">🎉</div>
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
        <div
          className={`result-streak-banner ${streakInfo.newMilestone ? 'result-streak-banner--milestone' : ''}`}
          role="status"
          aria-live="polite"
          aria-label={
            streakInfo.newMilestone
              ? `New streak milestone: ${streakInfo.newMilestone.label}`
              : `Current streak: ${streakInfo.state.currentStreak} days`
          }
        >
          <div className="result-streak-banner__icon" aria-hidden="true">
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
            {sessionWeakWords.slice(0, 5).map(({ id, stats }) => {
              const word = lookupWordById(id);
              const display = word?.display ?? id;
              const input = word?.romaji ?? word?.display ?? display;
              const lang = id.split('_')[0] as Language;
              const meaning = word ? getMeaning(word, getNativeLanguage()) ?? '' : '';
              return (
                <button
                  key={id}
                  className="weak-word-chip"
                  onClick={() => word && setSelectedWeakWord({ id, display, input, meaning, source: word.source, language: lang })}
                  aria-label={`View details for ${display}, ${stats?.mistakeCount ?? 0} mistakes`}
                >
                  <span className="weak-word-display">{display}</span>
                  <span className="weak-word-meaning">{meaning}</span>
                  <span className="weak-word-mistakes" aria-hidden="true">
                    {stats?.mistakeCount ?? 0}{' '}
                    {(() => {
                      const nl = getNativeLanguage();
                      if (nl === 'ko') return '회';
                      if (nl === 'ja') return '回';
                      if (nl === 'es') return '';
                      return '';
                    })()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Weak Word Detail Modal — focus is trapped, Esc restores prior focus */}
      {selectedWeakWord && (
        <WeakWordModal
          selected={selectedWeakWord}
          language={currentLanguage}
          onClose={() => setSelectedWeakWord(null)}
        />
      )}

      <div className="result-missions">
        <h2>Missions</h2>
        {missions.map((m) => {
          const result = results.find((r) => r.missionId === m.id);
          const cleared = result?.cleared ?? false;
          return (
            <div
              key={m.id}
              className={`mission-result ${cleared ? 'cleared' : 'failed'}`}
              role="status"
              aria-label={`${m.name}: ${cleared ? 'cleared' : 'failed'}`}
            >
              <strong>
                <span aria-hidden="true">{cleared ? '✓' : '✗'}</span> {m.name}
              </strong>
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

      <button onClick={onBack} aria-label="Back to menu (Escape)">
        Back to Menu (Esc)
      </button>

      <p
        className="result-kbd-hint"
        aria-label="Keyboard shortcuts"
        style={{
          color: '#6a7888',
          fontSize: '11px',
          marginTop: '8px',
          textAlign: 'center',
        }}
      >
        <small>
          <kbd>Esc</kbd> return to menu
        </small>
      </p>

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
          cursor: pointer;
          color: #c5d4e3;
          transition: all 0.15s;
        }
        .weak-word-chip:hover {
          background: rgba(255, 102, 102, 0.25);
          border-color: rgba(255, 102, 102, 0.6);
        }
        .weak-word-display {
          color: #fff;
          font-weight: 600;
        }
        .weak-word-meaning {
          color: #b4d2fa;
          font-size: 11px;
        }
        .weak-word-mistakes {
          color: #ffaa55;
          font-size: 11px;
        }

        /* Weak Word Modal */
        .weak-word-modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 20px;
        }
        .weak-word-modal__content {
          background: #0d1420;
          border: 1px solid #1a2530;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .weak-word-modal__header {
          background: #1a2530;
          padding: 16px 20px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .weak-word-modal__header h2 {
          margin: 0;
          font-size: 22px;
        }
        .weak-word-modal__input {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          font-family: monospace;
          margin-top: 4px;
        }
        .weak-word-modal__close {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
        }
        .weak-word-modal__body {
          padding: 16px 20px;
          overflow-y: auto;
          color: #c5d4e3;
          font-size: 13px;
          line-height: 1.6;
        }
        .weak-word-modal__meaning {
          background: rgba(0, 217, 255, 0.05);
          padding: 10px 14px;
          border-radius: 6px;
          margin: 0 0 14px 0;
        }
        .weak-word-modal__tts {
          margin: 8px 0 16px;
        }
        .weak-word-modal__tts-btn {
          background: rgba(0, 217, 255, 0.15);
          color: #00d9ff;
          border: 1px solid #00d9ff;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .weak-word-modal__tts-btn:hover {
          background: rgba(0, 217, 255, 0.25);
        }
        .weak-word-modal__section {
          margin-top: 14px;
        }
        .weak-word-modal__section h3 {
          font-size: 14px;
          color: #ffaa55;
          margin: 0 0 8px 0;
        }
      `}</style>
    </div>
  );
}

/**
 * WeakWordModal — focused dialog for the per-word detail view on the
 * result screen. Phase 17 added:
 * - role="dialog" + aria-modal="true"
 * - Focus close button on open, restore previous focus on close
 * - Escape key closes
 * - Tab focus is trapped inside the dialog
 */
interface WeakWordModalProps {
  selected: {
    id: string;
    display: string;
    input: string;
    meaning: string;
    source?: string;
    language: Language;
  };
  language?: 'en' | 'jp' | 'es' | 'kr';
  onClose: () => void;
}

export function WeakWordModal({ selected, language: _language, onClose }: WeakWordModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !containerRef.current) return;
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [onClose]);

  const wikiPage = lookupWikiPage(selected.source, selected.language);

  return (
    <div
      className="weak-word-modal"
      onClick={onClose}
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${selected.display} details`}
      data-testid="weak-word-modal"
    >
      <div
        className="weak-word-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="weak-word-modal__header">
          <div>
            <h2>{selected.display}</h2>
            <div className="weak-word-modal__input">{selected.input}</div>
          </div>
          <button
            ref={closeButtonRef}
            className="weak-word-modal__close"
            onClick={onClose}
            aria-label="Close weak word detail (Escape)"
          >
            ✕
          </button>
        </div>
        <div className="weak-word-modal__body">
          <p className="weak-word-modal__meaning">
            <strong>Meaning:</strong> {selected.meaning}
          </p>
          <div className="weak-word-modal__tts">
            <button
              className="weak-word-modal__tts-btn"
              onClick={() => {
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  const u = new SpeechSynthesisUtterance(selected.input);
                  const langMap: Record<string, string> = {
                    en: 'en-US',
                    jp: 'ja-JP',
                    es: 'es-ES',
                    kr: 'ko-KR',
                  };
                  u.lang = langMap[selected.language] ?? 'en-US';
                  u.rate = 0.85;
                  window.speechSynthesis.speak(u);
                }
              }}
            >
              🔊 Listen
            </button>
          </div>
          {wikiPage && (
            <div className="weak-word-modal__section">
              <h3>📖 Wiki</h3>
              <MarkdownView
                source={wikiPage.body}
                ttsLanguage={selected.language}
                enableTts={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
