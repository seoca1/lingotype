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
import {
  getKoreanInputMode,
  setKoreanInputMode,
  type KoreanInputMode,
} from '../data/koreanInputMode.js';
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
  const [krInputMode, setKrInputMode] = useState<KoreanInputMode>(getKoreanInputMode());

  const handleNativeChange = (lang: NativeLanguage) => {
    setNative(lang);
    setNativeLanguage(lang);
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
  };

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    audio.setEnabled(newEnabled);
  };

  const handleKrInputModeChange = (mode: KoreanInputMode) => {
    setKoreanInputMode(mode);
    setKrInputMode(mode);
  };

  // Phase 14: focus management (mirrors OptionsScreen) — focus the close
  // button on mount, restore previous focus on unmount, and let Escape
  // dismiss the modal.
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

  return (
    <div
      className="settings-screen"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('settings', native)}
      data-testid="settings-screen"
    >
      <div className="settings-screen__header">
        <h1>⚙️ {t('settings', native)}</h1>
        <button
          ref={closeButtonRef}
          className="settings-screen__close"
          onClick={onClose}
          aria-label={`${t('close', native)} (Escape)`}
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
          <div
            className="settings-section__lang-grid"
            role="group"
            aria-label={t('nativeLanguage', native)}
          >
            {ALL_NATIVE_LANGS.map((lang) => (
              <button
                key={lang}
                className={`settings-lang-btn ${
                  native === lang ? 'settings-lang-btn--active' : ''
                }`}
                onClick={() => handleNativeChange(lang)}
                aria-label={`${NATIVE_LANGUAGE_LABELS[lang]}${native === lang ? ' (selected)' : ''}`}
                aria-pressed={native === lang}
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
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={toggleSound}
              />
              <span>{soundEnabled ? t('on', native) : t('off', native)}</span>
            </label>
            {soundEnabled && (
              <div className="settings-volume">
                <label>
                  {t('volume', native)}: {Math.round(volume * 100)}%
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
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

        {/* Korean Input Mode */}
        {language === 'kr' && (
          <section className="settings-section">
            <h2 className="settings-section__title">⌨️ 한국어 입력 방식</h2>
            <p className="settings-section__desc">
              {native === 'ko' && '타이핑 방식을 선택하세요:'}
              {native === 'ja' && 'タイピング方式を選択してください:'}
              {native === 'es' && 'Selecciona el método de escritura:'}
              {native === 'en' && 'Choose your typing method:'}
            </p>
            <div
              className="settings-kr-input-grid"
              role="group"
              aria-label="Korean input mode"
            >
              <button
                className={`settings-lang-btn ${
                  krInputMode === 'jamo' ? 'settings-lang-btn--active' : ''
                }`}
                onClick={() => handleKrInputModeChange('jamo')}
                aria-label={`Jamo input${krInputMode === 'jamo' ? ' (selected)' : ''}`}
                aria-pressed={krInputMode === 'jamo'}
              >
                <span className="settings-lang-btn__short">ㄱ</span>
                <span className="settings-lang-btn__full">
                  {native === 'ko' && '자모 입력'}
                  {native === 'ja' && '자모入力'}
                  {native === 'es' && 'Jamo'}
                  {native === 'en' && 'Jamo (Korean keyboard)'}
                </span>
                {krInputMode === 'jamo' && <span className="settings-lang-btn__check">✓</span>}
              </button>
              <button
                className={`settings-lang-btn ${
                  krInputMode === 'romanized' ? 'settings-lang-btn--active' : ''
                }`}
                onClick={() => handleKrInputModeChange('romanized')}
                aria-label={`Romanized input${krInputMode === 'romanized' ? ' (selected)' : ''}`}
                aria-pressed={krInputMode === 'romanized'}
              >
                <span className="settings-lang-btn__short">a</span>
                <span className="settings-lang-btn__full">
                  {native === 'ko' && '로마자 입력'}
                  {native === 'ja' && 'ローマ字入力'}
                  {native === 'es' && 'Romanizado'}
                  {native === 'en' && 'Romanized (QWERTY)'}
                </span>
                {krInputMode === 'romanized' && <span className="settings-lang-btn__check">✓</span>}
              </button>
            </div>
            <p className="settings-section__hint">
              {native === 'ko' && '※ 로마자 입력은 한글 키보드가 없어도 됩니다'}
              {native === 'ja' && '※ ローマ字入力は韓国語キーボード不要'}
              {native === 'es' && '※ El modo romanizado no requiere teclado coreano'}
              {native === 'en' && '※ Romanized mode works without a Korean keyboard'}
            </p>
          </section>
        )}

        {/* Version info */}
        <section className="settings-section settings-section--footer">
          <p className="settings-version">
            Typing Language Game v1.0 · {new Date().getFullYear()}
          </p>
        </section>
      </div>

      <footer className="settings-screen__footer">
        <small>Press Esc to close</small>
      </footer>

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
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .settings-screen__close:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .settings-screen__close:focus-visible {
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
        .settings-toggle input:focus-visible,
        .settings-volume input:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
        .settings-lang-btn:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
        .settings-screen__footer {
          padding: 12px 24px 20px;
          text-align: center;
          color: #6a7888;
          font-size: 12px;
          border-top: 1px solid #1a2530;
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
      `}</style>
    </div>
  );
}