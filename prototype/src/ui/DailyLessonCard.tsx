/**
 * DailyLessonCard - Result 화면에 표시되는 일일 학습 카드
 *
 * 스테이지 클리어 후 표시:
 * - 오늘의 학습 주제, 분량, 언어
 * - "📖 읽어보기" 버튼 → DailyLessonModal 열기
 * - "🎮 연습하기" 버튼 → 관련 stage 시작
 */

import type { DailyLesson } from '../data/dailyLessons.js';
import { LANGUAGE_LABEL, type Language } from '../types.js';
import { getNativeLanguage } from '../data/nativeLanguage.js';
import { t } from '../data/uiTranslations.js';

interface DailyLessonCardProps {
  lesson: DailyLesson;
  onOpen: (lesson: DailyLesson) => void;
  onSkip: () => void;
  onPractice: (stageId: string) => void;
}

const LANG_COLORS: Record<Language, string> = {
  en: '#3b82f6',
  jp: '#ec4899',
  es: '#f59e0b',
  kr: '#10b981',
};

export function DailyLessonCard({ lesson, onOpen, onSkip, onPractice }: DailyLessonCardProps) {
  const color = LANG_COLORS[lesson.language];
  const langLabel = LANGUAGE_LABEL[lesson.language];
  const cultureCount = lesson.wiki.culture ? 1 : 0;
  const nativeLanguage = getNativeLanguage();

  return (
    <div
      className="daily-lesson-card"
      style={{ borderColor: color }}
    >
      <div className="daily-lesson-card__header" style={{ background: color }}>
        <span className="daily-lesson-card__icon">📖</span>
        <div>
          <div className="daily-lesson-card__title">{t('todaysLesson', nativeLanguage)}</div>
          <div className="daily-lesson-card__subtitle">
            {langLabel} · {lesson.meta.estimatedReadMinutes}
            {t('minutes', nativeLanguage)}
          </div>
        </div>
      </div>

      <div className="daily-lesson-card__body">
        <p className="daily-lesson-card__excerpt">
          {lesson.raw.excerpt.length > 100
            ? lesson.raw.excerpt.slice(0, 100).trim() + '...'
            : lesson.raw.excerpt}
        </p>
        <div className="daily-lesson-card__meta">
          <span>
            📚 {lesson.wiki.vocabulary.length} {t('words', nativeLanguage)}
          </span>
          <span>💬 {lesson.wiki.expressions.length}</span>
          {cultureCount > 0 && <span>🌏 1</span>}
        </div>
      </div>

      <div className="daily-lesson-card__actions">
        <button
          className="daily-lesson-card__btn daily-lesson-card__btn--primary"
          style={{ background: color }}
          aria-label={t('readMore', nativeLanguage)}
          onClick={() => onOpen(lesson)}
        >
          📖 {t('readMore', nativeLanguage)}
        </button>
        {lesson.meta.relatedStages.length > 0 && (
          <button
            className="daily-lesson-card__btn daily-lesson-card__btn--secondary"
            aria-label={t('practice', nativeLanguage)}
            onClick={() => onPractice(lesson.meta.relatedStages[0])}
          >
            🎮 {t('practice', nativeLanguage)}
          </button>
        )}
        <button
          className="daily-lesson-card__btn daily-lesson-card__btn--tertiary"
          aria-label={t('later', nativeLanguage)}
          onClick={onSkip}
        >
          {t('later', nativeLanguage)}
        </button>
      </div>

      <style>{`
        .daily-lesson-card {
          background: #0d1420;
          border: 2px solid #1a2530;
          border-radius: 12px;
          overflow: hidden;
          margin: 12px 0;
          max-width: 480px;
        }
        .daily-lesson-card__header {
          padding: 12px 16px;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .daily-lesson-card__icon { font-size: 28px; }
        .daily-lesson-card__title {
          font-size: 16px;
          font-weight: 700;
        }
        .daily-lesson-card__subtitle {
          font-size: 12px;
          opacity: 0.85;
        }
        .daily-lesson-card__body {
          padding: 12px 16px;
        }
        .daily-lesson-card__excerpt {
          color: #c5d4e3;
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 8px 0;
        }
        .daily-lesson-card__meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #6a7888;
        }
        .daily-lesson-card__actions {
          display: flex;
          gap: 8px;
          padding: 0 12px 12px;
          flex-wrap: wrap;
        }
        .daily-lesson-card__btn {
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          min-width: 100px;
        }
        .daily-lesson-card__btn--primary { color: white; }
        .daily-lesson-card__btn--secondary {
          background: #1a2530;
          color: #c5d4e3;
        }
        .daily-lesson-card__btn--tertiary {
          background: transparent;
          color: #6a7888;
          min-width: 70px;
        }
        .daily-lesson-card__btn:hover { opacity: 0.85; }
        /* Phase 30: focus-visible ring on the 3 action buttons so keyboard
           users tabbing through the Result screen get a visible focus
           indicator that mirrors the .warning-btn focus pattern. */
        .daily-lesson-card__btn:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
