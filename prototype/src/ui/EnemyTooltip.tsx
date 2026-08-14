/**
 * EnemyTooltip - Hover tooltip for in-game enemies
 *
 * Shows when mouse hovers over the current enemy's text area.
 * Displays:
 * - Meaning (in user's native language)
 * - Pronunciation guide
 * - TTS button (Web Speech API)
 *
 * Phase F: Tooltip labels translated via uiTranslations; meaning resolved
 * via meaningResolver based on the user's native language.
 */

import type { Target } from '../types.js';
import { getNativeLanguage, type NativeLanguage } from '../data/nativeLanguage.js';
import { getMeaning } from '../data/meaningResolver.js';
import { t } from '../data/uiTranslations.js';

interface EnemyTooltipProps {
  target: Target;
  x: number;
  y: number;
  language: string;
  onTtsPlay: (text: string, lang: string) => void;
  onClose: () => void;
}

const TTS_LANG_MAP: Record<string, string> = {
  en: 'en-US',
  jp: 'ja-JP',
  ja: 'ja-JP',
  es: 'es-ES',
  kr: 'ko-KR',
  ko: 'ko-KR',
};

export function EnemyTooltip({
  target,
  x,
  y,
  language,
  onTtsPlay,
  onClose,
}: EnemyTooltipProps) {
  const ttsLang = TTS_LANG_MAP[language] ?? 'en-US';
  const nativeLanguage: NativeLanguage = getNativeLanguage();
  const meaning = getMeaning(target, nativeLanguage);

  // Position tooltip — keep within viewport
  const tooltipWidth = 280;
  const tooltipX = Math.min(window.innerWidth - tooltipWidth - 16, Math.max(16, x + 20));
  const tooltipY = Math.max(16, Math.min(window.innerHeight - 200, y - 60));

  const handleTts = (text: string) => {
    onTtsPlay(text, ttsLang);
  };

  // Phase 25: Close-button label gets the (Escape) suffix so the keyboard
  // shortcut is discoverable from the dialog's only persistent action.
  const closeLabel = `${t('close', nativeLanguage)} (Escape)`;

  return (
    <div
      className="enemy-tooltip"
      style={{ left: tooltipX, top: tooltipY }}
      onMouseEnter={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="false"
      aria-label={`${target.text} details`}
    >
      <button
        className="enemy-tooltip__close"
        onClick={onClose}
        aria-label={closeLabel}
      >
        ✕
      </button>

      <div className="enemy-tooltip__header">
        <div className="enemy-tooltip__display">{target.text}</div>
        {target.acceptedInputs[0] && (
          <div className="enemy-tooltip__input">
            <code>{target.acceptedInputs[0]}</code>
            <button
              className="enemy-tooltip__tts-btn"
              onClick={() => handleTts(target.acceptedInputs[0])}
              title={t('listeningTo', nativeLanguage)}
              aria-label={t('listeningTo', nativeLanguage)}
            >
              🔊
            </button>
          </div>
        )}
      </div>

      {meaning && (
        <div className="enemy-tooltip__meaning">
          <span className="enemy-tooltip__label">{t('meaning', nativeLanguage)}:</span>{' '}
          {meaning}
        </div>
      )}

      {(target as any).pronunciation && (
        <div className="enemy-tooltip__pron">
          <span className="enemy-tooltip__label">
            {t('pronunciation', nativeLanguage)}:
          </span>{' '}
          <code>{(target as any).pronunciation}</code>
        </div>
      )}

      <div className="enemy-tooltip__meta">
        {target.category && (
          <span className="enemy-tooltip__cat" aria-hidden="true">📁 {target.category}</span>
        )}
        {target.level !== undefined && (
          <span className="enemy-tooltip__level" aria-hidden="true">
            📊 {t('level', nativeLanguage)} {target.level}
          </span>
        )}
      </div>

      <style>{`
        .enemy-tooltip {
          position: fixed;
          background: #0d1420;
          border: 2px solid #00d9ff;
          border-radius: 8px;
          padding: 12px 16px;
          width: 280px;
          max-width: calc(100vw - 32px);
          color: #c5d4e3;
          font-size: 13px;
          line-height: 1.5;
          z-index: 1000;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          pointer-events: auto;
        }
        .enemy-tooltip__close {
          position: absolute;
          top: 4px;
          right: 4px;
          background: transparent;
          border: none;
          color: #6a7888;
          font-size: 14px;
          cursor: pointer;
          padding: 2px 6px;
        }
        .enemy-tooltip__close:hover { color: #fff; }
        .enemy-tooltip__header {
          margin-bottom: 8px;
          padding-right: 24px;
        }
        .enemy-tooltip__display {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
        .enemy-tooltip__input {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }
        .enemy-tooltip__input code {
          background: #1a2530;
          padding: 2px 6px;
          border-radius: 3px;
          color: #00d9ff;
          font-family: monospace;
        }
        .enemy-tooltip__tts-btn {
          background: rgba(0, 217, 255, 0.1);
          border: 1px solid #00d9ff;
          color: #00d9ff;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          cursor: pointer;
        }
        .enemy-tooltip__tts-btn:hover {
          background: rgba(0, 217, 255, 0.25);
        }
        .enemy-tooltip__meaning {
          background: rgba(0, 217, 255, 0.05);
          padding: 6px 8px;
          border-radius: 4px;
          margin-bottom: 6px;
          font-size: 13px;
        }
        .enemy-tooltip__alt {
          font-size: 12px;
          color: #b4d2fa;
          margin-bottom: 4px;
        }
        .enemy-tooltip__pron {
          font-size: 12px;
          color: #b4d2fa;
          margin-bottom: 6px;
        }
        .enemy-tooltip__pron code {
          background: #1a2530;
          padding: 1px 4px;
          border-radius: 3px;
        }
        .enemy-tooltip__meta {
          display: flex;
          gap: 8px;
          font-size: 11px;
          margin-top: 8px;
          padding-top: 6px;
          border-top: 1px solid #1a2530;
        }
        .enemy-tooltip__cat {
          color: #66dd66;
        }
        .enemy-tooltip__level {
          color: #ffaa55;
        }
        .enemy-tooltip__label {
          color: #6a7888;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
