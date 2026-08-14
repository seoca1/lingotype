/**
 * DailyLessonModal - Full-screen daily lesson viewer (3-tier)
 *
 * Displays the daily lesson with 3 selectable depth levels:
 * - 🟢 Quick: 1 vocab summary + 1 expression + raw excerpt (~30 sec)
 * - 🟡 Standard: 3-5 vocab summaries + 2 expressions + 1 culture (~5 min)
 * - 🔴 Deep: Full content with TTS, dialogues, cross-references (~10 min)
 *
 * Wikilinks in vocab pages are clickable, navigating to related word modals.
 * TTS (Web Speech API) is available in Deep mode.
 */

import { useEffect, useMemo, useState } from 'react';
import type { DailyLesson, WikiPage } from '../data/dailyLessons.js';
import { LANGUAGE_LABEL, type Language } from '../types.js';
import { markLessonSeen } from '../data/dailyLessons.js';
import { MarkdownView } from './MarkdownView.js';
import { getNativeLanguage } from '../data/nativeLanguage.js';
import { t } from '../data/uiTranslations.js';
import {
  markPageMastered,
  unmarkPageMastered,
  isPageMastered,
} from '../data/lessonProgress.js';

interface DailyLessonModalProps {
  lesson: DailyLesson;
  onClose: () => void;
  onPractice: (stageId: string) => void;
}

type Tier = 'quick' | 'standard' | 'deep';

const TIER_META: Record<Tier, { label: string; icon: string; color: string; minutes: number }> = {
  quick: { label: 'Quick', icon: '🟢', color: '#66dd66', minutes: 1 },
  standard: { label: 'Standard', icon: '🟡', color: '#ffaa55', minutes: 5 },
  deep: { label: 'Deep', icon: '🔴', color: '#ff6666', minutes: 10 },
};

const LANG_COLORS: Record<Language, string> = {
  en: '#3b82f6',
  jp: '#ec4899',
  es: '#f59e0b',
  kr: '#10b981',
};

/**
 * Filter markdown content to only include content up to a given H2 limit.
 * For Quick: 1 section (Definition only).
 * For Standard: 4 sections (Definition + Pronunciation + Examples + Memory Tip).
 * For Deep: all sections.
 */
function filterMarkdownByTier(body: string, tier: Tier): string {
  if (tier === 'deep') return body;

  const lines = body.split('\n');
  const result: string[] = [];
  let h2Count = 0;
  let stopped = false;

  for (const line of lines) {
    if (stopped) break;
    if (line.trim().startsWith('## ')) {
      const limit = tier === 'quick' ? 1 : 4;
      if (h2Count >= limit) {
        stopped = true;
        break;
      }
      h2Count++;
    }
    result.push(line);
  }
  return result.join('\n');
}

/**
 * Truncate a markdown body to a single quick summary.
 * Extracts title, definition, and 1-2 examples only.
 */
function getQuickVocabSummary(page: WikiPage): string {
  const lines = page.body.split('\n');
  const out: string[] = [];
  let inDefinition = false;
  let inExamples = false;
  let examplesCount = 0;

  out.push(`# ${page.title}`);
  for (const line of lines) {
    if (line.trim().startsWith('**Definition:') || line.trim().startsWith('**Definition **')) {
      out.push(line);
      inDefinition = true;
    } else if (line.trim().startsWith('**')) {
      inDefinition = false;
    } else if (inDefinition) {
      out.push(line);
      inDefinition = false;
    } else if (line.trim().startsWith('## Examples')) {
      inExamples = true;
      out.push('\n## Examples');
    } else if (inExamples && line.trim().startsWith('-')) {
      if (examplesCount < 2) {
        out.push(line);
        examplesCount++;
      } else {
        inExamples = false;
      }
    } else if (line.trim().startsWith('## ')) {
      break;
    }
  }
  return out.join('\n');
}

export function DailyLessonModal({ lesson, onClose, onPractice }: DailyLessonModalProps) {
  const color = LANG_COLORS[lesson.language];
  const [tier, setTier] = useState<Tier>('standard');
  const [wikilinkTarget, setWikilinkTarget] = useState<WikiPage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mark as seen when modal opens
  useEffect(() => {
    markLessonSeen(lesson.id);
  }, [lesson.id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (wikilinkTarget) {
          setWikilinkTarget(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, wikilinkTarget]);

  // Resolve wikilink → find a vocab/expression page matching the target
  const wikilinkResolver = useMemo(() => {
    const allPages: WikiPage[] = [
      ...lesson.wiki.vocabulary,
      ...lesson.wiki.expressions,
    ];
    return (target: string): string | null => {
      const cleaned = target.split('|')[0].trim();
      const match = allPages.find(
        (p) => p.title === cleaned || p.filename.replace('.md', '') === cleaned
      );
      if (match) {
        return `#wikilink-${encodeURIComponent(match.filename)}`;
      }
      return null; // Broken link indicator
    };
  }, [lesson]);

  // Filter content based on tier
  const content = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = (page: WikiPage) =>
      !q || page.title.toLowerCase().includes(q) || page.body.toLowerCase().includes(q);

    let base;
    if (tier === 'quick') {
      base = {
        vocab: lesson.wiki.vocabulary.slice(0, 1).map(getQuickVocabSummary).map((body, i) => ({
          ...lesson.wiki.vocabulary[i],
          body,
        })),
        expressions: lesson.wiki.expressions.slice(0, 1).map((p) => ({
          ...p,
          body: filterMarkdownByTier(p.body, 'quick'),
        })),
        culture: null, // Quick tier hides culture — only vocab/expressions shown
      };
    } else if (tier === 'standard') {
      base = {
        vocab: lesson.wiki.vocabulary.slice(0, 3).map((p) => ({
          ...p,
          body: filterMarkdownByTier(p.body, 'standard'),
        })),
        expressions: lesson.wiki.expressions.slice(0, 2).map((p) => ({
          ...p,
          body: filterMarkdownByTier(p.body, 'standard'),
        })),
        culture: lesson.wiki.culture
          ? { ...lesson.wiki.culture, body: filterMarkdownByTier(lesson.wiki.culture.body, 'standard') }
          : null,
      };
    } else {
      base = {
        vocab: lesson.wiki.vocabulary,
        expressions: lesson.wiki.expressions,
        culture: lesson.wiki.culture,
      };
    }

    return {
      vocab: base.vocab.filter(matchesQuery),
      expressions: base.expressions.filter(matchesQuery),
      culture: base.culture && matchesQuery(base.culture) ? base.culture : null,
    };
  }, [lesson, tier, searchQuery]);

  // Progress stats
  const progress = useMemo(() => {
    const total = lesson.wiki.vocabulary.length + lesson.wiki.expressions.length;
    const mastered = lesson.wiki.vocabulary.filter((p) => isPageMastered(lesson.id, p.filename)).length +
      lesson.wiki.expressions.filter((p) => isPageMastered(lesson.id, p.filename)).length;
    return { mastered, total };
  }, [lesson]);

  // Handle wikilink click → show related page in sub-modal
  const handleWikilinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('wikilink') && !target.classList.contains('wikilink--broken')) {
      e.preventDefault();
      const href = target.getAttribute('href') || '';
      const m = href.match(/#wikilink-(.+)$/);
      if (m) {
        const filename = decodeURIComponent(m[1]);
        const allPages: WikiPage[] = [
          ...lesson.wiki.vocabulary,
          ...lesson.wiki.expressions,
        ];
        const page = allPages.find((p) => p.filename === filename);
        if (page) setWikilinkTarget(page);
      }
    }
  };

  return (
    <div className="daily-lesson-modal" onClick={onClose}>
      <div
        className="daily-lesson-modal__content"
        onClick={(e) => e.stopPropagation()}
        onClickCapture={handleWikilinkClick}
      >
        <div className="daily-lesson-modal__header" style={{ background: color }}>
          <div>
            <div className="daily-lesson-modal__lang">{LANGUAGE_LABEL[lesson.language]}</div>
            <h2 className="daily-lesson-modal__title">{t('todaysLesson', getNativeLanguage())}</h2>
            <div className="daily-lesson-modal__meta">
              {content.vocab.length} {t('words', getNativeLanguage())} ·{' '}
              {content.expressions.length} {t('expressions', getNativeLanguage())}
              {tier !== 'quick' && content.culture && ` · 1 ${t('culture', getNativeLanguage())}`} ·{' '}
              {TIER_META[tier].minutes}
              {t('minutes', getNativeLanguage())}
            </div>
          </div>
          <button
            className="daily-lesson-modal__close"
            onClick={onClose}
            aria-label={t('close', getNativeLanguage())}
          >
            ✕
          </button>
        </div>

        {/* Tier Selector */}
        <div className="daily-lesson-modal__tier-selector" role="group" aria-label="Lesson depth">
          {(Object.keys(TIER_META) as Tier[]).map((t) => {
            const meta = TIER_META[t];
            return (
              <button
                key={t}
                className={`daily-lesson-modal__tier-btn ${
                  tier === t ? 'daily-lesson-modal__tier-btn--active' : ''
                }`}
                onClick={() => setTier(t)}
                aria-pressed={tier === t}
                aria-label={`${meta.label} tier, ~${meta.minutes} minute${meta.minutes === 1 ? '' : 's'}${tier === t ? ', selected' : ''}`}
                style={tier === t ? { background: meta.color, color: 'white' } : {}}
              >
                <span className="daily-lesson-modal__tier-icon" aria-hidden="true">{meta.icon}</span>
                <span className="daily-lesson-modal__tier-label">{meta.label}</span>
                <span className="daily-lesson-modal__tier-time">~{meta.minutes}분</span>
              </button>
            );
          })}
        </div>

        {/* Search + Progress */}
        <div className="daily-lesson-modal__search-row">
          <input
            className="daily-lesson-modal__search"
            type="text"
            placeholder={getNativeLanguage() === 'ko' ? '단어 검색...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="daily-lesson-modal__progress-label">
            ✓ {progress.mastered}/{progress.total}
          </span>
        </div>

        <div className="daily-lesson-modal__body">
          <section className="daily-lesson-modal__section">
            <h3 className="daily-lesson-modal__section-title">📜 {t('rawMaterial', getNativeLanguage())}</h3>
            <div className="daily-lesson-modal__raw-excerpt">
              {lesson.raw.excerpt}
            </div>
          </section>

          <section className="daily-lesson-modal__section">
            <h3 className="daily-lesson-modal__section-title">
              📚 {t('vocabulary', getNativeLanguage())} ({content.vocab.length}/{lesson.wiki.vocabulary.length})
            </h3>
            {content.vocab.map((page) => {
              const learned = isPageMastered(lesson.id, page.filename);
              return (
                <details
                  key={page.filename}
                  open={tier === 'deep'}
                  className={`daily-lesson-modal__page ${learned ? 'daily-lesson-modal__page--learned' : ''}`}
                >
                  <summary className="daily-lesson-modal__page-title">
                    <button
                      className={`daily-lesson-modal__learn-btn ${learned ? 'daily-lesson-modal__learn-btn--active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (learned) {
                          unmarkPageMastered(lesson.id, page.filename);
                        } else {
                          markPageMastered(lesson.id, page.filename);
                        }
                      }}
                      aria-label={learned ? 'Unmark as learned' : 'Mark as learned'}
                    >
                      {learned ? '✓' : '○'}
                    </button>
                    {page.title}
                  </summary>
                  <MarkdownView
                    source={page.body}
                    linkResolver={wikilinkResolver}
                    ttsLanguage={lesson.language}
                    enableTts={tier === 'deep'}
                  />
                </details>
              );
            })}
          </section>

          <section className="daily-lesson-modal__section">
            <h3 className="daily-lesson-modal__section-title">
              💬 {t('expressions', getNativeLanguage())} ({content.expressions.length}/{lesson.wiki.expressions.length})
            </h3>
            {content.expressions.map((page) => {
              const learned = isPageMastered(lesson.id, page.filename);
              return (
                <details
                  key={page.filename}
                  open={tier === 'deep'}
                  className={`daily-lesson-modal__page ${learned ? 'daily-lesson-modal__page--learned' : ''}`}
                >
                  <summary className="daily-lesson-modal__page-title">
                    <button
                      className={`daily-lesson-modal__learn-btn ${learned ? 'daily-lesson-modal__learn-btn--active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (learned) {
                          unmarkPageMastered(lesson.id, page.filename);
                        } else {
                          markPageMastered(lesson.id, page.filename);
                        }
                      }}
                      aria-label={learned ? 'Unmark as learned' : 'Mark as learned'}
                    >
                      {learned ? '✓' : '○'}
                    </button>
                    {page.title}
                  </summary>
                  <MarkdownView
                    source={page.body}
                    linkResolver={wikilinkResolver}
                    ttsLanguage={lesson.language}
                    enableTts={tier === 'deep'}
                  />
              </details>
            );
          })}
          </section>

          {content.culture && (
            <section className="daily-lesson-modal__section">
              <h3 className="daily-lesson-modal__section-title">🌏 {t('culture', getNativeLanguage())}</h3>
              <details open className="daily-lesson-modal__page">
                <summary className="daily-lesson-modal__page-title">
                  {content.culture.title}
                </summary>
                <MarkdownView
                  source={content.culture.body}
                  linkResolver={wikilinkResolver}
                  ttsLanguage={lesson.language}
                  enableTts={tier === 'deep'}
                />
              </details>
            </section>
          )}
        </div>

        <div className="daily-lesson-modal__footer">
          {lesson.meta.relatedStages.length > 0 ? (
            <button
              className="daily-lesson-modal__practice-btn"
              style={{ background: color }}
              onClick={() => {
                onPractice(lesson.meta.relatedStages[0]);
                onClose();
              }}
              aria-label={`${t('practice', getNativeLanguage())} ${lesson.meta.relatedStages[0]}`}
            >
              🎮 {t('practice', getNativeLanguage())} ({lesson.meta.relatedStages[0]})
            </button>
          ) : (
            <span className="daily-lesson-modal__no-practice">
              {t('relatedStageComingSoon', getNativeLanguage())}
            </span>
          )}
          <button
            className="daily-lesson-modal__close-btn"
            onClick={onClose}
            aria-label={`${t('close', getNativeLanguage())} (Escape)`}
          >
            {t('close', getNativeLanguage())}
          </button>
          <small className="daily-lesson-modal__kbd-hint" aria-hidden="true">Esc to close</small>
        </div>
      </div>

      {/* Wikilink Sub-modal */}
      {wikilinkTarget && (
        <div
          className="daily-lesson-modal__wikilink-modal"
          onClick={() => setWikilinkTarget(null)}
        >
          <div
            className="daily-lesson-modal__wikilink-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="daily-lesson-modal__wikilink-header"
              style={{ background: color }}
            >
              <h3>{wikilinkTarget.title}</h3>
              <button
                className="daily-lesson-modal__close"
                onClick={() => setWikilinkTarget(null)}
                aria-label={t('close', getNativeLanguage())}
              >
                ✕
              </button>
            </div>
            <div className="daily-lesson-modal__wikilink-body">
              <MarkdownView
                source={wikilinkTarget.body}
                linkResolver={wikilinkResolver}
                ttsLanguage={lesson.language}
                enableTts={true}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .daily-lesson-modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          overflow-y: auto;
        }
        .daily-lesson-modal__content {
          background: #0d1420;
          border: 1px solid #1a2530;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .daily-lesson-modal__header {
          padding: 20px 24px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .daily-lesson-modal__lang {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          opacity: 0.85;
        }
        .daily-lesson-modal__title {
          font-size: 24px;
          margin: 4px 0;
        }
        .daily-lesson-modal__meta {
          font-size: 13px;
          opacity: 0.85;
        }
        .daily-lesson-modal__close {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .daily-lesson-modal__close:hover { background: rgba(255, 255, 255, 0.3); }

        .daily-lesson-modal__tier-selector {
          display: flex;
          gap: 8px;
          padding: 12px 24px;
          background: #06090f;
          border-bottom: 1px solid #1a2530;
        }
        .daily-lesson-modal__tier-btn {
          flex: 1;
          padding: 8px 12px;
          background: #1a2530;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #c5d4e3;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s;
        }
        .daily-lesson-modal__tier-btn:hover {
          background: #233040;
        }
        .daily-lesson-modal__tier-btn:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
        .daily-lesson-modal__tier-btn--active {
          font-weight: 600;
        }
        .daily-lesson-modal__tier-icon { font-size: 14px; }
        .daily-lesson-modal__tier-label { font-size: 13px; }
        .daily-lesson-modal__tier-time { opacity: 0.7; font-size: 11px; }

        .daily-lesson-modal__search-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 24px;
          background: #06090f;
          border-bottom: 1px solid #1a2530;
        }
        .daily-lesson-modal__search {
          flex: 1;
          background: #1a2530;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 6px 12px;
          color: #c5d4e3;
          font-size: 13px;
        }
        .daily-lesson-modal__search::placeholder {
          color: #6a7888;
        }
        .daily-lesson-modal__search:focus {
          outline: none;
          border-color: #00d9ff;
        }
        .daily-lesson-modal__progress-label {
          color: #66dd66;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .daily-lesson-modal__body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 24px;
        }
        .daily-lesson-modal__section { margin-bottom: 24px; }
        .daily-lesson-modal__section-title {
          font-size: 16px;
          color: #ffaa55;
          margin: 0 0 8px 0;
          padding-bottom: 4px;
          border-bottom: 1px solid #1a2530;
        }
        .daily-lesson-modal__raw-excerpt {
          background: #06090f;
          border-left: 3px solid #ffaa55;
          padding: 12px 16px;
          color: #c5d4e3;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
          font-style: italic;
        }
        .daily-lesson-modal__page {
          background: #06090f;
          border: 1px solid #1a2530;
          border-radius: 6px;
          margin-bottom: 8px;
          padding: 8px 12px;
        }
        .daily-lesson-modal__page summary {
          cursor: pointer;
          font-weight: 600;
          color: #66ffcc;
          font-size: 14px;
          padding: 4px 0;
          list-style: none;
        }
        .daily-lesson-modal__page summary::-webkit-details-marker { display: none; }
        .daily-lesson-modal__page summary::before {
          content: '▸ ';
          display: inline-block;
          transition: transform 0.15s;
        }
        .daily-lesson-modal__page[open] summary::before { content: '▾ '; }
        .daily-lesson-modal__page--learned {
          border-color: rgba(102, 221, 102, 0.4);
        }
        .daily-lesson-modal__learn-btn {
          background: none;
          border: none;
          font-size: 14px;
          cursor: pointer;
          padding: 0 6px 0 0;
          color: #6a7888;
          line-height: 1;
        }
        .daily-lesson-modal__learn-btn:hover {
          color: #66dd66;
        }
        .daily-lesson-modal__learn-btn--active {
          color: #66dd66;
        }
        .daily-lesson-modal__page .markdown-view {
          margin-top: 8px;
          color: #c5d4e3;
          font-size: 13px;
          line-height: 1.6;
        }
        .daily-lesson-modal__page .markdown-view h1 { font-size: 16px; color: #00d9ff; }
        .daily-lesson-modal__page .markdown-view h2 { font-size: 14px; color: #00d9ff; }
        .daily-lesson-modal__page .markdown-view h3 { font-size: 13px; color: #ffaa55; }
        .daily-lesson-modal__page .markdown-view p { margin: 6px 0; }
        .daily-lesson-modal__page .markdown-view ul { margin: 6px 0; padding-left: 20px; }
        .daily-lesson-modal__page .markdown-view li { margin: 3px 0; }
        .daily-lesson-modal__page .markdown-view code {
          background: #1a2530;
          padding: 1px 4px;
          border-radius: 3px;
          font-size: 12px;
        }
        .daily-lesson-modal__page .markdown-view a.wikilink {
          color: #00d9ff;
          text-decoration: underline;
          cursor: pointer;
        }
        .daily-lesson-modal__page .markdown-view a.wikilink:hover {
          background: rgba(0, 217, 255, 0.15);
        }
        .daily-lesson-modal__page .markdown-view a.wikilink--broken {
          color: #6a7888;
          text-decoration: line-through;
        }
        .daily-lesson-modal__footer {
          display: flex;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid #1a2530;
          background: #06090f;
        }
        .daily-lesson-modal__practice-btn {
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
        }
        .daily-lesson-modal__close-btn {
          background: #1a2530;
          color: #c5d4e3;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }
        .daily-lesson-modal__no-practice {
          color: #6a7888;
          font-style: italic;
          flex: 1;
        }

        .daily-lesson-modal__kbd-hint {
          color: #555;
          font-size: 11px;
          font-style: italic;
          align-self: center;
        }

        /* Wikilink sub-modal */
        .daily-lesson-modal__wikilink-modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }
        .daily-lesson-modal__wikilink-content {
          background: #0d1420;
          border: 1px solid #1a2530;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .daily-lesson-modal__wikilink-header {
          padding: 12px 20px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .daily-lesson-modal__wikilink-header h3 {
          margin: 0;
          font-size: 18px;
        }
        .daily-lesson-modal__wikilink-body {
          padding: 16px 20px;
          overflow-y: auto;
          color: #c5d4e3;
          font-size: 13px;
          line-height: 1.6;
        }
        .daily-lesson-modal__wikilink-body h1 { font-size: 16px; color: #00d9ff; }
        .daily-lesson-modal__wikilink-body h2 { font-size: 14px; color: #00d9ff; }
        .daily-lesson-modal__wikilink-body h3 { font-size: 13px; color: #ffaa55; }
        .daily-lesson-modal__wikilink-body p { margin: 6px 0; }
      `}</style>
    </div>
  );
}
