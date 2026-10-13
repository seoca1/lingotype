/**
 * SettingsScreen — User preferences
 *
 * Phase G: Allows users to change their native language at runtime.
 * Without this screen, users would have to use browser DevTools to
 * set localStorage. Now it's a one-click operation.
 *
 * Settings:
 * - Native language (the language UI/explanations are shown in)
 * - Sound enabled/disabled
 * - Volume slider
 */

import { useEffect, useRef, useState } from 'react';
import {
  getNativeLanguage,
  setNativeLanguage,
  NATIVE_LANGUAGE_LABELS,
  NATIVE_LANGUAGE_SHORT,
  type NativeLanguage,
} from '../data/nativeLanguage.js';
import { t } from '../data/uiTranslations.js';
import { getAudioManager } from '../audio/AudioManager.js';
import { LANGUAGE_LABEL, type Language } from '../types.js';

interface SettingsScreenProps {
  /** Current learning language (for display) */
  language?: Language;
  onClose: () => void;
}

const ALL_NATIVE_LANGS: NativeLanguage[] = ['en', 'ko', 'ja', 'es'];

export function SettingsScreen({ language, onClose }: SettingsScreenProps) {
  const audio = getAudioManager();
  const [native, setNative] = useState<NativeLanguage>(getNativeLanguage());
  const [volume, setVolume] = useState(audio.getVolume());
  const [soundEnabled, setSoundEnabled] = useState(audio.isEnabled());
  // Phase 30: transient "Settings saved" indicator (mirrors Phase 19 OptionsScreen)
  const [savedAt, setSavedAt] = useState<number | null>(null);
  // Phase 31: debounce the volume savedAt tick so dragging the slider does
  // not retrigger the aria-live="polite" saved indicator ~10 times per drag
  // (SR users would hear "Settings saved" repeatedly).
  const volumeSaveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (volumeSaveTimerRef.current !== null) {
        window.clearTimeout(volumeSaveTimerRef.current);
      }
    };
  }, []);

  const handleNativeChange = (lang: NativeLanguage) => {
    setNative(lang);
    setNativeLanguage(lang);
    setSavedAt(Date.now());
    // Optional: visual feedback by playing TTS for the new language
    if (soundEnabled && 'speechSynthesis' in window) {
      const label = NATIVE_LANGUAGE_LABELS[lang];
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(label);
      const langMap: Record<NativeLanguage, string> = {
        en: 'en-US',
        ko: 'ko-KR',
        ja: 'ja-JP',
        es: 'es-ES',
      };
      u.lang = langMap[lang];
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    audio.setVolume(v);
    if (volumeSaveTimerRef.current !== null) {
      window.clearTimeout(volumeSaveTimerRef.current);
    }
    volumeSaveTimerRef.current = window.setTimeout(() => {
      setSavedAt(Date.now());
    }, 400);
  };

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    audio.setEnabled(newEnabled);
    setSavedAt(Date.now());
  };

  return (
    <div className="settings-screen">
      <div className="settings-screen__header">
        <h1>⚙️ {t('settings', native)}</h1>
        <button
          className="settings-screen__close"
          onClick={onClose}
          aria-label={t('close', native)}
        >
          ✕
        </button>
      </div>

      <div className="settings-screen__body">
        {/* Native Language Section */}
        <section className="settings-section">
          <h2 className="settings-section__title">🌐 {t('nativeLanguage', native)}</h2>
          <p className="settings-section__desc">
            {native === 'ko' && 'UI와 학습 자료 설명을 이 언어로 표시합니다.'}
            {native === 'ja' && 'UIと学習資料の説明をこの言語で表示します。'}
            {native === 'es' && 'La UI y las explicaciones se mostrarán en este idioma.'}
            {native === 'en' && 'UI and learning explanations will be shown in this language.'}
          </p>
          <div className="settings-section__lang-grid">
            {ALL_NATIVE_LANGS.map((lang) => (
              <button
                key={lang}
                className={`settings-lang-btn ${
                  native === lang ? 'settings-lang-btn--active' : ''
                }`}
                onClick={() => handleNativeChange(lang)}
              >
                <span className="settings-lang-btn__short">
                  {NATIVE_LANGUAGE_SHORT[lang]}
                </span>
                <span className="settings-lang-btn__full">
                  {NATIVE_LANGUAGE_LABELS[lang]}
                </span>
                {native === lang && <span className="settings-lang-btn__check">✓</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Sound Section */}
        <section className="settings-section">
          <h2 className="settings-section__title">
            🔊 {t('sound', native)}
          </h2>
          <div className="settings-section__row">
            {/* Phase 26: htmlFor/id pairing + aria-label on the sound toggle
               so SR tools that walk the accessibility tree (rather than rely
               on DOM nesting) still hear "Sound, toggle" on focus. */}
            <label className="settings-toggle" htmlFor="settings-sound-toggle">
              <input
                id="settings-sound-toggle"
                type="checkbox"
                checked={soundEnabled}
                onChange={toggleSound}
                aria-label={t('sound', native)}
              />
              <span>{soundEnabled ? t('on', native) : t('off', native)}</span>
            </label>
            {soundEnabled && (
              <div className="settings-volume">
                {/* Phase 26: explicit htmlFor binding on the volume label so
                   the label association survives CSS repositioning. Phase 36
                   upgrade: full aria-valuenow/valuemin/valuemax tuple on a
                   0-100 percent scale so older SR engines (VoiceOver / NVDA)
                   announce the live numeric value while aria-valuetext
                   continues to carry the natural-language phrasing. */}
                <label htmlFor="settings-volume-slider">
                  {t('volume', native)}: {Math.round(volume * 100)}%
                  <input
                    id="settings-volume-slider"
                    type="range"
                    role="progressbar"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-label={t('volume', native)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(volume * 100)}
                    aria-valuetext={`${Math.round(volume * 100)} percent`}
                  />
                </label>
              </div>
            )}
          </div>
        </section>

        {/* Current Language (read-only) */}
        {language && (
          <section className="settings-section">
            <h2 className="settings-section__title">
              📚 {t('language', native)}
            </h2>
            <div className="settings-current-lang">
              <span className="settings-current-lang__label">
                {t('language', native)}:
              </span>
              <span className="settings-current-lang__value">
                {LANGUAGE_LABEL[language]}
              </span>
            </div>
            <p className="settings-section__hint">
              {native === 'ko' && '언어를 변경하려면 메인 화면의 뒤로가기를 누르세요.'}
              {native === 'ja' && '言語を変更するには、メイン画面の「戻る」を押してください。'}
              {native === 'es' && 'Para cambiar de idioma, pulsa «Atrás» en la pantalla principal.'}
              {native === 'en' && 'To change language, press "Back" on the main screen.'}
            </p>
          </section>
        )}

        {/* Version info */}
        {savedAt !== null && (
          <div
            className="settings-saved-indicator"
            role="status"
            aria-live="polite"
            data-testid="settings-saved-indicator"
          >
            ✓ {t('settingsSaved', native)}
          </div>
        )}
        <section className="settings-section settings-section--footer">
          <p className="settings-version">
            Typing Language Game v1.0 · {new Date().getFullYear()}
          </p>
          <p className="settings-footer-hint">{t('pressEscToClose', native)}</p>
        </section>
      </div>

      <style>{`
        .settings-screen {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #06090f;
          color: #c5d4e3;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .settings-screen__header {
          padding: 16px 24px;
          border-bottom: 1px solid #1a2530;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #0d1420;
        }
        .settings-screen__header h1 {
          font-size: 22px;
          color: #00d9ff;
          margin: 0;
        }
        .settings-screen__close {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
        }
        .settings-screen__close:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .settings-screen__close:focus-visible,
        .settings-lang-btn:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
        .settings-screen__body {
          flex: 1;
          padding: 24px;
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }
        .settings-section {
          background: #0d1420;
          border: 1px solid #1a2530;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .settings-section__title {
          font-size: 18px;
          color: #ffaa55;
          margin: 0 0 8px 0;
        }
        .settings-section__desc {
          color: #b4d2fa;
          font-size: 13px;
          margin: 0 0 16px 0;
        }
        .settings-section__hint {
          color: #6a7888;
          font-size: 12px;
          margin: 8px 0 0 0;
          font-style: italic;
        }
        .settings-section--footer {
          text-align: center;
          background: transparent;
          border: none;
          padding: 12px;
        }
        .settings-version {
          color: #6a7888;
          font-size: 12px;
          margin: 0;
        }
        .settings-section__lang-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }
        .settings-lang-btn {
          background: #1a2530;
          border: 2px solid transparent;
          border-radius: 8px;
          padding: 12px 16px;
          cursor: pointer;
          color: #c5d4e3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-family: inherit;
          position: relative;
          transition: all 0.15s;
        }
        .settings-lang-btn:hover {
          background: #233040;
        }
        .settings-lang-btn--active {
          background: rgba(0, 217, 255, 0.15);
          border-color: #00d9ff;
          color: #fff;
        }
        .settings-lang-btn__short {
          font-size: 22px;
          font-weight: 700;
        }
        .settings-lang-btn__full {
          font-size: 12px;
          opacity: 0.85;
        }
        .settings-lang-btn__check {
          position: absolute;
          top: 6px;
          right: 8px;
          color: #00d9ff;
          font-weight: 700;
          font-size: 14px;
        }
        .settings-section__row {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        .settings-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #fff;
          font-size: 14px;
        }
        .settings-toggle input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .settings-volume label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #c5d4e3;
          font-size: 13px;
        }
        .settings-volume input[type="range"] {
          width: 200px;
        }
        .settings-current-lang {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .settings-current-lang__label {
          color: #6a7888;
          font-size: 13px;
        }
        .settings-current-lang__value {
          color: #66dd66;
          font-size: 16px;
          font-weight: 600;
        }
        .settings-saved-indicator {
          background: rgba(102, 221, 102, 0.1);
          border: 1px solid #66dd66;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 16px;
          color: #66dd66;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}