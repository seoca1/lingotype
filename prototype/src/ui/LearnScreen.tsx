/**
 * LearnScreen - Stage 시작 전 vocab 미리보기 화면
 *
 * Shows all words/sentences that will appear in the stage as a
 * pre-game study aid. Players can:
 * - Browse the vocab list
 * - Click a word to see its full wiki content (if available)
 * - Click "⚔️ 시작" to start the stage
 * - Click "← 뒤로" to go back
 *
 * This is the "preview" / "study" step that bridges stage selection
 * and gameplay, leveraging the existing daily lesson content.
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import type { StageConfig, Enemy } from '../types.js';
import { LANGUAGE_LABEL, type Language } from '../types.js';
import { getNativeLanguage, type NativeLanguage } from '../data/nativeLanguage.js';
import { getMeaning } from '../data/meaningResolver.js';
import { t } from '../data/uiTranslations.js';
import { lookupWikiPage } from '../data/wikiLookup.js';
import { MarkdownView } from './MarkdownView.js';

interface LearnScreenProps {
  stage: StageConfig;
  /** Pre-computed enemy list for vocab preview */
  enemies: Enemy[];
  onStart: () => void;
  onBack: () => void;
}

const LANG_COLORS: Record<Language, string> = {
  en: '#3b82f6',
  jp: '#ec4899',
  es: '#f59e0b',
  kr: '#10b981',
};

interface VocabPreview {
  id: string;
  display: string;
  input: string;
  meaning: string;
  level: number;
  category: string;
  source?: string;
}

export function LearnScreen({ stage, enemies, onStart, onBack }: LearnScreenProps) {
  const color = LANG_COLORS[stage.language];
  const [selectedVocab, setSelectedVocab] = useState<VocabPreview | null>(null);
  const [tier, setTier] = useState<'all' | 'core'>('all');

  // Get vocab from the pre-computed enemy list
  const nativeLanguage: NativeLanguage = getNativeLanguage();
  const vocabList: VocabPreview[] = useMemo(
    () =>
      enemies.slice(0, 30).map((e) => ({
        id: e.id,
        display: e.target.text,
        input: e.target.acceptedInputs[0] ?? '',
        meaning: getMeaning(e.target, nativeLanguage) ?? '',
        level: e.target.level,
        category: e.target.category ?? '',
        source: e.target.source,
      })),
    [enemies, nativeLanguage]
  );

  const displayedVocab =
    tier === 'core' ? vocabList.slice(0, 8) : vocabList;

  // Close selected vocab modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedVocab) {
          setSelectedVocab(null);
        } else {
          onBack();
        }
      } else if (e.key === 'Enter' && !selectedVocab) {
        onStart();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBack, onStart, selectedVocab]);

  // Phase 23: vocab-modal focus trap — focus the close button when a card
  // opens, restore prior focus on close, and trap Tab between the close
  // button and the TTS button. Mirrors the Phase 17 WeakWordModal pattern.
  const vocabModalRef = useRef<HTMLDivElement | null>(null);
  const vocabModalCloseRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedVocab) return;
    if (typeof document === 'undefined') return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    vocabModalCloseRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !vocabModalRef.current) return;
      const focusable = vocabModalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
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
  }, [selectedVocab]);

  return (
    <div className="learn-screen">
      <div className="learn-screen__header" style={{ background: color }}>
        <button
          className="learn-screen__back"
          onClick={onBack}
          aria-label={t('back', nativeLanguage)}
        >
          ← {t('back', nativeLanguage)}
        </button>
        <div className="learn-screen__title-block">
          <div className="learn-screen__lang">{LANGUAGE_LABEL[stage.language]}</div>
          <h1 className="learn-screen__title">📚 {stage.name}</h1>
          <p className="learn-screen__description">{stage.description}</p>
        </div>
        <button
          className="learn-screen__start"
          onClick={onStart}
          aria-label={`${t('start', nativeLanguage)} ${stage.name} (Enter)`}
          style={{ background: color }}
        >
          ⚔️ {t('start', nativeLanguage)} <kbd style={{ marginLeft: '6px', opacity: 0.85 }}>(Enter)</kbd>
        </button>
      </div>

      <div className="learn-screen__body">
        <div
          className="learn-screen__filter"
          role="group"
          aria-label={t('preview', nativeLanguage)}
        >
          <span className="learn-screen__filter-label">
            {t('preview', nativeLanguage)}:
          </span>
          <button
            className={`learn-screen__filter-btn ${
              tier === 'core' ? 'learn-screen__filter-btn--active' : ''
            }`}
            onClick={() => setTier('core')}
            aria-pressed={tier === 'core'}
            aria-label={`${t('core', nativeLanguage)} (${Math.min(8, vocabList.length)})`}
          >
            {t('core', nativeLanguage)} ({Math.min(8, vocabList.length)})
          </button>
          <button
            className={`learn-screen__filter-btn ${
              tier === 'all' ? 'learn-screen__filter-btn--active' : ''
            }`}
            onClick={() => setTier('all')}
            aria-pressed={tier === 'all'}
            aria-label={`${t('all', nativeLanguage)} (${vocabList.length})`}
          >
            {t('all', nativeLanguage)} ({vocabList.length})
          </button>
          <span
            className="learn-screen__filter-status"
            role="status"
            aria-live="polite"
            data-testid="learn-screen-filter-status"
            style={{
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            {tier === 'core'
              ? `${t('core', nativeLanguage)}: ${Math.min(8, vocabList.length)}`
              : `${t('all', nativeLanguage)}: ${vocabList.length}`}
          </span>
        </div>

        <div className="learn-screen__vocab-grid">
          {displayedVocab.map((v) => (
            <button
              key={v.id}
              className="learn-screen__vocab-card"
              onClick={() => setSelectedVocab(v)}
              aria-label={`${v.display}, meaning ${v.meaning || 'unavailable'}, level ${v.level}, category ${v.category || 'general'}. Activate to view details.`}
            >
              <div className="learn-screen__vocab-display">{v.display}</div>
              <div className="learn-screen__vocab-input">
                {v.input}
              </div>
              <div className="learn-screen__vocab-meaning">{v.meaning}</div>
              <div className="learn-screen__vocab-meta">
                <span className="learn-screen__vocab-level">L{v.level}</span>
                <span className="learn-screen__vocab-cat">{v.category}</span>
              </div>
              <button
                className="learn-screen__card-tts"
                onClick={(e) => {
                  e.stopPropagation();
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance(v.input);
                    const langMap: Record<string, string> = {
                      en: 'en-US',
                      jp: 'ja-JP',
                      es: 'es-ES',
                      kr: 'ko-KR',
                    };
                    u.lang = langMap[stage.language] ?? 'en-US';
                    u.rate = 0.85;
                    window.speechSynthesis.speak(u);
                  }
                }}
                aria-label="Play pronunciation"
              >
                🔊
              </button>
            </button>
          ))}
        </div>

        {displayedVocab.length === 0 && (
          <div className="learn-screen__empty">
            {nativeLanguage === 'ko'
              ? '이 스테이지의 단어 정보가 없습니다.'
              : nativeLanguage === 'ja'
              ? 'このステージの単語情報はありません。'
              : nativeLanguage === 'es'
              ? 'No hay información de palabras para esta etapa.'
              : 'No word information for this stage.'}
          </div>
        )}

        <div className="learn-screen__tip">
          💡 <strong>{t('tipHoverForMeaning', nativeLanguage).split('💡')[1]?.trim() || t('tipHoverForMeaning', nativeLanguage)}</strong>
        </div>

        <p
          className="learn-screen__kbd-hint"
          aria-label="Keyboard shortcuts"
          style={{
            color: '#6a7888',
            fontSize: '11px',
            marginTop: '12px',
            textAlign: 'center',
          }}
        >
          <small>
            <kbd>Enter</kbd> start stage · <kbd>Esc</kbd> back to menu
          </small>
        </p>
      </div>

      {/* Vocab Detail Modal */}
      {selectedVocab && (
        <div
          className="learn-screen__vocab-modal"
          onClick={() => setSelectedVocab(null)}
          ref={vocabModalRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedVocab.display} details`}
          data-testid="learn-screen-vocab-modal"
        >
          <div
            className="learn-screen__vocab-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="learn-screen__vocab-modal-header"
              style={{ background: color }}
            >
              <div>
                <h2>{selectedVocab.display}</h2>
                <div className="learn-screen__vocab-modal-input">
                  {selectedVocab.input}
                </div>
              </div>
              <button
                ref={vocabModalCloseRef}
                className="learn-screen__vocab-modal-close"
                onClick={() => setSelectedVocab(null)}
                aria-label={`${t('close', nativeLanguage)} (Escape)`}
              >
                ✕
              </button>
            </div>
            <div className="learn-screen__vocab-modal-body">
              <p className="learn-screen__vocab-modal-meaning">
                <strong>{t('meaning', nativeLanguage)}:</strong>{' '}
                {selectedVocab.meaning}
              </p>
              <div className="learn-screen__vocab-modal-tts">
                <button
                  className="learn-screen__tts-btn"
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(selectedVocab.input);
                      const langMap: Record<string, string> = {
                        en: 'en-US',
                        jp: 'ja-JP',
                        es: 'es-ES',
                        kr: 'ko-KR',
                      };
                      u.lang = langMap[stage.language] ?? 'en-US';
                      u.rate = 0.85;
                      window.speechSynthesis.speak(u);
                    }
                  }}
                >
                  🔊 {t('listeningTo', nativeLanguage)}
                </button>
              </div>
              {(() => {
              const wikiPage = lookupWikiPage(selectedVocab.source, stage.language);
              if (wikiPage) {
                return (
                  <div className="learn-screen__vocab-modal-section">
                    <h3>📖 Wiki</h3>
                    <MarkdownView
                      source={wikiPage.body}
                      ttsLanguage={stage.language}
                      enableTts={true}
                    />
                  </div>
                );
              }
              return null;
              })()}
              <div className="learn-screen__vocab-modal-section">
                <h3>💡 {t('studyNote', nativeLanguage)}</h3>
                <p>
                  {nativeLanguage === 'ko'
                    ? `이 단어는 스테이지에서 ${Math.max(1, Math.ceil(vocabList.length / 8))}번 이상 등장합니다. 마스터하면 자동으로 진행 상황을 추적합니다.`
                    : nativeLanguage === 'ja'
                    ? `この単語はステージで${Math.max(1, Math.ceil(vocabList.length / 8))}回以上出現します。マスターすると自動的に進捗を追跡します。`
                    : nativeLanguage === 'es'
                    ? `Esta palabra aparece al menos ${Math.max(1, Math.ceil(vocabList.length / 8))} veces en esta etapa. Tu progreso se rastrea automáticamente.`
                    : `This word appears at least ${Math.max(1, Math.ceil(vocabList.length / 8))} times in this stage. Progress is tracked automatically.`}
                </p>
              </div>
              <div className="learn-screen__vocab-modal-section">
                <h3>📊 {t('wordInfo', nativeLanguage)}</h3>
                <table className="learn-screen__vocab-info-table">
                  <tbody>
                    <tr>
                      <th>{t('display', nativeLanguage)}</th>
                      <td>{selectedVocab.display}</td>
                    </tr>
                    <tr>
                      <th>{t('input', nativeLanguage)}</th>
                      <td><code>{selectedVocab.input}</code></td>
                    </tr>
                    <tr>
                      <th>{t('meaning', nativeLanguage)}</th>
                      <td>{selectedVocab.meaning}</td>
                    </tr>
                    <tr>
                      <th>{t('level', nativeLanguage)}</th>
                      <td>Level {selectedVocab.level}</td>
                    </tr>
                    <tr>
                      <th>{t('category', nativeLanguage)}</th>
                      <td>{selectedVocab.category}</td>
                    </tr>
                    {selectedVocab.source && (
                      <tr>
                        <th>Source</th>
                        <td>{selectedVocab.source}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .learn-screen {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #06090f;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }
        .learn-screen__header {
          padding: 20px 32px;
          color: white;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .learn-screen__back {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          flex-shrink: 0;
        }
        .learn-screen__back:hover { background: rgba(255, 255, 255, 0.25); }

        .learn-screen__title-block {
          flex: 1;
        }
        .learn-screen__lang {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          opacity: 0.85;
        }
        .learn-screen__title {
          font-size: 24px;
          margin: 4px 0;
        }
        .learn-screen__description {
          font-size: 13px;
          opacity: 0.85;
          margin: 0;
        }
        .learn-screen__start {
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
        }
        .learn-screen__start:hover { filter: brightness(1.1); }

        .learn-screen__body {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
        }

        .learn-screen__filter {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .learn-screen__filter-label {
          color: #6a7888;
          font-size: 12px;
        }
        .learn-screen__filter-btn {
          background: #1a2530;
          color: #c5d4e3;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .learn-screen__filter-btn--active {
          background: rgba(0, 217, 255, 0.2);
          color: #00d9ff;
          border-color: #00d9ff;
        }

        .learn-screen__vocab-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }
        .learn-screen__vocab-card {
          background: #0d1420;
          border: 1px solid #1a2530;
          border-radius: 8px;
          padding: 12px 14px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          color: #c5d4e3;
          position: relative;
        }
        .learn-screen__vocab-card:hover {
          background: #1a2530;
          border-color: #00d9ff;
          transform: translateY(-2px);
        }
        .learn-screen__vocab-display {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
        .learn-screen__vocab-input {
          font-size: 12px;
          color: #00d9ff;
          font-family: monospace;
          margin-bottom: 6px;
        }
        .learn-screen__vocab-meaning {
          font-size: 12px;
          color: #b4d2fa;
          margin-bottom: 6px;
          line-height: 1.4;
        }
        .learn-screen__vocab-meta {
          display: flex;
          gap: 6px;
          font-size: 10px;
        }
        .learn-screen__card-tts {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 217, 255, 0.1);
          border: none;
          border-radius: 4px;
          padding: 4px 6px;
          font-size: 14px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .learn-screen__vocab-card:hover .learn-screen__card-tts {
          opacity: 1;
        }
        .learn-screen__card-tts:hover {
          background: rgba(0, 217, 255, 0.25);
        }
        .learn-screen__vocab-level {
          background: rgba(255, 170, 85, 0.2);
          color: #ffaa55;
          padding: 1px 6px;
          border-radius: 3px;
        }
        .learn-screen__vocab-cat {
          background: rgba(102, 221, 102, 0.15);
          color: #66dd66;
          padding: 1px 6px;
          border-radius: 3px;
        }

        .learn-screen__empty {
          text-align: center;
          color: #6a7888;
          padding: 60px 0;
          font-style: italic;
        }

        .learn-screen__tip {
          background: rgba(0, 217, 255, 0.08);
          border-left: 3px solid #00d9ff;
          padding: 10px 16px;
          font-size: 13px;
          color: #c5d4e3;
          border-radius: 4px;
        }

        /* Vocab Detail Modal */
        .learn-screen__vocab-modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 20px;
        }
        .learn-screen__vocab-modal-content {
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
        .learn-screen__vocab-modal-header {
          padding: 16px 20px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .learn-screen__vocab-modal-header h2 {
          margin: 0;
          font-size: 22px;
        }
        .learn-screen__vocab-modal-input {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          font-family: monospace;
          margin-top: 4px;
        }
        .learn-screen__vocab-modal-close {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
        }
        .learn-screen__vocab-modal-body {
          padding: 16px 20px;
          overflow-y: auto;
          color: #c5d4e3;
          font-size: 13px;
          line-height: 1.6;
        }
        .learn-screen__vocab-modal-meaning {
          background: rgba(0, 217, 255, 0.05);
          padding: 10px 14px;
          border-radius: 6px;
          margin: 0 0 14px 0;
        }
        .learn-screen__vocab-modal-section {
          margin-bottom: 14px;
        }
        .learn-screen__vocab-modal-section h3 {
          font-size: 14px;
          color: #ffaa55;
          margin: 0 0 6px 0;
        }
        .learn-screen__vocab-modal-tts {
          margin: 8px 0 16px;
        }
        .learn-screen__tts-btn {
          background: rgba(0, 217, 255, 0.15);
          color: #00d9ff;
          border: 1px solid #00d9ff;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .learn-screen__tts-btn:hover { background: rgba(0, 217, 255, 0.25); }
        .learn-screen__vocab-info-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .learn-screen__vocab-info-table th,
        .learn-screen__vocab-info-table td {
          padding: 6px 10px;
          border: 1px solid #1a2530;
          text-align: left;
        }
        .learn-screen__vocab-info-table th {
          background: #1a2530;
          color: #00d9ff;
          font-weight: 600;
          width: 80px;
        }
        .learn-screen__vocab-info-table code {
          background: #06090f;
          padding: 1px 4px;
          border-radius: 3px;
        }

        @media (max-width: 600px) {
          .learn-screen__header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .learn-screen__vocab-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }
        }

        /* Phase 31: focus-visible ring on the LearnScreen actionable
           controls. Phase 23 added the focus-trap + aria-label on the
           vocab-detail modal close + TTS button, and Phase 23's filter
           buttons wired aria-pressed + aria-label — but neither the
           filter buttons nor the vocab-card buttons shipped a visible
           focus indicator. Keyboard users tabbing through the preview
           had no visual confirmation of which card was selected. 2px
           cyan outline + 2px offset matches the .warning-btn rule
           (Phase 30) so the modal pattern stays consistent. */
        .learn-screen__filter-btn:focus-visible,
        .learn-screen__vocab-card:focus-visible,
        .learn-screen__vocab-modal-close:focus-visible,
        .learn-screen__tts-btn:focus-visible,
        .learn-screen__card-tts:focus-visible,
        .learn-screen__back:focus-visible,
        .learn-screen__start:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
